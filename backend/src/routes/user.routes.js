import express from "express";
import * as controllers from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/me", controllers.authMe);

export const userRoutes = router;
