import axios from "../axios";

export const apiSignup = (data) =>
    axios({
        url: "/auth/signup",
        method: "post",
        data,
    });
export const apiFinalSignup = (token) =>
    axios({
        url: "/auth/final-signup/" + token,
        method: "put",
    });
export const apiSignin = (data) =>
    axios({
        url: "/auth/signin",
        method: "post",
        data,
    });
export const apiForgotPassword = (data) =>
    axios({
        url: "/auth/forgot-password",
        method: "post",
        data,
    });
export const apiResetPassword = (data) =>
    axios({
        url: "/auth/reset-password",
        method: "put",
        data,
    });
export const apiGetCurrent = () =>
    axios({
        url: "/auth/me",
        method: "get",
    });
export const apiGetUsers = (params) =>
    axios({
        url: "/auth/",
        method: "get",
        params,
    });
export const apiUpdateUser = (data, uid) =>
    axios({
        url: "/user/" + uid,
        method: "put",
        data,
    });
export const apiDeleteUser = (uid) =>
    axios({
        url: "/user/" + uid,
        method: "delete",
    });
export const apiUpdateCurrent = (data) =>
    axios({
        url: "/auth/update",
        method: "patch",
        data,
    });
export const addToCart = (data) =>
    axios({
        url: "/cart",
        method: "post",
        data,
    });

export const getCartItems = () =>
    axios({
        url: "/cart",
        method: "get",
    });
export const apiRemoveCart = (id) =>
    axios({
        url: `/cart`,
        method: "delete",
        data: {
            productItemId: id,
        },
    });
export const apiUpdateCart = (data) =>
    axios({
        url: `/cart/update`,
        method: "patch",
        data: data,
    });
export const apiUpdateWishlist = (pid) =>
    axios({
        url: `/user/wishlist/` + pid,
        method: "put",
    });
