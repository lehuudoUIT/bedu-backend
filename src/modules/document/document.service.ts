import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentDto } from './dtos/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../../entities/document.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { QuestionService } from '../question/question.service';
import { Question } from '../../entities/question.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto
  ): Promise<Document> {
    let questions: Question[] = [];
      if (createDocumentDto.questionId) {
        for(let i = 0; i < createDocumentDto.questionId.length; i++) { 
          const question = await this.questionService.findOne(createDocumentDto.questionId[i]);
          if (!question) {
            throw new NotFoundException('Question ' + createDocumentDto.questionId[i] + ' is not found!');
          }
          
          questions.push(question);
        }
      }

      const document = await this.documentRepository.create({
        ...createDocumentDto,
        question: questions,
      });
      const result = await this.documentRepository.save(document);
      if(!result) {
        throw new InternalServerErrorException('Failed to create class information');
      }
      return result;
  }

  async findAllByType(
    page: number = 1,
    limit: number = 10,
    type: string
  ): Promise<{
    totalRecord: number,
    documents: Document[]
  }> {
    const documents = await this.documentRepository
                                .createQueryBuilder('document')
                                .leftJoinAndSelect('document.question', 'question')
                                .where('document.deletedAt is null')
                                .andWhere('document.isActive = :isActivated', { isActivated: true }) 
                                .andWhere('document.documentType = :type', { type })
                                .orderBy('document.id', 'DESC')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
    const totalRecord = await this.documentRepository
                                .createQueryBuilder('document')
                                .where('document.deletedAt is null')
                                .andWhere('document.isActive = :isActivated', { isActivated: true }) 
                                .andWhere('document.documentType = :type', { type })
                                .getCount();
    if (documents.length === 0) {
    throw new NotFoundException('No document found!');
    }
    return {
      totalRecord: totalRecord,
      documents: documents
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    documents: Document[]
  }> {
    const documents = await this.documentRepository
                          .createQueryBuilder('document')
                          .leftJoinAndSelect('document.question', 'question')
                          .where('document.deletedAt  is null')
                          .andWhere('document.isActive = :isActivated', { isActivated: true }) 
                          .orderBy('document.id', 'DESC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
    const totalRecord = await this.documentRepository
                          .createQueryBuilder('document')
                          .where('document.deletedAt is null')
                          .andWhere('document.isActive = :isActivated', { isActivated: true })      
                          .getCount();
    if (documents.length === 0) {
      throw new NotFoundException('No document found!');
    }
    return {
      totalRecord: totalRecord,
      documents: documents
    };
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository
                          .createQueryBuilder('document')
                          .leftJoinAndSelect('document.question', 'question')
                          .where('document.id = :id', { id })
                          .andWhere('document.deletedAt IS NULL')
                          .andWhere('document.isActive = :isActive', { isActive: true })
                          .getOne();
      if (!document) {
        throw new NotFoundException('Document not found!');
      }
      return document;
  }

  async update(
    id: number, 
    updateDocumentDto: UpdateDocumentDto
  ): Promise<Document> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException("Document not found!"); 
    }

    let questions: Question[] = [];
    if (updateDocumentDto.questionId) {
      for(let i = 0; i < updateDocumentDto.questionId.length; i++) { 
        const question= await this.questionService.findOne(updateDocumentDto.questionId[i]);
        if (!question) {
          throw new NotFoundException('Question ' + updateDocumentDto.questionId[i] + ' is not found!');
        }
        questions.push(question);
      }
    }                 

    const updateDocument = this.documentRepository.create({
      ...document,
      ...updateDocumentDto,
      question: questions,
    });
    const result = await this.documentRepository.save(updateDocument);
    if(!result) {
      throw new InternalServerErrorException('Failed to create class information');
    }
    return result
  }

  async remove(id: number): Promise<Document> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException('Document not found!');
    }

    const deleteDocument = this.documentRepository.create({
      ...document,
      deletedAt: new Date(),
      isActive: false,
    });
    const result = await this.documentRepository.save(deleteDocument);
    if(!result) {
      throw new InternalServerErrorException('Failed to create class information');
    }
    return result;
  }
}
