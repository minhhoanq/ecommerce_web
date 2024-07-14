import axios from "../axios";

export const apiCheckout = (data) =>
    axios({
        url: "/order/checkout",
        method: "post",
        data,
    });
export const apiPayment = (data) =>
    axios({
        url: "order/create_payment_url",
        method: "POST",
        data,
    });

export const apiOrder = (data) =>
    axios({
        url: "/order",
        method: "POST",
        data,
    });

export const apiGetUserOrders = (params) =>
    axios({
        url: "/order",
        method: "get",
        params,
    });

export const apiGetOrder = (orderId) =>
    axios({
        url: `/order/${orderId}`,
        method: "GET",
    });
