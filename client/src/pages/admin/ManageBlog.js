import { apiDeleteBlog, apiGetBlogs } from "apis/blog"
import { InputForm, Pagination } from "components"
import withBaseComponent from "hocs/withBaseComponent"
import useDebounce from "hooks/useDebounce"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { BiEdit } from "react-icons/bi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { showModal } from "store/app/appSlice"
import UpdateBlog from "./UpdateBlog"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"

const ManageBlog = ({ dispatch }) => {
  const [params] = useSearchParams()
  const [update, setUpdate] = useState(false)
  const [counts, setCounts] = useState(0)
  const [blogs, setBlogs] = useState()
  const { isShowModal } = useSelector((s) => s.app)
  const {
    register,
    formState: { errors },
    watch,
  } = useForm()
  const fetchBlogs = async (param) => {
    const response = await apiGetBlogs({
      ...param,
      limit: process.env.REACT_APP_LIMIT,
    })
    if (response.success) {
      setCounts(response.counts)
      setBlogs(response.blogs)
    }
  }

  const queryDebounce = useDebounce(watch("q"), 800)
  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    if (queryDebounce) searchParams.q = queryDebounce
    if (!isShowModal) fetchBlogs(searchParams)
  }, [params, update, queryDebounce, isShowModal])
  const handleDeleteBolg = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận thao tác",
      text: "Bạn có chắc muốn xóa bài viết này?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Quay lại",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteBlog(id)
        if (response.success) {
          setUpdate(!update)
          toast.success(response.mes)
        } else toast.error(response.mes)
      }
    })
  }
  return (
    <div className="w-full flex flex-col gap-4 min-h-screen bg-gray-50 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-50 flex items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
      </div>
      <div className="flex justify-end items-center px-4">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Search blogs by title, description,..."
          />
        </form>
      </div>
      <div className="px-4 w-full">
        <table className="table-auto w-full">
          <thead>
            <tr className="border bg-sky-900 text-white border-white">
              <th className="text-center py-2">#</th>
              <th className="text-center py-2">Title</th>
              <th className="text-center py-2">Hashtags</th>
              <th className="text-center py-2">Views</th>
              <th className="text-center py-2">Liked</th>
              <th className="text-center py-2">Disliked</th>
              <th className="text-center py-2">Created At</th>
              <th className="text-center py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.map((el, idx) => (
              <tr className="border-b" key={el._id}>
                <td className="text-center py-2">
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    idx +
                    1}
                </td>
                <td className="text-center">{el.title}</td>
                <td className="text-center">{el.hashtags}</td>
                <td className="text-center">{el.numberViews}</td>
                <td className="text-center">{el.likes?.length}</td>
                <td className="text-center">{el.dislikes?.length}</td>
                <td className="text-center">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="text-center py-2">
                  <span
                    onClick={() =>
                      dispatch(
                        showModal({
                          isShowModal: true,
                          modalChildren: <UpdateBlog {...el} />,
                        })
                      )
                    }
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                  >
                    <BiEdit size={20} />
                  </span>
                  <span
                    onClick={() => handleDeleteBolg(el.id)}
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                  >
                    <RiDeleteBin6Line size={20} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full px-4 flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  )
}

export default withBaseComponent(ManageBlog)
