const InputFile = ({ register, errors, id, label, validate }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold" htmlFor={id}>
        {label}
      </label>
      <input type="file" id={id} {...register(id, validate)} />
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
      {/* {preview && (
        <img src={preview} alt="" className="w-48 object-contain mt-4" />
      )} */}
    </div>
  )
}

export default InputFile
