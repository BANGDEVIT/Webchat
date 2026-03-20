import express from "express";
import * as controllers from "../controllers/conversation.controller.js";
import { checkFriendship } from "../middlewares/friend.middleware.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute);

router.post("/", checkFriendship, controllers.createConversation);
router.get("/", controllers.getConversation);
router.get("/:conversationId/messages", controllers.getMessage);

export const conversationRoutes = router;
