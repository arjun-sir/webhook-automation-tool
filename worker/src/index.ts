import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });

      // Do something with the message
      await new Promise((r) => setTimeout(r, 1000));
      //nod

      await consumer.commitOffsets([
        { topic, partition, offset: (parseInt(message.offset) + 1).toString() },
      ]);
    },
  });
}

main();
