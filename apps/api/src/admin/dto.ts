import { Role, UserStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}

export class UserRoleDto {
  @IsEnum(Role)
  role: Role;
}
