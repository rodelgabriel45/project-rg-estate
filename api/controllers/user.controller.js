import bcryptjs from "bcryptjs";

import { errorHandler } from "../util/error.js";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({ success: true, data: rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_cookie");
    res.status(200).json({ success: true, message: "User has been deleted!" });
  } catch (error) {
    next(error);
  }
};