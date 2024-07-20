const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/feedback.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.get("/", FeedbackController);
// router.get("/api/message", message);
router.post(
    "/api/v1/feedback",
    asyncHandler(FeedbackController.createFeedback)
);

module.exports = router;
