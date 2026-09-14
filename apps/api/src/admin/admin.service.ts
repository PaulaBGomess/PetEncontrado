import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [users, lost, found, reunited, closed, recent] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.animal.count({ where: { situation: 'LOST' } }),
      this.prisma.animal.count({ where: { situation: 'FOUND' } }),
      this.prisma.animal.count({ where: { situation: 'REUNITED' } }),
      this.prisma.animal.count({ where: { situation: 'CLOSED' } }),
      this.prisma.animal.count({ where: { createdAt: { gte: new Date(Date.now() - 86400000) } } }),
    ]);

    return { users, lost, found, reunited, closed, newLast24h: recent };
  }

  users() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        state: true,
        role: true,
        status: true,
        createdAt: true,
        _count: { select: { animals: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  animals() {
    return this.prisma.animal.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { sightings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async userStatus(id: string, status: UserStatus, actorId: string) {
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Usuário não encontrado');
    if (id === actorId && status === UserStatus.BLOCKED) {
      throw new ForbiddenException('Você não pode bloquear o próprio usuário administrador');
    }

    const user = await this.prisma.user.update({ where: { id }, data: { status } });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'USER_STATUS_CHANGED',
        entityType: 'User',
        entityId: id,
        metadata: { status },
      },
    });

    return { id: user.id, status: user.status };
  }

  async userRole(id: string, role: Role, actorId: string) {
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Usuário não encontrado');
    if (id === actorId && role !== Role.ADMIN) {
      throw new ForbiddenException('Você não pode remover o próprio perfil de administrador');
    }

    const user = await this.prisma.user.update({ where: { id }, data: { role } });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'USER_ROLE_CHANGED',
        entityType: 'User',
        entityId: id,
        metadata: { role },
      },
    });

    return { id: user.id, role: user.role };
  }

  logs() {
    return this.prisma.auditLog.findMany({
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
