import { Abstract } from "@nestjs/common";
import { AbstractEntity } from "../database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Lesson } from "./lesson.entity";
import {Document} from "./document.entity"

@Entity({ name: 'lessons_documents' })
export class LessonDocument extends AbstractEntity<LessonDocument> {
  
    @Column()
    time: Date;

    @ManyToOne(
        () => Lesson, 
        (lesson) => lesson.lessonDocument,
        { eager: true }) 
    lesson: Lesson;

    @ManyToOne(
        () => Document, 
        (document) => document.lessonDocument,
        { eager: true }) 
    document: Document;

}
