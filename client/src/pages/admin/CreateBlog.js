import { apiCreateNewBlog } from "apis/blog"
import { Button, InputFile, InputForm, MdEditor } from "components"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

const CreateBlog = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const handlePublish = async ({ image, ...data }) => {
    const payload = new FormData()
    for (let i of Object.entries(data)) payload.append(i[0], i[1])
    payload.append("image", image[0])
    setIsLoading(true)
    const response = await apiCreateNewBlog(payload)
    setIsLoading(false)
    if (response.success) {
      setValue("title", "")
      setValue("description", "")
      setValue("hashtags", "")
      setValue("image", "")
      toast.success(response.mes)
    } else toast.error(response.mes)
  }
  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-50 justify-between flex items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Create Blog</h1>
      </div>
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
          value={watch("description")}
        />
        <div>
          <InputFile
            register={register}
            errors={errors}
            id="image"
            validate={{ required: "This field cannot empty." }}
            label="Ảnh đại diện:"
          />
        </div>
        <div className="my-6">
          <Button
            disabled={isLoading}
            handleOnClick={handleSubmit(handlePublish)}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateBlog
