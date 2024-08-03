const { PrismaClient } = require("@prisma/client");

class FeedbackRepository {
    prisma = new PrismaClient();

    async createFeedback(data) {
        return await this.prisma.feedback.create({
            data: {
                userId: data.userId,
                orderItemId: data.orderItemId,
                star: data.star,
                content: data.content,
            },
        });
    }

    async getFeedbacks(data) {
        console.log("data: ", data);
        const ids = data.map((el) => el.id);
        return await this.prisma.feedback.findMany({
            where: {
                orderItemId: {
                    in: ids,
                },
            },
            select: {
                id: true,
                orderItemId: true,
                userId: true,
                star: true,
                content: true,
                createdAt: true,
                imageFeedbacks: {
                    select: {
                        src: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

module.exports = new FeedbackRepository();
