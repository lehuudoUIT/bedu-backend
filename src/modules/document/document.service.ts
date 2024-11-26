import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentDto } from './dtos/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto
  ): Promise<ResponseDto> {
    try {
      const document = await this.documentRepository.create(createDocumentDto);
      const result = await this.documentRepository.save(document);
      return {
        message: 'Document created successfully!',
        statusCode: 201,
        data: result,
      };
    } catch (error) {
      return {
        message: 'Document created failed!',
        statusCode: 400,
        data: null,
      }
    }
  }

  async findAllByType(
    page: number = 1,
    limit: number = 10,
    type: string
  ): Promise<ResponseDto> {
    try {
      const documents = await this.documentRepository
                          .createQueryBuilder('document')
                          .where('document.isDeleted = :isDeleted', { isDeleted: false })
                          .andWhere('document.isActivated = :isActivated', { isActivated: true }) 
                          .andWhere('document.type = :type', { type })
                          .orderBy('document.id', 'DESC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
      if (documents.length === 0) {
        return {
          statusCode: 404,
          message: 'No document found!',
          data: null,
        }
      }
      return {
        statusCode: 200,
        message: 'Documents found!',
        data: documents,
      }
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
        data: null,
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const documents = await this.documentRepository
                          .createQueryBuilder('document')
                          .where('document.isDeleted = :isDeleted', { isDeleted: false })
                          .andWhere('document.isActivated = :isActivated', { isActivated: true }) 
                          .orderBy('document.id', 'DESC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
      if (documents.length === 0) {
        return {
          statusCode: 404,
          message: 'No document found!',
          data: null,
        }
      }
      return {
        statusCode: 200,
        message: 'Documents found!',
        data: documents,
      }
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
        data: null,
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const document = await this.documentRepository
                        .findOneBy({
                          id,
                          deletedAt: IsNull(),
                          isActive: true,
                        });
      if (!document) {
        return {
          statusCode: 404,
          message: 'Document not found!',
          data: null,
        }
      }
      return {
        statusCode: 200,
        message: 'Document found!',
        data: document,
      }
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
        data: null,
      }
    }
  }

  async update(
    id: number, 
    updateDocumentDto: UpdateDocumentDto
  ): Promise<ResponseDto> {
    try {
      const  documentResponse = await this.findOne(id);
      if (documentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Document not found!',
          data: null,
        }
      }
      const document = Array.isArray(documentResponse.data) 
                        ? documentResponse.data[0] 
                        : documentResponse.data;
      const updateDocument = this.documentRepository.create({
        ...document,
        ...updateDocumentDto,
      });
      const result = await this.documentRepository.save(updateDocument);
      return {
        statusCode: 200,
        message: 'Document updated successfully!',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message,
        data: null,
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const documentResponse = await this.findOne(id);
      if (documentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Document not found!',
          data: null,
        }
      }
      const document = Array.isArray(documentResponse.data) 
                        ? documentResponse.data[0] 
                        : documentResponse.data;
      const deleteDocument = this.documentRepository.create({
        ...document,
        deletedAt: new Date(),
        isActive: false,
      });
      const result = await this.documentRepository.save(deleteDocument);
      return {
        statusCode: 200,
        message: 'Document deleted successfully!',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 400,
        message: error.message,
        data: null,
      }
    }
  }
}
