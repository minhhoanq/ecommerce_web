import axios from "../axios";

export const apiCheckout = (data) =>
    axios({
        url: "/order/checkout",
        method: "post",
        data,
    });
