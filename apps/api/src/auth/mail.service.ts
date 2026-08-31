import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  isConfigured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    if (!this.isConfigured()) {
      this.logger.warn('SMTP não configurado. E-mail de recuperação não enviado.');
      return false;
    }

    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const webUrl = (process.env.WEB_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetUrl = `${webUrl}/redefinir-senha?token=${encodeURIComponent(token)}`;
    const from = process.env.MAIL_FROM || process.env.SMTP_USER!;

    await transporter.sendMail({
      from,
      to,
      subject: 'Recuperação de senha - PetEncontrado',
      text: `Olá, ${name}. Para redefinir sua senha, acesse: ${resetUrl}. O link expira em 30 minutos. Se você não solicitou a alteração, ignore esta mensagem.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>PetEncontrado</h2><p>Olá, ${this.escape(name)}.</p><p>Recebemos uma solicitação para redefinir sua senha.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px">Redefinir minha senha</a></p><p>Este link expira em 30 minutos.</p><p>Se você não solicitou a alteração, ignore esta mensagem.</p></div>`,
    });

    return true;
  }

  private escape(value: string) {
    return value.replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[char] || char));
  }
}
