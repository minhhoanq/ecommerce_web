import express, { Request, Response, NextFunction } from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { OrderController } from "../../controllers/order.controller";
import { TYPES } from "../../../shared/constants/types";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import bodyParser from "body-parser";
const router = express.Router();
// express().use(bodyParser.raw({ type: "application/json" }));

const controller = container.get<OrderController>(TYPES.OrderController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    asyncHandler(controller.eventWebhooks.bind(controller))
);

router.use(express.json());

router.post(
    "",
    auth.authentication,
    // access.GrantAccess("createOwn", "order"),
    asyncHandler(controller.order.bind(controller))
);

router.post(
    "/checkout",
    auth.authentication,

    // access.GrantAccess("createOwn", "order"),
    asyncHandler(controller.checkout.bind(controller))
);

router.get(
    "/",
    auth.authentication,
    // access.GrantAccess("readOwn", "order"),
    asyncHandler(controller.getOrders.bind(controller))
);

router.get(
    "/:orderId",
    auth.authentication,
    // access.GrantAccess("readOwn", "order"),
    asyncHandler(controller.getOrder.bind(controller))
);

router.post(
    "/create_payment",
    auth.authentication,
    asyncHandler(controller.createPayment.bind(controller))
);

export default router;
