const amqplib = require("amqplib");
const { v4: uuid4 } = require("uuid");
require("dotenv").config();

let amqplibConnection = null;

const getChannel = async () => {
    try {
        console.log(process.env.URL_RABBITMQ);

        if (amqplibConnection === null) {
            amqplibConnection = await amqplib.connect(process.env.URL_RABBITMQ);
            console.log("Connected to RabbitMQ Successfully");
        }
        return await amqplibConnection.createChannel();
    } catch (error) {
        throw new Error("Setup connect error: " + error);
    }
};

const setupChannel = async () => {
    try {
        const channel = await getChannel();
        channel.assertExchange(
            process.env.EXCHANGE_NAME || "",
            "direct",
            false
        );
        return channel;
    } catch (error) {
        throw new Error("Setup channel error: " + error);
    }
};

const publishMessage = async (channel, bindingKey, message) => {
    try {
        await channel.publish(
            process.env.EXCHANGE_NAME,
            bindingKey,
            Buffer.from(message)
        );
    } catch (error) {
        throw new Error("Publish message error: " + error);
    }
};

const subcribeMessage = async (channel, service) => {
    try {
        const q = await channel.assertQueue(process.env.QUEUE_NAME || "");
        channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, "NOTI_KEY");
        channel.consume(q.queue, (data) => {
            // service.Subcribe
            console.log("Data subcribe: " + data.content.toString());
            service.SubscribeEvents(data.content.toString());
            channel.ack(data);
        });
    } catch (error) {
        throw new Error("Subcribe message error: " + error);
    }
};

const RPCObserver = async (RPC_QUEUE_NAME, service) => {
    const channel = await getChannel();
    await channel.assertQueue(RPC_QUEUE_NAME, {
        durable: true,
    });
    channel.prefetch(1);
    channel.consume(
        RPC_QUEUE_NAME,
        async (msg) => {
            if (msg.content) {
                const payload = JSON.parse(msg.content.toString());
                console.log("payload rpc observer: ", payload);
                const response = await service.SubscribeEvents(payload);
                console.log(response);
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: msg.properties.correlationId,
                    }
                );
                channel.ack(msg);
            }
        },
        {
            noAck: false,
        }
    );
};

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
    try {
        const channel = await getChannel();
        //cho` queue service khac xu li xong nhan ve data
        const q = await channel.assertQueue("", { exclusive: true });
        channel.sendToQueue(
            RPC_QUEUE_NAME,
            Buffer.from(JSON.stringify(requestPayload)),
            {
                replyTo: q.queue,
                correlationId: uuid,
            }
        );

        return new Promise((resolve, reject) => {
            channel.consume(
                q.queue,
                (msg) => {
                    if (msg.properties.correlationId === uuid) {
                        resolve(JSON.parse(msg.content.toString()));
                    } else {
                        reject("Data not found!");
                    }
                },
                {
                    noAck: true,
                }
            );
        });
    } catch (error) {
        throw new Error("Request Data error: " + error);
    }
};

const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
    const uuid = uuid4();
    return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};

module.exports = {
    getChannel,
    setupChannel,
    subcribeMessage,
    publishMessage,
    RPCObserver,
    RPCRequest,
};
