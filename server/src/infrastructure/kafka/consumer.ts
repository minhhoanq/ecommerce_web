import { Kafka } from "kafkajs";

// Khởi tạo Kafka instance
const kafka = new Kafka({
    clientId: "my-kafka-app",
    brokers: ["localhost:29092"], // Danh sách các Kafka broker
});

// Tạo consumer
const consumer = kafka.consumer({ groupId: "test-group" });

// Hàm tiêu thụ (consume) message
export const consumeMessages = async () => {
    try {
        await consumer.connect(); // Kết nối đến Kafka broker

        await consumer.subscribe({ topic: "products" }); // Đăng ký theo dõi topic

        // Xử lý message khi nhận được
        await consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message,
            }: {
                topic: any;
                partition: any;
                message: any;
            }) => {
                console.log({
                    value: message.value.toString(), // Giá trị của message
                    offset: message.offset, // Vị trí (offset) của message trong partition
                });
            },
        });
    } catch (error) {
        console.error("Error consuming messages:", error);
    }
};

// Gọi hàm tiêu thụ message
// consumeMessages();
