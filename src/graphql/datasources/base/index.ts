/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document, Model, Mongoose } from 'mongoose';
import { DataSource } from 'apollo-datasource';

import connection from '../../../db';
import { RandomObject } from '../../../utils/definitions';

abstract class MongooseDataSource<
  TProps extends RandomObject
> extends DataSource {
  protected model: Model<Document>;
  protected connection: () => Promise<Mongoose>;
  protected populate: { path: string }[];

  public name: string;

  constructor(
    name: string,
    model: Model<Document>,
    populate?: { path: string }[]
  ) {
    super();
    this.connection = connection;
    this.model = model;
    this.name = name;
    this.populate = populate;
  }

  protected async populateModel(
    model: Document | Document[]
  ): Promise<Document | Document[]> {
    return this.populate ? this.model.populate(model, this.populate) : model;
  }

  protected async find(filter: RandomObject): Promise<Document[]> {
    await this.connection();
    return this.model
      .find(filter)
      .sort({ createdAt: 'desc' })
      .then(this.populateModel) as Promise<Document[]>;
  }

  protected async findOne(filter: RandomObject): Promise<Document> {
    await this.connection();
    return this.model.findOne(filter).then(this.populateModel) as Promise<
      Document
    >;
  }

  protected async findById(id: string): Promise<Document> {
    return this.findOne({ id });
  }

  protected async create(props: TProps): Promise<Document> {
    await this.connection();
    return this.model.create(props).then(this.populateModel) as Promise<
      Document
    >;
  }

  protected async delete(id: string): Promise<Document> {
    await this.connection();
    return this.model.findByIdAndDelete(id).then(this.populateModel) as Promise<
      Document
    >;
  }

  protected async update(props: TProps): Promise<Document> {
    const { id, createdAt, updatedAt, __v, ...other } = props;
    await this.connection();
    return this.model
      .findByIdAndUpdate(
        id,
        { $set: other, $inc: { __v: 1 } },
        { new: true, upsert: false }
      )
      .then(this.populateModel) as Promise<Document>;
  }

  async getById(id: string): Promise<TProps> {
    try {
      const result = await this.findById(id);
      if (!result) {
        throw new Error(
          `Failed to fetch ${this.name} entry with ID: ${id}! Not found.`
        );
      }
      return result.toJSON();
    } catch (e) {
      console.error(e);
      throw new Error(`No ${this.name} entry found with ID: ${id}.`);
    }
  }

  async getOne(filter: TProps): Promise<TProps> {
    try {
      const result = await this.findOne({ $and: filter });
      if (!result) {
        throw new Error(
          `No ${this.name} entry found using filter: ${JSON.stringify(filter)}`
        );
      }
      return result.toJSON();
    } catch (e) {
      console.error(e);
      throw new Error(`No ${this.name} entry found using given filters.`);
    }
  }

  async getMany(filter: TProps): Promise<TProps[]> {
    try {
      const result = await this.find({ $or: filter });
      if (!result) {
        throw new Error(
          `No ${this.name} data found using filter: ${JSON.stringify(filter)}`
        );
      }
      return result.map(r => r.toJSON());
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to fetch data from ${this.name} entries.`);
    }
  }

  async createOne(props: TProps): Promise<TProps> {
    try {
      const { id, _id, createdAt, updatedAt, ...other } = props;
      if (id || _id || createdAt || updatedAt) {
        throw new Error(
          `Reserved property found in data structure! Failed to create ${
            this.name
          } entry.\nCheck for values in ${JSON.stringify({
            id,
            _id,
            createdAt,
            updatedAt,
          })}`
        );
      }
      const result = await this.create(other as TProps);
      return result.toJSON();
    } catch (e) {
      console.error(e);
      throw new Error(
        `Failed to create ${this.name} entry. Restricted data values found.`
      );
    }
  }

  async deleteOne(id: string): Promise<TProps> {
    try {
      const result = await this.delete(id);
      return result.toJSON();
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to delete ${this.name} entry with ID: ${id}.`);
    }
  }

  async updateOne(props: TProps): Promise<TProps> {
    try {
      const result = await this.update(props);
      return result.toJSON();
    } catch (e) {
      console.error(e);
      throw new Error(
        `Updating ${this.name} entry with ID: ${props.id} failed!`
      );
    }
  }
}

export default MongooseDataSource;
