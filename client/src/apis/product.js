import axios from "../axios";

export const apiGetProducts = (params) =>
    axios({
        url: "/product/",
        method: "get",
        params,
    });
export const apiGetProductsManager = (params) =>
    axios({
        url: "/product/manager",
        method: "get",
        params,
    });
export const apiSearchProducts = (params) =>
    axios({
        url: "/product/search",
        method: "get",
        params,
    });
export const apiGetVariations = (slug, category) =>
    axios({
        url: "/product/varriant/" + slug + "/" + category,
        method: "get",
    });
export const apiGetProduct = (slug) =>
    axios({
        url: "/product/" + slug,
        method: "get",
    });
export const apiRatings = (data) =>
    axios({
        url: "/product/ratings",
        method: "put",
        data,
    });
export const apiCreateProduct = (data) =>
    axios({
        url: "/product/",
        method: "post",
        data,
    });
export const apiUpdateProduct = (data, pid) =>
    axios({
        url: "/product/" + pid,
        method: "put",
        data,
    });
export const apiDeleteProduct = (pid) =>
    axios({
        url: "/product/" + pid,
        method: "delete",
    });
export const apiAddVarriant = (data, pid) =>
    axios({
        url: "/product/varriant/" + pid,
        method: "put",
        data,
    });
export const apiCreateOrder = (data) =>
    axios({
        url: "/order/",
        method: "post",
        data,
    });
export const apiGetOrders = (params) =>
    axios({
        url: "/order/admin",
        method: "get",
        params,
    });

export const apiUpdateStatus = (data) =>
    axios({
        url: "/order/update/status/",
        method: "patch",
        data,
    });
export const apiDeleteOrderByAdmin = (oid) =>
    axios({
        url: "/order/admin/" + oid,
        method: "delete",
    });

export const getFeedbackApi = (slug) =>
    axios({
        url: "/product/feedback/" + slug,
        method: "get",
    });
export const apiGetBestSellers = () =>
    axios({
        url: "/product/best-sellers",
        method: "get",
    });
