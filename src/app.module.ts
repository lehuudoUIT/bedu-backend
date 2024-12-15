import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './entities/user.entity';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProgramModule } from './modules/program/program.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ClassModule } from './modules/class/class.module';
import { CourseModule } from './modules/course/course.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { ExamModule } from './modules/exam/exam.module';
import { AnswerModule } from './modules/answer/answer.module';
import { QuestionModule } from './modules/question/question.module';
import { DocumentModule } from './modules/document/document.module';
import { ScoreModule } from './modules/score/score.module';
import { AttendenceModule } from './modules/attendence/attendence.module';
import { ReportModule } from './modules/report/report.module';
import { UserProgramModule } from './modules/user_program/user_program.module';
import { UserClassModule } from './modules/user_class/user_class.module';
import { LessonDocumentModule } from './modules/lesson_document/lesson_document.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    User,
    CommentsModule,
    NotificationModule,
    ProgramModule,
    PaymentModule,
    ClassModule,
    CourseModule,
    LessonModule,
    ExamModule,
    AnswerModule,
    QuestionModule,
    DocumentModule,
    ScoreModule,
    AttendenceModule,
    ReportModule,
    UserProgramModule,
    UserClassModule,
    LessonDocumentModule,
    RoleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
