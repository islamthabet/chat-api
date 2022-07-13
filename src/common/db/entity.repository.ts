import { BadRequestException } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  // Create
  async create(docs: unknown): Promise<T> {
    const entity = new this.entityModel(docs);
    return entity.save();
  }

  // Read
  async findAll(query: any): Promise<T[]> {
    const excludedFelids = ['sort', 'page', 'limit', 'felid'];
    const filter = {};
    let totalPages = 0;
    for (const key in query) {
      const element = query[key];
      if (!excludedFelids.includes(key)) filter[key] = element;
    }

    const entity = this.entityModel.find(filter);

    if (query.sort) entity.sort(query.sort);
    if (query.page) {
      entity.skip(+query.page * +query.limit).limit(+query.limit);
    }
    if (query.felid) entity.select(query.felid);

    return entity;
  }
  async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.entityModel.findOne(filter);
  }
  async findById(id: string): Promise<T> {
    return this.entityModel.findById(id).exec();
  }

  // Update
  async editOne(filter: FilterQuery<T>, update: unknown): Promise<T> {
    return this.entityModel.findOneAndUpdate(filter, update);
  }

  async editOneById(id: string, update: unknown): Promise<T> {
    return this.entityModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  }

  // Delete
  async deleteOne(filter: FilterQuery<T>) {
    return this.entityModel.deleteOne(filter);
  }
  async deleteOneById(id: string) {
    return this.entityModel.findByIdAndDelete(id);
  }

  async shallowDelete(filter: FilterQuery<T>) {
    return this.entityModel.findOneAndUpdate(filter, { active: false });
  }
  async shallowDeleteById(id: string) {
    return this.entityModel.findByIdAndUpdate(id, { active: false });
  }
}
