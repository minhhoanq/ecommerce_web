import axios from "../axios";

export const apiCheckout = (data) =>
    axios({
        url: "/order/checkout",
        method: "post",
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

export const apiCreatePayment = (data) =>
    axios({
        url: "/order/create_payment",
        method: "POST",
        data,
    });
