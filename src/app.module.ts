import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { NotificationModule } from './notification/notification.module';
import { AppService } from './app.service';
import { JwtModule } from './common/jwt/jwt.module';
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RoomsModule } from './rooms/rooms.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    // }),
    // MongooseModule.forRoot('mongodb://mongo:27017/chat'),
    // MongooseModule.forRoot('mongodb://localhost:27017/chat'),
    MongooseModule.forRoot(
      'mongodb+srv://islamThabet:YneNSTck8FIG3iaq@chat.e4dm1eg.mongodb.net/?retryWrites=true&w=majority',
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    AuthModule,
    MessageModule,
    NotificationModule,
    JwtModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ChatGateway,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
