import { User } from '../models/user.model';
import { BaseRepository } from "./base.repository";
import { Document, Model } from 'mongoose';
import { injectable } from "inversify";

@injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(mongooseModel: Model<Document<User>>) {
    super(mongooseModel);
  }
}
