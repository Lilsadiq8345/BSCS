import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../logs/logs.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body } = request;

    return next.handle().pipe(
      tap(() => {
        if (user && method !== 'GET') {
          void this.logsService.create({
            userId: user.userId,
            action: `${method} ${url}`,
            target: url,
            payload: body,
          });
        }
      }),
    );
  }
}
