import express from "express";
import * as controllers from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
  checkFriendship,
  checkGroupMembership,
} from "../middlewares/friend.middleware.js";

const router = express.Router();

router.use(protectedRoute);

router.post("/direct", checkFriendship, controllers.sendDirectMessage);

router.post("/group", checkGroupMembership, controllers.sendGroupMessage);

export const messageRoutes = router;
