const { Kafka } = require("kafkajs");
const { v4: uuid4 } = require("uuid");

// Khởi tạo Kafka instance
const kafka = new Kafka({
    clientId: "my-kafka-app",
    brokers: ["localhost:29092"], // Danh sách các Kafka broker
});

const getProducer = async () => {
    const producer = kafka.producer();
    await producer.connect();
    return producer;
};

const getConsumer = async (groupId) => {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    return consumer;
};

// Hàm gửi message
const sendProductsByKafka = async (products) => {
    // try {
    //     await producer.connect(); // Kết nối đến Kafka broker
    //     console.log("Connection successfully!");
    //     for (const product of products) {
    //         await producer.send({
    //             topic: "products",
    //             messages: [{ value: JSON.stringify(product) }],
    //         });
    //     }
    //     console.log("Messages sent successfully!");
    // } catch (error) {
    //     console.error("Error sending messages:", error);
    // } finally {
    //     await producer.disconnect(); // Ngắt kết nối với Kafka broker
    // }
};

const publishMessage = async (producer, topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    } catch (error) {
        throw new Error("Publish message error: " + error);
    }
};
const subscribeMessage = async (consumer, topic, service) => {
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Data subscribe: " + message.value.toString());
            service.SubscribeEvents(message.value.toString());
        },
    });
};
const RPCObserver = async (RPC_TOPIC_NAME, service) => {
    const consumer = await getConsumer("rpc-observer-group");
    const producer = await getProducer();

    await consumer.subscribe({ topic: RPC_TOPIC_NAME, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const payload = JSON.parse(message.value.toString());
            // const response = await service.serverRPCRequest(payload);
            console.log(payload);

            await producer.send({
                topic: message.headers.replyTo.toString(),
                messages: [
                    {
                        value: JSON.stringify(payload),
                        headers: {
                            correlationId:
                                message.headers.correlationId.toString(),
                        },
                    },
                ],
            });
        },
    });
};

const requestData = async (RPC_TOPIC_NAME, requestPayload, uuid) => {
    const producer = await getProducer();
    const consumer = await getConsumer(uuid4());
    const replyTopic = `reply-${uuid}`;

    await consumer.subscribe({ topic: replyTopic, fromBeginning: true });

    await producer.send({
        topic: RPC_TOPIC_NAME,
        messages: [
            {
                value: JSON.stringify(requestPayload),
                headers: { replyTo: replyTopic, correlationId: uuid },
            },
        ],
    });

    return new Promise((resolve, reject) => {
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.headers.correlationId.toString() === uuid) {
                    console.log("cehcek feed");
                    resolve(JSON.parse(message.value.toString()));
                    await consumer.disconnect();
                    await producer.disconnect();
                } else {
                    reject("Data not found!");
                }
            },
        });
    });
};

const RPCRequest = async (RPC_TOPIC_NAME, requestPayload) => {
    const uuid = uuid4();
    return await requestData(RPC_TOPIC_NAME, requestPayload, uuid);
};

module.exports = {
    getProducer,
    getConsumer,
    publishMessage,
    subscribeMessage,
    RPCObserver,
    RPCRequest,
};
