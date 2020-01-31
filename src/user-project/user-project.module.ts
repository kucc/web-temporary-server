import { Module } from '@nestjs/common';
import { UserProjectController } from './user-project.controller';
import { UserProjectService } from './user-project.service';

@Module({
  controllers: [UserProjectController],
  providers: [UserProjectService]
})
export class UserProjectModule {}
