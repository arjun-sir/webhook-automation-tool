import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSOWRD } from "../config";

const router = Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = SignupSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Invalid data",
      data: parsedData.error.errors,
    });
  }

  const userExists = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (userExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  } else {
    await prisma.user.create({
      data: {
        email: parsedData.data.email,
        // ****** password hashing should be done here *******
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });
    return res.status(200).json({
      message: "User created",
    });
  }
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Invalid data",
      data: parsedData.error.errors,
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user.id }, JWT_PASSOWRD);
  res.status(200).json({
    token: token,
  });
});

router.get("/", authMiddleware, async (req, res) => {
  // @ts-ignore
  const id = req.id;

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    user: user,
  });
});

export const userRouter = router;
