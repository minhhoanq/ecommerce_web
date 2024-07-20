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
}

module.exports = new FeedbackRepository();
