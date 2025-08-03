import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.dto';
import { QueryParams } from 'src/utils/query-params';
import { JwtAuthGuard } from 'src/guards/jwt.auth-guard';
import { RolesGuard, UserRole } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.guard';

@ApiTags('collections')
@Controller('api/collections')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Collection created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Collection with this name or slug already exists',
  })
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collections retrieved successfully',
  })
  async findAll(@Query() query: QueryParams) {
    return this.collectionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found',
  })
  async findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get collection by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    return this.collectionService.findBySlug(slug);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.Editor)
  @ApiOperation({ summary: 'Update collection' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete collection' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Collection deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found',
  })
  async remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
