const { PrismaClient } = require("@prisma/client");

class ImageFeedbackRepository {
    prisma = new PrismaClient();

    async createImageFeedback(data) {
        return await this.prisma.imageFeedback.create({
            data: {
                feedbackId: data.feedbackId,
                src: data.src,
            },
        });
    }
}

module.exports = new ImageFeedbackRepository();
