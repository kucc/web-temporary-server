import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from './project.entity';
import { UserModule } from '../user/user.module';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { UserProjectModule } from '../user-project/user-project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    UserProjectModule,
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
