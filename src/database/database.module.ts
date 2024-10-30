import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configservice: ConfigService) => ({
        type: 'mysql',
        host: configservice.getOrThrow('MYSQL_HOST'),
        port: configservice.getOrThrow('MYSQL_PORT'),
        username: configservice.getOrThrow('MYSQL_USER'),
        password: configservice.getOrThrow('MYSQL_PASSWORD'),
        database: configservice.getOrThrow('MYSQL_DATABASE'),
        entities: [User],
        synchronize: configservice.getOrThrow('MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
