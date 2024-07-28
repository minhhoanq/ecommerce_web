import { Kafka } from "kafkajs";

// Khởi tạo Kafka instance
const kafka = new Kafka({
    clientId: "my-kafka-app",
    brokers: ["localhost:29092"], // Danh sách các Kafka broker
});

const producer = kafka.producer();

// Hàm gửi message
export const sendProductsByKafka = async (products: any[]) => {
    try {
        await producer.connect(); // Kết nối đến Kafka broker
        console.log("Connection successfully!");
        for (const product of products) {
            await producer.send({
                topic: "products",
                messages: [{ value: JSON.stringify(product) }],
            });
        }
        console.log("Messages sent successfully!");
    } catch (error) {
        console.error("Error sending messages:", error);
    } finally {
        await producer.disconnect(); // Ngắt kết nối với Kafka broker
    }
};
