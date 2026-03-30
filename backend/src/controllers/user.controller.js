import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";

export const authMe = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "ok", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal system error",
    });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.trim() === "") {
      return res.status(400).json({
        message: "Username is compulsory",
      });
    }

    const user = await User.findOne({
      username,
    }).select("_id displayName username avatarUrl");

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error(
      "[userController][searchUserByUsername] Internal system error",
      error,
    );
    return res.status(500).json({
      message: "Internal system error",
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      {
        returnDocument: "after",
      },
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "Avatar trả về null" });
    }

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload avatar", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
