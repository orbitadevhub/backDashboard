import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log("MIDDLEWARE RAW HEADERS:", req.headers);
    console.log("MIDDLEWARE AUTH:", req.headers['authorization']);
    next();
  }
}
