import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';
import { MailService } from './mail.service';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

type Provider = 'GOOGLE' | 'FACEBOOK';
type SessionUser = { id: string; name: string; email: string; role: any; status?: any };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  private hashToken(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private async access(user: { id: string; email: string; role: any }) {
    return this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: (process.env.ACCESS_TOKEN_TTL || '15m') as any },
    );
  }

  private async refresh(user: { id: string; email: string; role: any }) {
    const raw = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: `${Number(process.env.REFRESH_TOKEN_DAYS || 7)}d` as any },
    );
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(raw),
        expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_DAYS || 7) * 86400000),
      },
    });
    return raw;
  }

  private async session(user: SessionUser) {
    if (user.status && user.status !== 'ACTIVE') throw new UnauthorizedException('Usuário bloqueado');
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken: await this.access(user),
      refreshToken: await this.refresh(user),
    };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.prisma.user.findUnique({ where: { email } })) throw new ConflictException('E-mail já cadastrado');
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash: await bcrypt.hash(dto.password, 12),
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        city: dto.city,
        state: dto.state?.toUpperCase(),
      },
    });
    return this.session(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase().trim() } });
    if (!user || user.status !== 'ACTIVE' || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.session(user);
  }

  async renew(raw: string) {
    try {
      const payload = await this.jwt.verifyAsync(raw, { secret: process.env.JWT_REFRESH_SECRET });
      const found = await this.prisma.refreshToken.findUnique({
        where: { tokenHash: this.hashToken(raw) },
        include: { user: true },
      });
      if (!found || found.revokedAt || found.expiresAt < new Date() || found.user.status !== 'ACTIVE' || found.userId !== payload.sub) throw new Error();
      await this.prisma.refreshToken.update({ where: { id: found.id }, data: { revokedAt: new Date() } });
      return this.session(found.user);
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(raw?: string) {
    if (raw) {
      const token = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hashToken(raw) } });
      if (token && !token.revokedAt) await this.prisma.refreshToken.update({ where: { id: token.id }, data: { revokedAt: new Date() } });
    }
    return { message: 'Sessão encerrada' };
  }

  async forgot(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const generic = { message: 'Se o e-mail estiver cadastrado, as instruções serão enviadas.' };
    if (!user) return generic;

    const raw = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: this.hashToken(raw), expiresAt: new Date(Date.now() + 30 * 60000) },
    });

    let sent = false;
    try {
      sent = await this.mail.sendPasswordReset(user.email, user.name, raw);
    } catch (error) {
      console.error('Falha ao enviar recuperação de senha:', error);
    }

    if (process.env.NODE_ENV !== 'production' && !sent) {
      return { message: 'SMTP não configurado. Token de desenvolvimento gerado.', resetToken: raw };
    }
    return generic;
  }

  async reset(dto: ResetPasswordDto) {
    const token = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash: this.hashToken(dto.token) } });
    if (!token || token.usedAt || token.expiresAt < new Date()) throw new UnauthorizedException('Token inválido ou expirado');
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: token.userId }, data: { passwordHash: await bcrypt.hash(dto.password, 12) } }),
      this.prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
      this.prisma.refreshToken.updateMany({ where: { userId: token.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    return { message: 'Senha alterada com sucesso' };
  }

  async socialAuthorizationUrl(provider: Provider) {
    const state = await this.jwt.signAsync(
      { type: 'oauth-state', provider },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' },
    );

    if (provider === 'GOOGLE') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${process.env.API_URL || 'http://localhost:3333'}/api/v1/auth/google/callback`;
      if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) throw new ServiceUnavailableException('Login com Google ainda não foi configurado');
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'select_account',
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FACEBOOK_CALLBACK_URL || `${process.env.API_URL || 'http://localhost:3333'}/api/v1/auth/facebook/callback`;
    if (!appId || !process.env.FACEBOOK_APP_SECRET) throw new ServiceUnavailableException('Login com Facebook ainda não foi configurado');
    const version = process.env.FACEBOOK_GRAPH_VERSION || 'v23.0';
    const params = new URLSearchParams({ client_id: appId, redirect_uri: redirectUri, response_type: 'code', scope: 'email,public_profile', state });
    return `https://www.facebook.com/${version}/dialog/oauth?${params.toString()}`;
  }

  async socialCallback(provider: Provider, code?: string, state?: string) {
    if (!code || !state) throw new BadRequestException('Autorização social incompleta');
    try {
      const payload = await this.jwt.verifyAsync(state, { secret: process.env.JWT_ACCESS_SECRET });
      if (payload.type !== 'oauth-state' || payload.provider !== provider) throw new Error();
    } catch {
      throw new UnauthorizedException('Estado OAuth inválido ou expirado');
    }

    const profile = provider === 'GOOGLE' ? await this.googleProfile(code) : await this.facebookProfile(code);
    return this.loginOrCreateSocial(provider, profile);
  }

  private async googleProfile(code: string) {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${process.env.API_URL || 'http://localhost:3333'}/api/v1/auth/google/callback`;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenResponse.ok) throw new UnauthorizedException('Não foi possível autenticar com Google');
    const tokens: any = await tokenResponse.json();
    const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!response.ok) throw new UnauthorizedException('Não foi possível obter o perfil do Google');
    const data: any = await response.json();
    if (!data.sub || !data.email) throw new BadRequestException('A conta Google não forneceu um e-mail válido');
    return { providerAccountId: String(data.sub), email: String(data.email).toLowerCase(), name: String(data.name || data.email), profileImage: data.picture ? String(data.picture) : undefined };
  }

  private async facebookProfile(code: string) {
    const version = process.env.FACEBOOK_GRAPH_VERSION || 'v23.0';
    const redirectUri = process.env.FACEBOOK_CALLBACK_URL || `${process.env.API_URL || 'http://localhost:3333'}/api/v1/auth/facebook/callback`;
    const tokenUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
    tokenUrl.search = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID || '',
      client_secret: process.env.FACEBOOK_APP_SECRET || '',
      redirect_uri: redirectUri,
      code,
    }).toString();
    const tokenResponse = await fetch(tokenUrl);
    if (!tokenResponse.ok) throw new UnauthorizedException('Não foi possível autenticar com Facebook');
    const tokens: any = await tokenResponse.json();
    const profileUrl = new URL(`https://graph.facebook.com/${version}/me`);
    profileUrl.search = new URLSearchParams({ fields: 'id,name,email,picture', access_token: tokens.access_token }).toString();
    const response = await fetch(profileUrl);
    if (!response.ok) throw new UnauthorizedException('Não foi possível obter o perfil do Facebook');
    const data: any = await response.json();
    if (!data.id || !data.email) throw new BadRequestException('Sua conta Facebook precisa disponibilizar um e-mail para entrar no PetEncontrado');
    return { providerAccountId: String(data.id), email: String(data.email).toLowerCase(), name: String(data.name || data.email), profileImage: data.picture?.data?.url ? String(data.picture.data.url) : undefined };
  }

  private async loginOrCreateSocial(provider: Provider, profile: { providerAccountId: string; email: string; name: string; profileImage?: string }) {
    const linked = await this.prisma.socialAccount.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId: profile.providerAccountId } },
      include: { user: true },
    });

    if (linked) {
      await this.prisma.socialAccount.update({
        where: { id: linked.id },
        data: { email: profile.email, name: profile.name, profileImage: profile.profileImage },
      });
      return this.session(linked.user);
    }

    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { name: profile.name, email: profile.email, passwordHash: null } });
    }
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('Usuário bloqueado');

    await this.prisma.socialAccount.create({
      data: {
        userId: user.id,
        provider,
        providerAccountId: profile.providerAccountId,
        email: profile.email,
        name: profile.name,
        profileImage: profile.profileImage,
      },
    });
    return this.session(user);
  }
}
