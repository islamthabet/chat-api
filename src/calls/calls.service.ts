import { UserDocument } from 'src/users/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { CallRepository } from './Call.repository';
import { CreateCallDto, UpdateCallDto } from './dto';

@Injectable()
export class CallsService {
  constructor(private callRepo: CallRepository) {}
  create(createCallDto: CreateCallDto) {
    return this.callRepo.create(createCallDto);
  }

  findAll(user: UserDocument) {
    // return this.callRepo.findAll({ $or: [{ from: user.id }, { to: user.id }] });
    return this.callRepo.findAll({});
  }

  findOne(id: string) {
    return this.callRepo.findById(id);
  }

  update(id: string, updateCallDto: UpdateCallDto) {
    return this.callRepo.editOneById(id, updateCallDto);
  }

  remove(id: string) {
    return this.callRepo.deleteOneById(id);
  }
}
