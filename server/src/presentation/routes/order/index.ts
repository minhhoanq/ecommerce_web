import express, { Request, Response, NextFunction } from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { OrderController } from "../../controllers/order.controller";
import { TYPES } from "../../../shared/constants/types";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import querystring from "qs";
import crypto from "crypto";
// import moment from "moment";

const router = express.Router();

const controller = container.get<OrderController>(TYPES.OrderController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);

router.post(
    "",
    auth.authentication,
    access.GrantAccess("createOwn", "order"),
    asyncHandler(controller.order.bind(controller))
);

router.post(
    "/checkout",
    auth.authentication,
    access.GrantAccess("createOwn", "order"),
    asyncHandler(controller.checkout.bind(controller))
);

router.get(
    "/",
    auth.authentication,
    access.GrantAccess("readOwn", "order"),
    asyncHandler(controller.getOrders.bind(controller))
);

router.get(
    "/:orderId",
    auth.authentication,
    access.GrantAccess("readOwn", "order"),
    asyncHandler(controller.getOrder.bind(controller))
);

function sortObject(obj: any) {
    const sorted: any = {};
    const str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}

router.post(
    "/create_payment_url",
    asyncHandler(function (req: Request, res: Response, next: NextFunction) {
        const ipAddr: any =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;
        // req.connection.socket.remoteAddress;

        const tmnCode: string = process.env.VNP_TMNCODE || "";
        const secretKey: string = process.env.VNP_HASHSECRET || "";
        let vnpUrl: string = process.env.VNP_URL || "";

        const returnUrl = process.env.VNP_RETURNURL || "";

        const date = new Date();

        // let createDate = moment(date).format("YYYYMMDDHHmmss");
        // const orderId = moment(date).format("DDHHmmss");
        let createDate = "";
        const orderId = "";
        const amount = req.body.amount || 10000;
        const bankCode = req.body.bankCode || "VNBANK";

        const orderInfo = req.body.orderDescription || "descpayment";
        const orderType = req.body.orderType || "order";
        let locale = req.body.language || "vn";
        if (locale === null || locale === "") {
            locale = "vn";
        }
        const currCode = "VND";
        let vnp_Params: any = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params["vnp_Locale"] = locale || "vn";
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_OrderType"] = orderType;
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        // Build Hash data và querystring với phiên bản cũ 2.0.0, 2.0.1:
        // const querystring = require("qs");
        // const signData =
        //     secretKey + querystring.stringify(vnp_Params, { encode: false });
        // const md5 = require("md5");
        // const secureHash = md5(signData);
        // vnp_Params["vnp_SecureHashType"] = "MD5";
        // vnp_Params["vnp_SecureHash"] = secureHash;
        // vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
        // res.redirect(vnpUrl);

        // Chuyển thành:
        // Build Hash data và querystring với phiên bản mới 2.1.0:

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
        console.log(vnpUrl);

        return res.status(200).json({
            vnpUrl: vnpUrl,
        });
    })
);
// Vui lòng tham khảo thêm tại code demo

router.get("/vnpay_ipn", function (req, res, next) {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNP_HASHSECRET || "";

    // Thay đổi đoạn code:
    // const signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
    // const md5 = require('md5');
    // const checkSum = md5(signData);
    // hoặc
    // const signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
    // const md5 = require('sha256');
    // const checkSum = sha256(signData);

    // Chuyển thành:

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey as string);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        const orderId = vnp_Params["vnp_TxnRef"];
        const rspCode = vnp_Params["vnp_ResponseCode"];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
        res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
});

router.get("/vnpay_return", function (req, res, next) {
    let vnp_Params = req.query;

    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const tmnCode: string = process.env.VNP_TMNCODE || "";
    const secretKey: string = process.env.VNP_HASHSECRET || "";

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey as string);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
    } else {
        res.render("success", { code: "97" });
    }
});

export default router;
