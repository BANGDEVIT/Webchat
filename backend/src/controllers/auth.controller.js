import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signup = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({
          message: "Username already exists",
        });
      }

      if (existingUser.email === email) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const displayName = lastName + " " + firstName;

    await User.create({
      username,
      email,
      hashedPassword: hashedPassword,
      displayName,
    });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        message: "Username or Password is invalid",
      });
    }

    const correctPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!correctPassword) {
      return res.status(400).json({
        message: "Username or Password is invalid",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "none", //backend, frontend deploy riêng (quyết định cookie có được gửi khi request từ domain khác hay không)
      // maxAge: REFRESH_TOKEN_TTL,
    });

    res
      .status(200)
      .json({ message: `User ${user.displayName} đã logged in!`, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal system error",
    });
  }
};

export const sigout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await Session.deleteOne({
        refreshToken,
      });

      res.clearCookie("refreshToken");
    }
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal system error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Lấy refresh token trong cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // so với refresh token trong databse
    const session = await Session.findOne({
      refreshToken: token,
    });

    if (!session) {
      return res.status(403).json({
        message: "Not found or Expired refresh token",
      });
    }

    // xem refresh token hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({
        message: "Expired refresh token",
      });
    }

    // tạo mới access token
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal system error",
    });
  }
};
