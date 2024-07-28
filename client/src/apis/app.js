import axios from "../axios";

export const apiGetCategories = () =>
    axios({
        url: "/category/",
        method: "get",
    });
export const apiGetCategory = (category) =>
    axios({
        url: "/category/" + category,
        method: "get",
    });
export const apiGetDashboard = (params) =>
    axios({
        url: "/order/dashboard",
        method: "get",
        params,
    });
