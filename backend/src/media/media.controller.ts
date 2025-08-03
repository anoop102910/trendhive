import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Media, Prisma } from '@prisma/client';
import { CrudFilter, CrudSort, Pagination } from 'src/utils/query-params';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaDto: Prisma.MediaCreateInput): Promise<Media> {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('filters') filters?: string,
    @Query('sorters') sorters?: string,
    @Query('pagination') pagination?: string,
  ): Promise<Media[]> {
    const parsedFilters: CrudFilter[] = filters ? JSON.parse(filters) : [];
    const parsedSorters: CrudSort[] = sorters ? JSON.parse(sorters) : [];
    const parsedPagination: Pagination = {
      current: pagination ? parseInt(pagination, 10) : 1,
      pageSize: pagination ? parseInt(pagination, 10) : 20,
    };

    return this.mediaService.findAll({
      userId,
      filters: parsedFilters,
      sorters: parsedSorters,
      pagination: parsedPagination,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Media> {
    return this.mediaService.remove({ id });
  }
}
