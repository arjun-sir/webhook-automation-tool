import express from "express"

const app = express();

// https://hooks.zapier.com/hooks/catch/19895634/26g6l39/

app.post("/hooks/catch/:userId/:zapId", (req, res) => {
    const userId = req.params.userId
    const zapId = req.params.zapId

    // store in a db a new trigger

    // push it onto a queue (kafka/redis)
})