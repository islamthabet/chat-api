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

  findAll(query: any, userId: string) {
    query.from = userId;
    query.to = userId;
    return this.messageRepo.findAll(query);
  }

  findOne(id: string) {
    return this.messageRepo.findById(id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageRepo.editOneById(id, updateMessageDto);
  }

  remove(id: string) {
    return this.messageRepo.deleteOneById(id);
  }
}
