import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/account.module';
import { DatabaseModule } from './database/database.module';
import { AuthorizationModule } from '@choi-seunghwan/authorization';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthorizationModule.forRoot({ jwtSecret: process.env.JWT_SECRET }),
    DatabaseModule,
    AccountModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
