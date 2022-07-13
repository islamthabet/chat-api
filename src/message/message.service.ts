import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(private messageRepo: MessageRepository) {}
  create(createMessageDto: CreateMessageDto, userId: string) {
    return this.messageRepo.create({ ...createMessageDto, from: userId });
  }

  findAll(userId: string) {
    return this.messageRepo.findAll({ $or: [{ from: userId }, { to: userId }] });
  }

  findOne(id: string, userId: string) {
    return this.messageRepo.findAll({
      $or: [
        { from: userId, to: id },
        { to: userId, from: id },
      ],
    });
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageRepo.editOneById(id, updateMessageDto);
  }

  remove(id: string) {
    return this.messageRepo.deleteOneById(id);
  }
}
