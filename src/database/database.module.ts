import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configservice: ConfigService) => ({
        type: 'mysql',
        replication: {
          master: {
            host: configservice.getOrThrow('MYSQL_MASTER_HOST'),
            port: configservice.getOrThrow('MYSQL_MASTER_PORT'),
            username: configservice.getOrThrow('MYSQL_MASTER_USER'),
            password: configservice.getOrThrow('MYSQL_MASTER_PASSWORD'),
            database: configservice.getOrThrow('MYSQL_MASTER_DATABASE'),
          },
          slaves: [
            {
              host: configservice.getOrThrow('MYSQL_SLAVE_HOST'),
              port: configservice.getOrThrow('MYSQL_SLAVE_PORT'),
              username: configservice.getOrThrow('MYSQL_SLAVE_USER'),
              password: configservice.getOrThrow('MYSQL_SLAVE_PASSWORD'),
              database: configservice.getOrThrow('MYSQL_SLAVE_DATABASE'),
            },
          ],
        },
        entities: [User, Comment],
        synchronize: configservice.getOrThrow('TYPEORM_MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
