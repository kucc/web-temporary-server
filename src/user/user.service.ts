import { Injectable, ConflictException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequestDTO } from './dto/user-request.dto';

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

    const User = this.userRepository.create(userRequestDTO);
    await this.userRepository.save(User);
    return User;
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
