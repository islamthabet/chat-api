import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UserDto } from './dto';
import { UserDocument } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, Serialization } from '../common/decorators';
import { memoryStorage } from 'multer';

@Serialization(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sendFriendRequest/:id')
  sendFriendRequest(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.usersService.sendFriendRequest(id, user);
  }

  @Get('searchFriends')
  searchFriends(@Query() query: any, @CurrentUser() user: UserDocument) {
    return this.usersService.searchFriends(query, user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('suggestFriend')
  suggestingFriends(@CurrentUser() user: UserDocument) {
    return this.usersService.suggestingFriends(user);
  }

  @Get('me')
  getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('acceptRequest/:id')
  acceptFriendRequest(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.usersService.acceptFriendRequest(user, id);
  }

  @Patch('rejectRequest/:id')
  rejectFriendRequest(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.usersService.rejectFriendRequest(user, id);
  }

  @Patch('unfriend/:id')
  unfriend(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.usersService.unfriend(user, id);
  }

  @Patch('blockUser/:id')
  blockUser(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.usersService.blockUser(user, id);
  }

  @Patch('changeProfileImage')
  @UseInterceptors(
    FileInterceptor('image', {
      // dest: join(__dirname, '../../public/images'),
      // storage: diskStorage({
      // destination: function (req, file, callback) {
      //   callback(null, join(__dirname, '../../public/images'));
      // },
      //   filename(req, file, callback) {
      //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      //     const extension = file.mimetype.split('/')[1];
      //     callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      //   },
      // }),
      storage: memoryStorage(),
    }),
  )
  changeProfileImage(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserDocument,
  ) {
    return this.usersService.changeProfileImage(image, user);
  }

  @Patch('me')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: UserDocument) {
    return this.usersService.profileUpdate(user, updateUserDto);
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
