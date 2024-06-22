import { apiGetBlogById } from "apis/blog"
import DOMPurify from "dompurify"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const DetailBlogs = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState()
  const fetchBlog = async () => {
    const response = await apiGetBlogById(id)
    if (response.success) setBlog(response.rs)
  }
  useEffect(() => {
    if (id) fetchBlog()
  }, [id])
  return (
    <div className="w-main mx-auto my-6">
      <h1 className="text-2xl font-semibold text-main">{blog?.title}</h1>
      <small>
        Được đăng bởi: <span>{blog?.author}</span>
      </small>
      <small className="mx-4">
        Ngày đăng: <span>{moment(blog?.createdAt).format("DD/MM/YYYY")}</span>
      </small>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog?.description),
        }}
        className="mt-4"
      ></div>
    </div>
  )
}

export default DetailBlogs
