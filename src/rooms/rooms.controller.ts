import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto, RoomDto } from './dto';
import { CurrentUser, Serialization } from '../common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../users/schema/user.schema';

@Serialization(RoomDto)
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: UserDocument) {
    return this.roomsService.create(createRoomDto, user);
  }

  @Get('myRooms')
  findMyRooms(@CurrentUser() user: UserDocument) {
    return this.roomsService.findAll({ $in: { members: { $in: [user.id] } } });
  }

  @Get()
  findAll(@Query() query: any) {
    return this.roomsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
