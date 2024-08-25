import { Router } from "express";
import { authMiddleware } from "../middleware";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.send("signin handler");
});

router.post("/", authMiddleware, (req, res) => {
  res.send("signin handler");
});

router.get("/:zapId", authMiddleware, (req, res) => {
  res.send("zap handler");
});

export const zapRouter = router;
