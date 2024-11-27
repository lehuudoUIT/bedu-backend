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
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dtos/create-score.dto';
import { UpdateScoreDto } from './dtos/update-score.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post('new')
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoreService.create(createScoreDto);
  }

  @Get('all')
  findAll(
    @Query ('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.scoreService.findAll();
  }

  @Get('all/student/:idStudent')
  findAllResultByIdStudent(
    @Param ('idStudent', ParseIntPipe) idStudent: number,
    @Query ('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.scoreService.findAll();
  }

  @Get('all/exam/:idExam')
  findAllResultByIdExam(
    @Param ('idExam', ParseIntPipe) idExam: number,
    @Query ('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.scoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoreService.update(+id, updateScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoreService.remove(+id);
  }
}
