import { UserDocument } from './../users/schema/user.schema';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, NotificationDto, UpdateNotificationDto } from './dto';
import { CurrentUser, Serialization } from '../common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Serialization(NotificationDto)
@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto, @CurrentUser() user: UserDocument) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    return this.notificationService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
