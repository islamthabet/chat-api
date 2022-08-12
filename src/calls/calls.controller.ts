import { UserDocument } from 'src/users/schema/user.schema';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, Serialization } from '../common/decorators';
import { CallsService } from './calls.service';
import { CallDto, CreateCallDto, UpdateCallDto } from './dto';

@ApiTags('call')
@Serialization(CallDto)
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(@Body() createCallDto: CreateCallDto) {
    return this.callsService.create(createCallDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    return this.callsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callsService.update(id, updateCallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callsService.remove(id);
  }
}
