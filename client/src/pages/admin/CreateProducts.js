import React, { useCallback, useState, useEffect } from "react";
import { InputForm, Select, Button, MarkdownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "ultils/helpers";
import { toast } from "react-toastify";
import { apiCreateProduct } from "apis";
import { showModal } from "store/app/appSlice";
import { IoImagesOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import SmartphoneFrom from "components/form/SmartphoneFrom";
import { uploadImages } from "apis/image";

const CreateProducts = () => {
    const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const [checkAttributes, setCheckAttributes] = useState({
        storage: false,
        color: false,
    });

    const {
        register,
        formState: { errors },
        reset,
        setValue,
        handleSubmit,
        watch,
    } = useForm({
        defaultValues: {
            title: "",
            desc: "",
            thumb: "",
            images: "",
            category: 0,
            brand: 0,
            skus: [],
        },
    });

    const productType = watch("categoryId");

    const handleAddSKU = () => {
        const newSKU = { name: "", price: 0, quantity: 0 };
        // if (productType === 1) {
        newSKU.storage = "";
        newSKU.color = "";
        // } else if (productType === 2) {
        //     newSKU.lens = "";
        // } else if (productType === 3) {
        //     newSKU.inchSize = "";
        // }
        setValue("skus", [...watch("skus"), newSKU]);
    };

    console.log(watch("skus"));

    const [payload, setPayload] = useState({
        description: "",
    });
    const [preview, setPreview] = useState({
        thumb: [],
        images: [],
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );
    const [hoverElm, setHoverElm] = useState(null);
    // const handlePreviewThumb = async (file) => {
    //     const base64Thumb = await getBase64(file);
    //     setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    // };
    const handlePreviewThumb = async () => {
        const formData = new FormData();
        const fileImages = watch("thumb"); // Assuming `watch` returns the list of selected files
        if (fileImages.length > 0) {
            for (let image of fileImages) {
                formData.append("files", image); // Append files to FormData with the key "files"
            }
        }

        const uploadInmage = await uploadImages(formData);
        let imagesArray = uploadInmage.metadata.map((el) => el.url);
        setPreview((prev) => ({
            ...prev,
            thumb: imagesArray,
        }));
    };
    const handlePreviewImages = async () => {
        const formData = new FormData();
        const fileImages = watch("images"); // Assuming `watch` returns the list of selected files
        if (fileImages.length > 0) {
            for (let image of fileImages) {
                formData.append("files", image); // Append files to FormData with the key "files"
            }
        }

        const uploadInmage = await uploadImages(formData);
        let imagesArray = uploadInmage.metadata.map((el) => el.url);
        setPreview((prev) => ({
            ...prev,
            images: imagesArray,
        }));
    };
    useEffect(() => {
        handlePreviewThumb(watch("thumb")[0]);
    }, [watch("thumb")]);
    useEffect(() => {
        handlePreviewImages(watch("images"));
    }, [watch("images")]);

    const handleCreateProduct = async (data) => {
        data.thumb = preview.thumb[0];
        data.images = preview.images;
        data.categoryBrandId = 2;
        console.log("create data product: ", data);
        const response = await apiCreateProduct(data);
        console.log(response);
        // const invalids = validate(payload, setInvalidFields);
        // if (invalids === 0) {
        //     if (data.category)
        //         data.category = categories?.find(
        //             (el) => el._id === data.category
        //         )?.title;
        //     const finalPayload = { ...data, ...payload };
        //     const formData = new FormData();
        //     for (let i of Object.entries(finalPayload))
        //         formData.append(i[0], i[1]);
        //     if (finalPayload.thumb)
        //         formData.append("thumb", finalPayload.thumb[0]);
        //     if (finalPayload.images) {
        //         for (let image of finalPayload.images)
        //             formData.append("images", image);
        //     }
        //     dispatch(
        //         showModal({ isShowModal: true, modalChildren: <Loading /> })
        //     );
        //     const response = await apiCreateProduct(formData);
        //     dispatch(showModal({ isShowModal: false, modalChildren: null }));
        //     if (response.success) {
        //         toast.success(response.mes);
        //         reset();
        //         setPayload({
        //             thumb: "",
        //             image: [],
        //         });
        //     } else toast.error(response.mes);
        // }
    };

    return (
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-xl px-4 font-bold border-b">
                <span>CREATE PRODUCT</span>
            </h1>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputForm
                        label="Product Representative Name (Ex: Macbook)"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Need fill this field",
                        }}
                        fullWidth
                        placeholder="Name of new product"
                    />
                    <div className="w-full my-6 flex gap-4">
                        <Select
                            label="Category"
                            options={categories?.map((el) => ({
                                code: el.id,
                                value: el.name,
                            }))}
                            register={register}
                            id="category"
                            validate={{ required: "Need fill this field" }}
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        />
                        <Select
                            label="Brand"
                            options={categories
                                ?.find((el) => el.id == watch("category"))
                                ?.brands?.map((el) => ({
                                    code: el.id,
                                    value: el.name,
                                }))}
                            register={register}
                            id="brand"
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        />
                    </div>
                    <textarea
                        className="w-full h-[200px] p-2"
                        placeholder="Description"
                        id="desc"
                        {...register("desc")}
                        changeValue={changeValue}
                        label="Description"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <div className="flex space-x-4">
                        <div className="flex flex-col gap-2 mt-2">
                            <label
                                className="font-semibold flex flex-col space-y-2"
                                htmlFor="thumb"
                            >
                                <span>Upload representative image</span>
                                {preview.thumb?.length ? (
                                    preview.thumb?.map((el, index) => (
                                        <div className="my-4" key={index}>
                                            <img
                                                src={el}
                                                alt="thumbnail"
                                                className="w-[150px] h-[150px] object-cover"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-[100px] w-[100px] border-2 border-dashed border-gray-400 flex justify-center items-center">
                                        <IoImagesOutline
                                            size={50}
                                            color="#9ca3af"
                                        />
                                    </div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="thumb"
                                {...register("thumb", {
                                    required: "Need fill",
                                })}
                                hidden
                            />
                            {errors["thumb"] && (
                                <small className="text-xs text-red-500">
                                    {errors["thumb"]?.message}
                                </small>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label
                                className="font-semibold  flex flex-col space-y-2"
                                htmlFor="products"
                            >
                                <span>Upload images</span>
                                {preview.images?.length > 0 ? (
                                    <div className="my-4 flex w-full gap-3 flex-wrap">
                                        {preview.images?.map((el, idx) => (
                                            <div
                                                key={idx}
                                                className="w-fit relative"
                                            >
                                                <img
                                                    src={el}
                                                    alt="product"
                                                    className="w-[150px] h-[150px] object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[100px] w-[100px] border-2 border-dashed border-gray-400 flex justify-center items-center">
                                        <IoImagesOutline
                                            size={50}
                                            color="#9ca3af"
                                        />
                                    </div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="products"
                                multiple
                                {...register("images", {
                                    required: "Need fill",
                                })}
                                hidden
                            />
                            {errors["images"] && (
                                <small className="text-xs text-red-500">
                                    {errors["images"]?.message}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-t-slate-300 my-8"></div>

                    <div
                        className="max-w-max cursor-pointer space-x-2 px-2 py-1 rounded-none text-white flex items-center justify-center "
                        onClick={() => handleAddSKU()}
                    >
                        <CiCirclePlus size={30} color="red" />
                    </div>

                    {watch("skus") &&
                        watch("skus").map((sku, index) => (
                            <SmartphoneFrom
                                setAttributesCheck={(el) =>
                                    setCheckAttributes(el)
                                }
                                checkAttributes={checkAttributes}
                                key={index}
                                sku={sku}
                                index={index}
                                onChange={(idx, data) => {
                                    const updatedSKUs = [...watch("skus")];
                                    updatedSKUs[idx] = data;
                                    setValue("skus", updatedSKUs);
                                }}
                            />
                        ))}
                    <div className="my-6">
                        <Button type="submit">Create new product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProducts;
