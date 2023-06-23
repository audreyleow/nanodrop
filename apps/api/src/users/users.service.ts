import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(createUserDto);
      return createdUser;
    } catch (e: any) {
      if (e.code === 11000) {
        // Duplicate key error
        throw new ConflictException("User already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
