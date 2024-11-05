import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentDto } from './dtos/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    return await this.documentRepository.insert(createDocumentDto);
  }

  async findAll() {
    return await this.documentRepository.find();
  }

  async findOne(id: number) {
    return await this.documentRepository.findOneBy({ id });
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return await this.documentRepository.update({ id }, updateDocumentDto);
  }

  async remove(id: number) {
    return await this.documentRepository.delete({ id });
  }
}
