import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { Bcrypt } from '../common/lib/bcrypt';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserUpdateRequestDTO } from './dto/user-update-request.dto';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findUserById(Id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        Id,
      },
    });
  }

  public async createUser(userRequestDTO: UserRequestDTO): Promise<UserEntity> {
    const duplicateUser = await this.userRepository.findOne({
      where: {
        email: userRequestDTO.email,
      },
    });

    if (duplicateUser) {
      throw new ConflictException(
        `${userRequestDTO.email}은 이미 존재하는 회원입니다`,
      );
    }

    userRequestDTO.salt = await Bcrypt.createSalt();
    userRequestDTO.password = await Bcrypt.hash(
      userRequestDTO.password,
      userRequestDTO.salt,
    );

    const User = this.userRepository.create(userRequestDTO);
    await this.userRepository.save(User);
    return User;
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async updateUser(
    user: UserEntity,
    userUpdateRequestDTO: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const updatedUser = this.userRepository.merge(user, userUpdateRequestDTO);

    await this.userRepository.save(updatedUser);

    return updatedUser;
  }
}
