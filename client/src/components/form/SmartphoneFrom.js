import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const { default: InputForm } = require("components/inputs/InputForm");

const attributes = [
    {
        id: 1,
        name: "Color",
    },
    {
        id: 2,
        name: "Storage",
    },
];

const SmartphoneFrom = ({
    index,
    sku,
    onChange,
    setAttributesCheck,
    checkAttributes,
}) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
            storage: "",
            color: "",
        },
    });

    // Create a map for quick lookup
    const attributeMap = attributes.reduce((acc, attribute) => {
        acc[attribute.name.toLowerCase()] = attribute.id;
        return acc;
    }, {});

    // const formValue = watch();

    useEffect(() => {
        const data = {
            name: watch("name"),
            price: watch("price"),
            stock: watch("stock"),
            storage: watch("storage"),
            color: watch("color"),
        };

        const convertedData = {
            name: data.name,
            price: parseInt(data.price, 10), // Convert price to number
            stock: parseInt(data.stock, 10), // Convert stock to number
            attributes: Object.keys(data)
                .filter((key) => attributeMap[key.toLowerCase()])
                .map((key) => ({
                    attributeId: attributeMap[key.toLowerCase()],
                    attributeValue: data[key],
                })),
        };

        onChange(index, convertedData);
    }, [
        watch("name"),
        watch("price"),
        watch("stock"),
        watch("storage"),
        watch("color"),
    ]);

    return (
        <form className="max-h-max">
            <InputForm
                label="Tên sản phẩm kèm thuộc tính"
                register={register}
                errors={errors}
                id="name"
                validate={{
                    required: "Không để trống",
                }}
                fullWidth
                placeholder="VÍ dụ: Macbook 256GB"
            />
            <div className="w-full my-6 flex gap-4">
                <div className={"flex flex-col w-[450px] gap-2"}>
                    <div className="flex flex-col items-start space-y-2 min-h-[170px]">
                        <label className="font-medium">
                            {"Thuộc tính" + ":"}
                        </label>
                        <div className="flex flex-col justify-center items-start space-y-4 w-full">
                            <div className="flex items-center w-full">
                                <input
                                    checked={checkAttributes.storage}
                                    onClick={() =>
                                        setAttributesCheck((prev) => ({
                                            ...prev,
                                            storage: !checkAttributes.storage,
                                        }))
                                    }
                                    id="checkbox-default"
                                    type="checkbox"
                                    value=""
                                    className="w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                                />
                                <label
                                    // for="checkbox-default"
                                    className="flex items-center space-x-2 flex-1 justify-between text-sm font-norma cursor-pointer text-gray-600"
                                >
                                    <span>Bộ nhớ trong</span>
                                    {checkAttributes.storage && (
                                        <div className="w-[300px]">
                                            <InputForm
                                                // label="Stogare"
                                                register={register}
                                                errors={errors}
                                                id="storage"
                                                validate={{
                                                    required: "Không để trống",
                                                }}
                                                style="flex-auto"
                                                placeholder="12GB - 256GB"
                                            />
                                        </div>
                                    )}
                                </label>
                            </div>
                            <div className="flex items-center w-full">
                                <input
                                    checked={checkAttributes.color}
                                    onClick={() =>
                                        setAttributesCheck((prev) => ({
                                            ...prev,
                                            color: !checkAttributes.color,
                                        }))
                                    }
                                    id="checked-checkbox"
                                    type="checkbox"
                                    value=""
                                    className="w-5 h-5 appearance-none cursor-pointer border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                                />
                                <label
                                    for="checked-checkbox"
                                    className="flex items-center space-x-2 flex-1 justify-between text-sm font-normal cursor-pointer text-gray-600"
                                >
                                    <span>Màu</span>
                                    {checkAttributes.color && (
                                        <div className="w-[300px]">
                                            <InputForm
                                                // label="Stogare"
                                                register={register}
                                                errors={errors}
                                                id="color"
                                                validate={{
                                                    required:
                                                        "Need fill this field",
                                                }}
                                                style="flex-auto"
                                                placeholder="Đen"
                                            />
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 space-y-4 h-[78px]">
                    <InputForm
                        label="Giá"
                        register={register}
                        errors={errors}
                        id="price"
                        validate={{
                            required: "Không để trống",
                        }}
                        style="flex-auto"
                        placeholder="12000000"
                        type="number"
                    />
                    <InputForm
                        label="Số lượng"
                        register={register}
                        errors={errors}
                        id="stock"
                        validate={{
                            required: "Không để trống",
                        }}
                        style="flex-auto"
                        placeholder="10"
                        type="number"
                    />
                </div>
            </div>
        </form>
    );
};

export default SmartphoneFrom;
