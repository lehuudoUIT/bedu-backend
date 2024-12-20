import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentDto } from './dtos/update-document.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('documents')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)

export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('new')
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return {
      message: 'This action adds a new document',
      metadata: await this.documentService.create(createDocumentDto),
    }
  }

  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Body('status') status: string = 'active'
  ) {
    return {
      message: 'This action returns all document',
      metadata: await this.documentService.findAll(page, limit, status),
    }
  }

  @Get('all/type/:type')
  async findAllByType(
    @Param('type') type: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Body('status') status: string = 'active'
  ) {
    return {
      message: 'This action returns all document by type',
      metadata: await this.documentService.findAllByType(page, limit, type, status),
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'This action returns a #${id} document',
      metadata: await this.documentService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return {
      message: 'This action updates a #${id} document',
      metadata: await this.documentService.update(+id, updateDocumentDto),
    }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'This action removes a #${id} document',
      metadata: await this.documentService.remove(+id),
    }
  }
}
