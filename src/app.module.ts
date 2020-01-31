import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { UserProjectModule } from './user-project/user-project.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, ProjectModule, UserProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
