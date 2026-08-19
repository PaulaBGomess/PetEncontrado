import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap(){
  const app=await NestFactory.create<NestExpressApplication>(AppModule,{bodyParser:true});
  app.setGlobalPrefix('api/v1');
  app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
  app.use(cookieParser());
  app.useBodyParser('json',{limit:'1mb'});
  app.enableCors({origin:(process.env.WEB_URL||'http://localhost:3000').split(',').map(v=>v.trim()),credentials:true,methods:['GET','POST','PATCH','DELETE','OPTIONS']});
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true,transformOptions:{enableImplicitConversion:true}}));
  app.useStaticAssets(join(process.cwd(),'uploads'),{prefix:'/uploads/'});
  const config=new DocumentBuilder().setTitle('PetEncontrado API').setDescription('API REST do Sistema de Animais Perdidos e Encontrados').setVersion('2.0').addBearerAuth().build();
  SwaggerModule.setup('docs',app,SwaggerModule.createDocument(app,config));
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(Number(process.env.PORT||3333),'0.0.0.0');
  console.log(`PetEncontrado API: http://localhost:${process.env.PORT||3333}/api/v1`);
  console.log(`Swagger: http://localhost:${process.env.PORT||3333}/docs`);
}
bootstrap();
