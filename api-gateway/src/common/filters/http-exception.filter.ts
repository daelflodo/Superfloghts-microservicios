import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const resquest = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(`Status: ${status} Error: ${JSON.stringify(msg)}`);
    
    response.status(status).json({
      timesstamps: new Date().toISOString(),
      path: resquest.url,
      error: msg,
    });
  }
}

// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';

// @Catch()
// export class AllExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionFilter.name);

//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message: any = 'Internal Server Error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       message = exception.getResponse();
//     } else if (exception instanceof Error) {
//       status = HttpStatus.INTERNAL_SERVER_ERROR;
//       message = exception.message;
//     }

//     this.logger.error(`Status: ${status} Error: ${JSON.stringify(message)}`);
    
//     response.status(status).json({
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       error: message,
//     });
//   }
// }


// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';

// export interface HttpExceptionResponse {
//   statusCode: string;
//   error: string;
// }

// export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
//   path: string;
//   method: string;
//   timestamp: Date;
// }

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     const status = this.getHttpStatus(exception);
//     let errorMessage: string;

//     if (exception instanceof HttpException) {
//       const errorResponse = exception.getResponse();
//       errorMessage =
//         (<CustomHttpExceptionResponse>errorResponse).error || exception.message;
//     } else {
//       errorMessage = 'Internal server error occurred!';
//     }

//     response.status(status).json({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       errorMessage,
//     });
//   }

//   private getHttpStatus(exception: unknown): number {
//     return exception instanceof HttpException
//       ? exception.getStatus()
//       : HttpStatus.INTERNAL_SERVER_ERROR;
//   }
// }
