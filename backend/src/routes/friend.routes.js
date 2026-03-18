import express from "express";
import * as controllers from "../controllers/friend.controller.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute);

router.post("/requests", controllers.sendFriendRequest);

router.post("/requests/:requestId/accept", controllers.acceptFriendRequest);
router.post("/requests/:requestId/decline", controllers.declineFriendRequest);

router.get("/", controllers.getAllFriends);
router.get("/requests", controllers.getFriendRequests);

export const friendRoutes = router;
