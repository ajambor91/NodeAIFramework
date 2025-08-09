import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  email: string;
  hashedPassword: string;
  salt: string;
  createdAt: Date;
  deletedAt?: Date;
}

export interface UserWithSalt extends User {
  salt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  _id: string;
  email: string;
  createdAt: string;
}