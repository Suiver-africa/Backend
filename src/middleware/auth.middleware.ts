import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Simple JWT authentication middleware.
 * - Reads Authorization: Bearer <token>
 * - Verifies token using JWT_SECRET from env (via ConfigService)
 * - Attaches decoded payload to req.user
 *
 * To use: register this middleware in a module or apply in main.ts
 * Example in a module's configure(consumer: MiddlewareConsumer) { consumer.apply(AuthMiddleware).forRoutes('*'); }
 */

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    if (!auth || typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const token = auth.slice(7).trim();
    try {
      const secret = this.config.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not configured');
      const payload = this.jwtService.verify(token, { secret });
      req.user = payload;
      return next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
