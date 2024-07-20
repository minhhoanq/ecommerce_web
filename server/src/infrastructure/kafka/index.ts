import { Kafka } from "kafkajs";
import { v4 as uuid4 } from "uuid";

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

const getConsumer = async (groupId: string) => {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    return consumer;
};

// Hàm gửi message
export const sendProductsByKafka = async (products: any[]) => {
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

export const publishMessage = async (
    producer: any,
    topic: string,
    message: any
) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    } catch (error) {
        throw new Error("Publish message error: " + error);
    }
};

export const subscribeMessage = async (
    consumer: any,
    topic: string,
    service: any
) => {
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({
            topic,
            partition,
            message,
        }: {
            topic: string;
            partition: any;
            message: any;
        }) => {
            console.log("Data subscribe: " + message.value.toString());
            service.SubscribeEvents(message.value.toString());
        },
    });
};

export const RPCObserver = async (RPC_TOPIC_NAME: string, service: any) => {
    const consumer = await getConsumer("rpc-observer-group");
    const producer = await getProducer();

    await consumer.subscribe({ topic: RPC_TOPIC_NAME, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({
            topic,
            partition,
            message,
        }: {
            topic: string;
            partition: any;
            message: any;
        }) => {
            const payload = JSON.parse(message.value.toString());
            console.log(payload);
            const response = await service.serverRPCRequest(payload);
            await producer.send({
                topic: message.headers.replyTo.toString(),
                messages: [
                    {
                        value: JSON.stringify(response),
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

const requestData = async (
    RPC_TOPIC_NAME: string,
    requestPayload: any,
    uuid: any
) => {
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
            eachMessage: async ({
                topic,
                partition,
                message,
            }: {
                topic: string;
                partition: any;
                message: any;
            }) => {
                if (message.headers.correlationId.toString() === uuid) {
                    resolve(message.value.toString());
                    await consumer.disconnect();
                    await producer.disconnect();
                } else {
                    reject("Data not found!");
                }
            },
        });
    });
};

export const RPCRequest = async (
    RPC_TOPIC_NAME: string,
    requestPayload: any
) => {
    const uuid = uuid4();
    return await requestData(RPC_TOPIC_NAME, requestPayload, uuid);
};
