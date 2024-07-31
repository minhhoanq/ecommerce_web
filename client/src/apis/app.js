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
export const apiGetStatistical = (params) =>
    axios({
        url: "/order/statistical",
        method: "get",
        params,
    });
