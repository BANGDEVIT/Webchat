import User from "../models/User.js";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import mongoose from "mongoose";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const from = req.user._id;

    if (from.toString() === to.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const userExists = await User.exists({ _id: to });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friend." });
    }

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request is already pending." });
    }

    const request = await FriendRequest.create({
      from,
      to,
      message,
    });

    return res
      .status(201)
      .json({ message: "Friend request sent successfully", request });
  } catch (error) {
    console.error(
      "[friendController][addFriend] Internal system error:",
      error,
    );
    return res.status(500).json({
      error: "Internal system error",
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId).session(session);

    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Not found request" });
    }

    if (request.to.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    const [userA, userB] = [
      request.from.toString(),
      request.to.toString(),
    ].sort();

    await Friend.create(
      [
        {
          userA: new mongoose.Types.ObjectId(userA),
          userB: new mongoose.Types.ObjectId(userB),
        },
      ],
      { session },
    ); // [{}] sẽ an toàn hơn {}

    // cũng là 1 cách
    // const friend = new Friend({ userA, userB });
    // await friend.save({ session });

    await FriendRequest.findByIdAndDelete(requestId).session(session);

    const from = await User.findById(request.from)
      .select("_id displayName avatarUrl")
      .lean()
      .session(session);

    await session.commitTransaction();

    return res.status(200).json({
      message: "Accept request successfully",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(
      "[friendController][acceptFriendRequest] Internal system error:",
      error,
    );
    return res.status(500).json({
      error: "Internal system error",
    });
  } finally {
    session.endSession();
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Not found friend request" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to decline this request" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.sendStatus(204);
  } catch (error) {
    console.error(
      "[friendController][delineFriendRequest] Internal system error:",
      error,
    );
    return res.status(500).json({
      error: "Internal system error",
    });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA", "_id displayName avatarUrl username") // join lấy dữ liệu bên model USer
      .populate("userB", "_id displayName avatarUrl username")
      .lean(); // trả về javascript object, không phải Mongoose document

    if (!friendships.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA,
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error(
      "[friendController][getAllFriends] Internal system error:",
      error,
    );
    return res.status(500).json({
      error: "Internal system error",
    });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username displayName avatarUrl";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error(
      "[friendController][getFriendsRequest] Internal system error:",
      error,
    );
    return res.status(500).json({
      error: "Internal system error",
    });
  }
};
