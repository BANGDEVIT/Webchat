import express from "express";
import * as controllers from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/me", controllers.authMe);

router.get("/search", controllers.searchUserByUsername);

router.post("/uploadAvatar", upload.single("file"), controllers.uploadAvatar);

export const userRoutes = router;
