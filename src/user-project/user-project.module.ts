import { Module } from '@nestjs/common';
import { UserProjectService } from './user-project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProjectEntity } from './user-project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProjectEntity])],
  providers: [UserProjectService],
  exports: [UserProjectService],
})
export class UserProjectModule {}
