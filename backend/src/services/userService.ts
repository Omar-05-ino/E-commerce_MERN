import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  try {
    const findedUser = await UserModel.findOne({ email });

    if (findedUser) return { data: "User already exists", status: 400 };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateJwt({
      firstName,
      lastName,
      email,
    });

    return {
      data: token,
      status: 201,
    };
  } catch (error) {
    return { data: "Error registering user", status: 500 };
  }
};

interface loginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: loginParams) => {
  try {
    const findedUser = await UserModel.findOne({ email });
    if (!findedUser)
      return { data: "incorrect email or password", status: 400 };

    const passwordMatch = await bcrypt.compare(password, findedUser.password);
    if (!passwordMatch)
      return { data: "incorrect email or password", status: 400 };

    const token = generateJwt({
      firstName: findedUser.firstName,
      lastName: findedUser.lastName,
      email: findedUser.email,
    });

    return {
      data: token,
      status: 200,
    };
  } catch (error) {
    return { data: "Error logging in", status: 500 };
  }
};

const generateJwt = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || "");
};
