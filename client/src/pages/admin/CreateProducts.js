import React, { useCallback, useState, useEffect } from "react";
import { InputForm, Select, Button, MarkdownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "ultils/helpers";
import { toast } from "react-toastify";
import { apiCreateProduct } from "apis";
import { showModal } from "store/app/appSlice";
import { IoImagesOutline } from "react-icons/io5";

const CreateProducts = () => {
    const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();

    const [payload, setPayload] = useState({
        description: "",
    });
    const [preview, setPreview] = useState({
        thumb: null,
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
    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    };
    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                toast.warning("File not supported!");
                return;
            }
            const base64 = await getBase64(file);
            imagesPreview.push({ name: file.name, path: base64 });
        }
        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };
    useEffect(() => {
        handlePreviewThumb(watch("thumb")[0]);
    }, [watch("thumb")]);
    useEffect(() => {
        handlePreviewImages(watch("images"));
    }, [watch("images")]);

    const handleCreateProduct = async (data) => {
        console.log("create data product: ", data);
        const payload = {
            name: data.title,
            desc: "data.description",
            // categoryId: data.category,
            // brandId: data.brand,
            categoryBrandId: 2,
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/p/h/photo_2022-09-28_21-58-51_5.jpg",
            images: [
                "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2022-09-28_21-58-54_5.jpg",
                "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2022-09-28_21-58-57_6.jpg",
                "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2022-09-28_21-58-48_5.jpg",
            ],
            skus: [
                {
                    name: data.name,
                    price: data.price,
                    stock: data.quantity,
                    attributes: [
                        {
                            attributeId: 1,
                            attributeValue: data.color,
                        },
                        {
                            attributeId: 2,
                            attributeValue: data.storage,
                        },
                    ],
                },
            ],
        };

        console.log(payload);
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
                        name="description"
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
                                {preview.thumb ? (
                                    <div className="my-4">
                                        <img
                                            src={preview.thumb}
                                            alt="thumbnail"
                                            className="w-[150px] h-[150px] object-cover"
                                        />
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
                                {preview.images.length > 0 ? (
                                    <div className="my-4 flex w-full gap-3 flex-wrap">
                                        {preview.images?.map((el, idx) => (
                                            <div
                                                key={idx}
                                                className="w-fit relative"
                                            >
                                                <img
                                                    src={el.path}
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

                    <InputForm
                        label="Product name with attributes (Ex: Macbook 256GB)"
                        register={register}
                        errors={errors}
                        id="name"
                        validate={{
                            required: "Need fill this field",
                        }}
                        fullWidth
                        placeholder="Name of new product"
                    />
                    <div className="w-full my-6 flex gap-4">
                        <div className={"flex flex-col w-[600px] gap-2"}>
                            <div className="flex items-center space-x-2">
                                <label className="font-medium">
                                    {"Attributes" + ":"}
                                </label>
                                <div className="flex justify-center items-center space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-default"
                                            type="checkbox"
                                            value=""
                                            className="w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                                        />
                                        <label
                                            for="checkbox-default"
                                            className="text-sm font-norma cursor-pointer text-gray-600"
                                        >
                                            Storage
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="checked-checkbox"
                                            type="checkbox"
                                            value=""
                                            className="w-5 h-5 appearance-none cursor-pointer border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                                        />
                                        <label
                                            for="checked-checkbox"
                                            className="text-sm font-normal cursor-pointer text-gray-600"
                                        >
                                            Color
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <InputForm
                                    label="Stogare"
                                    register={register}
                                    errors={errors}
                                    id="storage"
                                    validate={{
                                        required: "Need fill this field",
                                    }}
                                    style="flex-auto"
                                    placeholder="Storage of new product"
                                />
                                <InputForm
                                    label="Color"
                                    register={register}
                                    errors={errors}
                                    id="color"
                                    validate={{
                                        required: "Need fill this field",
                                    }}
                                    style="flex-auto"
                                    placeholder="Color of new product"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 space-y-4 h-[78px]">
                            <InputForm
                                label="Price"
                                register={register}
                                errors={errors}
                                id="price"
                                validate={{
                                    required: "Need fill this field",
                                }}
                                style="flex-auto"
                                placeholder="Price of new product"
                                type="number"
                            />
                            <InputForm
                                label="Quantity"
                                register={register}
                                errors={errors}
                                id="quantity"
                                validate={{
                                    required: "Need fill this field",
                                }}
                                style="flex-auto"
                                placeholder="Quantity of new product"
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="my-6">
                        <Button type="submit">Create new product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProducts;
