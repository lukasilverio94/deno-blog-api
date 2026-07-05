import { Model, Types} from "mongoose";

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

  findAll(){
    return this.model.find();
  }

  update(id: string | Types.ObjectId, item: Partial<T>){
    return this.model.findByIdAndUpdate(id, item, { new: true });
  }

  delete(id: string | Types.ObjectId) {
    return this.model.findByIdAndDelete(id);
  }
}