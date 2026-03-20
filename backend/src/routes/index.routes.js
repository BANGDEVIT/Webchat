import { authRoutes } from "./auth.routes.js";
import { conversationRoutes } from "./conversation.routes.js";
import { friendRoutes } from "./friend.routes.js";
import { messageRoutes } from "./message.routes.js";
import { userRoutes } from "./user.routes.js";

export const clientRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/friends", friendRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/conversations", conversationRoutes);
};
