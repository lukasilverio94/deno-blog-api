import { Model, Types, QueryFilter, QueryOptions} from "mongoose";

export class BaseRepository<T> {
  protected model: Model<T>;
 
  constructor(model: Model<T>) {
    this.model = model;
  }

  create(data: Partial<T>){
    return this.model.create(data);
  }

  findById(id: string | Types.ObjectId) {
    return this.model.findById(id);
  }

  findOne(query: QueryFilter<T>, options?: QueryOptions) {
    const findOne = this.model.findOne(query, options)
    return findOne;
  }

  findAll(){
    return this.model.find();
  }

  update(id: string | Types.ObjectId, item: Partial<T>){
    return this.model.findByIdAndUpdate(id, item, { returnDocument: "after", runValidators: true});
  }

  delete(id: string | Types.ObjectId) {
    return this.model.findByIdAndDelete(id);
  }
}