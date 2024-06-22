import { apiUpdateBlog } from "apis/blog"
import { Button, InputFile, InputForm, MdEditor } from "components"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { showModal } from "store/app/appSlice"

const UpdateBlog = ({ title, description, image: imageLink, hashtags, id }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
  } = useForm()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    reset({
      title,
      description,
      hashtags,
    })
  }, [title])
  const handleUpdate = async ({ image, ...data }) => {
    const payload = new FormData()
    for (let i of Object.entries(data)) payload.append(i[0], i[1])
    if (image instanceof FileList && image.length > 0)
      payload.append("image", image[0])
    else delete payload.image

    setIsLoading(true)
    const response = await apiUpdateBlog(payload, id)
    setIsLoading(false)
    if (response.success) {
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
      toast.success(response.mes)
    } else toast.error(response.mes)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-[90%] max-h-screen h-full overflow-y-auto p-4"
    >
      <h1 className="text-3xl w-full font-bold border-b pb-3 tracking-tight">
        Update Blog <span className="text-main">{title}</span>
      </h1>
      <div className="mt-4">
        <div className="px-4 flex flex-col gap-4">
          <InputForm
            id="title"
            errors={errors}
            validate={{ required: "This field cannot empty." }}
            register={register}
            label="Tựa đề"
            placeholder="Nhập tựa đề bài viết"
          />
          <InputForm
            id="hashtags"
            errors={errors}
            validate={{ required: "This field cannot empty." }}
            register={register}
            label="Tags"
            placeholder="Mỗi tag cách nhau dấu phẩy"
          />
          <MdEditor
            id="description"
            errors={errors}
            validate={{ required: "This field cannot empty." }}
            register={register}
            label="Nội dung bài viết"
            height={800}
            setValue={setValue}
            value={getValues("description")}
          />
          <div>
            <InputFile
              register={register}
              errors={errors}
              id="image"
              label="Ảnh đại diện:"
            />
            {imageLink && !watch("image") && (
              <img src={imageLink} alt="" className="w-48 object-contain" />
            )}
          </div>
          <div className="my-6">
            <Button
              disabled={isLoading}
              handleOnClick={handleSubmit(handleUpdate)}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateBlog
