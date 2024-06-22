import React, { memo } from "react"
import { Editor } from "@tinymce/tinymce-react"

const MdEditor = ({
  label,
  value,
  id,
  errors,
  register,
  validate,
  placeholder,
  height = 500,
  setValue,
}) => {
  return (
    <div className="flex flex-col ">
      <span className="pb-2 font-semibold">{label + ":"}</span>
      <Editor
        apiKey="x966ukewe6wwp2dli2u8f41xmjei8omxtk49m356em9qoizc"
        initialValue={value}
        // value={value}
        init={{
          height: height,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        {...register(id, validate)}
        onChange={(e) => setValue(id, e.target.getContent())}
      />
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  )
}

export default memo(MdEditor)
