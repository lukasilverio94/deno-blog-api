import { Model, Types} from "mongoose";

export class BaseRepository<T> {
  protected model: Model<T>;
 
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string | Types.ObjectId ): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async update(id: string | Types.ObjectId, item: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async delete(id: string | Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}