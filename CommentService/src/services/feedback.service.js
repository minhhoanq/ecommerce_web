const feedbackRepo = require("../repositories/feedback.repo");
const { getProducer, RPCRequest } = require("../utils/kafka");

class FeedbackService {
    //connection socket
    connection(socket) {
        console.log("User connection with id: ", socket.id);

        socket.on("disconnect", () => {
            console.log(`User disconnect id is ${socket.id}`);
        });

        // event on here

        socket.on("joinRoom", (msg) => {
            socket.room = msg;
            console.log(`msg is:::${msg}`);
            socket.join(msg);
            console.log(socket.adapter.rooms);
        });

        socket.on("userComment", (data) => {
            console.log(data);
            _io.sockets.in(socket.room).emit("serverComment", data);
        });
        // on room..
    }

    async createFeedback(body) {
        console.log("body", body);

        // const producer = await getProducer();
        const response = await RPCRequest("FEED_BACK", body);
        const data = {
            userId: response.userId,
            orderItemId: response.orderItemId,
            star: +body.data.star,
            content: body.data.content,
        };
        const createFeedback = await feedbackRepo.createFeedback(data);

        return createFeedback;
    }
}

module.exports = new FeedbackService();
