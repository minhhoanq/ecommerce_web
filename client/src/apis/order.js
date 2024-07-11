import axios from "../axios";

export const apiCheckout = (data) =>
    axios({
        url: "/order/checkout",
        method: "post",
        data,
    });
export const apiPayment = () =>
    axios({
        url: "order/create_payment_url",
        method: "POST",
    });
