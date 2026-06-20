import { Router } from "express";
import { signup,login,getMe,logout,refresh} from "../controllers/auth.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/me",verifyJWT,getMe);
router.post("/logout",verifyJWT,logout);
router.post("/refresh",refresh);
export default router;