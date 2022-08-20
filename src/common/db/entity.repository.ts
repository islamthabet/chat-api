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
    const excludedFelids = ['sort', 'page', 'limit', 'felid', 'aggregate'];
    const specialFields = ['$nin', '$in', '$or', '$and'];
    const filter = {};

    for (const key in query) {
      const element = query[key];
      if (!excludedFelids.includes(key)) {
        if (!specialFields.includes(key)) filter[key] = element;
        else {
          filter[Object.keys(query[key])[0]] = element[Object.keys(query[key])[0]];
        }
      }
    }

    const entity = this.entityModel.find(filter);

    if (query.sort) {
      if (query.geometry) {
        entity.sort(query.sort).find({
          [query.geometry.field]: {
            $near: {
              $geometry: {
                type: query.geometry.type,
                coordinates: query.geometry.coordinates,
              },
            },
          },
        });
      } else {
        entity.sort(query.sort);
      }
    }
    if (query.page) {
      entity.skip(+query.page * +query.limit).limit(+query.limit);
    }
    if (query.felid) entity.select(query.felid);

    if (query.geometry) {
      entity.find({
        [query.geometry.field]: {
          $near: {
            $geometry: {
              type: query.geometry.type,
              coordinates: query.geometry.coordinates,
            },
          },
        },
      });
    }

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

  async editMany(filter: FilterQuery<T>, update: unknown): Promise<any> {
    return this.entityModel.updateMany(filter, update);
  }

  async editOneById(id: string, update: unknown): Promise<T> {
    return this.entityModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  }

  // Delete
  async deleteOne(filter: FilterQuery<T>) {
    return this.entityModel.deleteOne(filter);
  }
  async deleteMany(filter: FilterQuery<T>) {
    return this.entityModel.deleteMany(filter);
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
