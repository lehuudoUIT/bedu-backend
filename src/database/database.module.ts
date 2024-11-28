import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Attendance } from 'src/entities/attendence.entity';
import { Class } from 'src/entities/class.entity';
import { Comment } from 'src/entities/comment.entity';
import { Course } from 'src/entities/course.entity';
import { Document } from 'src/entities/document.entity';
import { Exam } from 'src/entities/exam.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonDocument } from 'src/entities/lesson_document.entity';
import { Notification } from 'src/entities/notification.entity';
import { Payment } from 'src/entities/payment.entity';
import { Program } from 'src/entities/program.entity';
import { Question } from 'src/entities/question.entity';
import { Report } from 'src/entities/report.entity';
import { Score } from 'src/entities/score.entity';
import { User } from 'src/entities/user.entity';
import { UserClass } from 'src/entities/user_class.entity';
import { UserProgram } from 'src/entities/user_program.entity';
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
        entities: [
          User,
          Comment,
          Answer,
          Attendance,
          Class,
          Course,
          Document,
          Exam,
          Lesson,
          Notification,
          Payment,
          Program,
          Question,
          Report,
          Score,
          UserProgram,
          UserClass,
          LessonDocument,
        ],
        synchronize: configservice.getOrThrow('TYPEORM_MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
