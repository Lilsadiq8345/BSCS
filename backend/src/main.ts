import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { LogsService } from './logs/logs.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const logsService = app.get(LogsService);
  app.useGlobalInterceptors(new AuditLogInterceptor(logsService));
  
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
