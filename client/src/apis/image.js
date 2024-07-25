import axios from "../axios";

export const uploadImages = (data) =>
    axios({
        url: "/image/thumbnail/multiple",
        method: "post",
        data,
    });
export const apiAddVarriant = (data, pid) =>
    axios({
        url: "/product/varriant/" + pid,
        method: "put",
        data,
    });
