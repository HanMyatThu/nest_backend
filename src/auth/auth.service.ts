import { HashingService } from 'auth/hashing/hashing.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly HashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser (email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: { email },
    })
    if (!user) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    const isMatched: boolean = await this.HashingService.compare(password, user.password);

    if (!isMatched) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    const requestUser: RequestUser = { id : user.id };
    return requestUser;
  }

  login(user: RequestUser) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload)
  }

  async validateJwt(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.createRequestUser(user);
  }

  getProfile(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  private createRequestUser(user: User): RequestUser {
    const { id } = user;
    return { id };
  }
}

