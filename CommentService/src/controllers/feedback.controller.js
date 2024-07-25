"use strict";
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const FeedbackService = require("../services/feedback.service");

class FeedbackController {
    homepage = async (req, res, next) => {
        res.sendFile(__basedir + "/index.html");
    };

    message = async (req, res, next) => {
        const { msg } = req.query;
        // const io = res.io;
        _io.emit("chat message", msg);
        return res.json({ code: 200, msg });
    };

    createFeedback = async (req, res, next) => {
        new CREATED({
            message: "create feedback successfully!",
            metadata: await FeedbackService.createFeedback(req.body),
        }).send(res);
    };

    getFeedback = async (req, res, next) => {
        new CREATED({
            message: "create feedback successfully!",
            metadata: await FeedbackService.createFeedback(req.body),
        }).send(res);
    };
}

module.exports = new FeedbackController();
