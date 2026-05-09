import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(email: string, pass: string) {
    const existing = await this.usersService.findOne(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersService.create({
      email,
      password: pass,
    });
    return this.login(user);
  }
}
