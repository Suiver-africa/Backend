import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthMiddleware implements NestMiddleware {
    private jwtService;
    private config;
    constructor(jwtService: JwtService, config: ConfigService);
    use(req: Request & {
        user?: any;
    }, res: Response, next: NextFunction): void;
}
