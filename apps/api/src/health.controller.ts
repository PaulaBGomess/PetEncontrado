import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/public.decorator';
@ApiTags('Sistema') @Controller('health') export class HealthController{ @Public() @Get() health(){return {status:'ok',service:'PetEncontrado API',timestamp:new Date().toISOString()};}}