import { IsPassword } from './../../common/decorators/validators/is-password.decorator';
import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DEFAULT_PAGINATION_PAGE_SIZE } from 'common/utils/common.constants';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRespository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword: string = await this.hashPassword(password);
    const user = this.usersRespository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRespository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset} = paginationDto;
    const user = await this.usersRespository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGINATION_PAGE_SIZE.USER
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRespository.findOne({ 
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      } 
    });
    if (!user) {
      throw new NotFoundException('User notfound')
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const hashPassword = password ? await this.hashPassword(password) : password;
    
    const user = await this.usersRespository.preload({
      id,
      ...updateUserDto,
      password: hashPassword
    })
    if (!user) {
      throw new NotFoundException('User notfound')
    }
    return this.usersRespository.save(user);
  }

  async remove(id: number, soft: boolean) {
    const user = await this.findOne(id);
    return soft
      ? this.usersRespository.softRemove(user)
      : this.usersRespository.remove(user);
  }

  async recover(id: number) {
    const user = await this.usersRespository.findOne({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      withDeleted: true
    })

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    if (!user.isDeleted) {
      throw new ConflictException('User is not deleted');
    }

    return this.usersRespository.recover(user);
  }

  private async hashPassword (password: string) {
    const salt = await genSalt();

    const hashPassword = hash(password, salt);
    return hashPassword;
  }
}
