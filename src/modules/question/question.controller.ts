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
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('new')
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get('all')
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.questionService.findAll(page, limit);
  }

  // type is in ['multiple', 'single', 'fillin']
  @Get('all/type/:type')
  findAllByType(
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.questionService.findAllByType(page, limit, type);
  } 

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch('item/:id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
