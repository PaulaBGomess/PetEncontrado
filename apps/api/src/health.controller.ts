import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Sistema') @Controller('health') export class HealthController{ @Get() health(){return {status:'ok',service:'PetEncontrado API',timestamp:new Date().toISOString()};}}
