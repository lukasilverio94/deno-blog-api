import { Model, Types, QueryFilter, QueryOptions, UpdateQuery, MongooseUpdateQueryOptions } from "mongoose";
import is from '@zarco/isness';
import { throwlhos } from "../globals/Throwlhos.ts";

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

  updateOne(updateQuery: QueryFilter<T>,
            update: UpdateQuery<T>,
            options?: MongooseUpdateQueryOptions,
   ) {
     const findAndUpdate = this.model.findOneAndUpdate(
        updateQuery as QueryFilter<T>,
        update,
        {
          new: true,
          runValidators: true,
          ...options,
        },
      );

    return findAndUpdate;
  }


  updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    if (!is.objectId(id)) {
      throw throwlhos.err_internalServerError(
        'updateById requires a valid ObjectId',
        {
          givenId: id,
          typeofGivenObjectId: typeof id,
        },
      )
    }
    const findByIdAndUpdate = this.updateOne( { _id: id }, update, options );
    return findByIdAndUpdate;
  }

  delete(id: string | Types.ObjectId) {
    return this.model.findByIdAndDelete(id);
  }
}