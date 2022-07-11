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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UserDto } from './dto';
import { UserDocument } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CurrentUser, Serialization } from '../common/decorators';
import { diskStorage } from 'multer';

@Serialization(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('changeProfileImage')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: join(__dirname, '../../public/images'),
      storage: diskStorage({
        destination: function (req, file, callback) {
          callback(null, join(__dirname, '../../public/images'));
        },
        filename(req, file, callback) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1];
          callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
        },
      }),
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
    console.log('delete');
    return this.usersService.remove(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
