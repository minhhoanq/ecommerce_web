import axios from "../axios"

export const apiCreateNewBlog = (data) =>
  axios({
    url: "/blog/",
    method: "post",
    data,
  })
export const apiGetBlogs = (params) =>
  axios({
    url: "/blog/",
    method: "get",
    params,
  })
export const apiUpdateBlog = (data, id) =>
  axios({
    url: "/blog/admin/" + id,
    method: "post",
    data,
  })
export const apiDeleteBlog = (id) =>
  axios({
    url: "/blog/" + id,
    method: "delete",
  })
export const apiGetBlogById = (id) =>
  axios({
    url: "/blog/one/" + id,
    method: "get",
  })
