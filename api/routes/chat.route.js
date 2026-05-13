import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { addChat, getChats, getChat, readChat} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);



export default router;