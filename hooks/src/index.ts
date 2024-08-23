import express from "express"
import {PrismaClient} from "@prisma/client"

const client = new PrismaClient();

const app = express();
app.use(express.json())
// https://hooks.zapier.com/hooks/catch/19895634/26g6l39/

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId
    const zapId = req.params.zapId
    const body = req.body

    // store in a db a new trigger
    await client.$transaction(async tx =>{
        const run = await client.zapRun.create({
            data:{
                zapId: zapId,
                metadata: body
            }
        })

        await client.zapRunOutbox.create({
            data:{
                zapRunId: run.id
            }
        })
    })

    // push it onto a queue (kafka/redis)

    res.json({
        message: "Webhook recd"
    })
})

app.listen(3000)