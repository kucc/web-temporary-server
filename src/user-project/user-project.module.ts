import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProjectEntity } from './user-project.entity';
import { UserProjectService } from './user-project.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProjectEntity])],
  providers: [UserProjectService],
  exports: [UserProjectService],
})
export class UserProjectModule {}
