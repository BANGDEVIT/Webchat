import { authRoutes } from "./auth.routes.js";
import { userRoutes } from "./user.routes.js";

export const clientRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
};
