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
import { AttributeService } from './attribute.service';
import { CreateAttributeDto, UpdateAttributeDto } from './attribute.dto';
import { QueryParams } from 'src/utils/query-params';
import { JwtAuthGuard } from 'src/guards/jwt.auth-guard';
import { RolesGuard, UserRole } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.guard';

@ApiTags('attributes')
@Controller('api/attributes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attribute created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Attribute with this name already exists',
  })
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attributes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attributes retrieved successfully',
  })
  async findAll(@Query() query: QueryParams) {
    return this.attributeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attribute retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attribute not found',
  })
  async findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.Editor)
  @ApiOperation({ summary: 'Update attribute' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attribute updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attribute not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attribute' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Attribute deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attribute not found',
  })
  async remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }
}
