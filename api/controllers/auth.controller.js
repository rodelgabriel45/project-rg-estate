import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../util/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User Created Successfully!",
    });
  } catch (error) {
    error.message = "User Already Exists!";
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "Invalid Credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_cookie", token, { httpOnly: true })
      .status(200)
      .json({ success: true, message: "Signin Successfully!", data: rest });
  } catch (error) {
    next(errorHandler(500, "Error in Sign In!"));
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_cookie");
    res
      .status(200)
      .json({ success: true, message: "User has been logged out!" });
  } catch (error) {
    next(error);
  }
};
