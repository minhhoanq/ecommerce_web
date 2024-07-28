import axios from "../axios";

export const uploadImages = (data) =>
    axios({
        url: "/image/thumbnail/multiple",
        method: "post",
        data,
    });
export const uploadImage = (data, pid) =>
    axios({
        url: "/image/thumbnail/",
        method: "post",
        data,
    });
