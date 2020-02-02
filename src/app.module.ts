import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { UserProjectModule } from './user-project/user-project.module';
import { DeserializeUserMiddleWare } from './common/middleware/deserialize-user.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, ProjectModule, UserProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeserializeUserMiddleWare).forRoutes('*');
  }
}
