import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decratore/currentuser.decorator';
import { UserDocument } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { UserDto } from './dto/user.dto';
import { Serialization } from 'src/common/decratore/serialization.interceptor';

@Serialization(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('friends')
  getFriends(@CurrentUser() user: UserDocument) {
    return this.usersService.getFriends(user);
  }

  @Get('suggest-friend')
  suggestingFriends(@CurrentUser() user: UserDocument) {
    return this.usersService.suggestingFriends(user);
  }

  @Get('me')
  getProfile(@CurrentUser() user: UserDocument) {
    console.log('get me');
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('changeProfileImage')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: join(__dirname, 'public', 'images'),
      // storage: ()=>{

      // }
    }),
  )
  changeProfileImage(@UploadedFile() image: Express.Multer.File, @CurrentUser() user: UserDocument) {
    console.log(image);
    // return this.usersService.update(user.id, { image });
  }

  @Patch('me')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: UserDocument) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('me')
  deleteProfile(@CurrentUser() user: UserDocument) {
    return this.usersService.remove(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
