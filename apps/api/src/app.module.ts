import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AnimalsModule } from './animals/animals.module';
import { SightingsModule } from './sightings/sightings.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health.controller';
@Module({
  imports:[ConfigModule.forRoot({isGlobal:true}),ThrottlerModule.forRoot([{ttl:60000,limit:120}]),PrismaModule,AuthModule,AnimalsModule,SightingsModule,UsersModule,AdminModule],
  controllers:[HealthController],
  providers:[{provide:APP_GUARD,useClass:ThrottlerGuard}]
})
export class AppModule{}
