import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMessageDto, UpdateMessageDto, MessageDto } from './dto';
import { CurrentUser, Serialization } from '../common/decorators';
import { UserDocument } from './../users/schema/user.schema';
import { MessageService } from './message.service';

@Serialization(MessageDto)
@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: UserDocument) {
    return this.messageService.create(createMessageDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    return this.messageService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.messageService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
