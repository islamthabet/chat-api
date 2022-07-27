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

  @Patch('acceptRequest/:id')
  acceptJoinRoom(@Param('id') roomId: string, @CurrentUser() user: UserDocument) {
    return this.roomsService.acceptJoinRoom(roomId, user);
  }

  @Patch('rejectRequest/:id')
  rejectRequest(@Param('id') roomId: string, @CurrentUser() user: UserDocument) {
    return this.roomsService.rejectRequest(roomId, user);
  }

  @Patch('makeAnAdmins/:id')
  makeAnAdmin(
    @CurrentUser() user: UserDocument,
    @Body('usersIds') usersIds: Array<string>,
    @Param('id') roomId: string,
  ) {
    return this.roomsService.makeAnAdmin(user, usersIds, roomId);
  }

  @Patch('addUsers/:id')
  addUsers(@Body('usersIds') usersIds: Array<string>, @Param('id') roomId: string) {
    console.log(usersIds);
    return this.roomsService.addUsersToRoom(usersIds, roomId);
  }

  @Patch('leaveRoom/:id')
  leaveRoom(@CurrentUser() user: UserDocument, @Param('id') roomId: string) {
    return this.roomsService.leaveRoom(user, roomId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(user, id, updateRoomDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.roomsService.remove(user, id);
  }
}
