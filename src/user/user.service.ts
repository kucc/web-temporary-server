import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findAllUser(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async findUserById(Id: Number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        Id,
      },
    });
  }
  public async isEmailDuplicate(email: string): Promise<boolean> {
    const duplicateUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (duplicateUser) {
      return false;
    }

    return true;
  }
}
