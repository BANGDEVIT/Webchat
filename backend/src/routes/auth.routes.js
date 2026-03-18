import express from "express";
import * as controllers from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequestMiddleware.js";
import { signupSchema, signinSchema } from "../validators/auth.validators.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), controllers.signup);

router.post("/signin", validateRequest(signinSchema), controllers.signin);

router.post("/signout", controllers.sigout);

router.post("/refresh", controllers.refreshToken);

export const authRoutes = router;
