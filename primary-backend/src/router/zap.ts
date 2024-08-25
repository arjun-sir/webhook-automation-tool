import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prisma } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json({
            message: "Invalid data",
            data: parsedData.error.errors,
        });
    }

    const zapId = await prisma.$transaction(async (tx) => {
        const zap = await tx.zap.create({
            data: {
                userId: id,
                triggerId: "",
                Action: {
                    create: parsedData.data.actions.map((action, index) => ({
                        actionId: action.availableActionId,
                        sortingOrder: index,
                    })),
                },
            },
        });

        const trigger = await tx.trigger.create({
            data: {
                zapId: zap.id,
                triggerId: parsedData.data.availableTriggerId,
            },
        });

        await tx.zap.update({
            where: {
                id: zap.id,
            },
            data: {
                triggerId: trigger.id,
            },
        });

        return zap.id;
    });

    res.status(200).json({
        message: "Zap created",
        zapId: zapId,
    });
});

router.get("/", authMiddleware, (req, res) => {
    // @ts-ignore
    const id = req.id;

    const zaps = prisma.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            Action: {
                select: {
                    type: true,
                },
            },
            trigger: {
                select: {
                    type: true,
                },
            },
        },
    });
    res.status(200).json(zaps);
});

router.get("/:zapId", authMiddleware, (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = prisma.zap.findFirst({
        where: {
            userId: id,
            id: zapId,
        },
        include: {
            Action: {
                select: {
                    type: true,
                },
            },
            trigger: {
                select: {
                    type: true,
                },
            },
        },
    });
    res.status(200).json(zap);
});

export const zapRouter = router;
