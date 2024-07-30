import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const { default: InputForm } = require("components/inputs/InputForm");

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
            quantity: 0,
            storage: "",
            color: "",
        },
    });

    // const formValue = watch();

    useEffect(() => {
        onChange(index, {
            name: watch("name"),
            price: watch("price"),
            quantity: watch("quantity"),
            storage: watch("storage"),
            color: watch("color"),
        });
    }, [
        watch("name"),
        watch("price"),
        watch("quantity"),
        watch("storage"),
        watch("color"),
    ]);

    return (
        <form className="max-h-max">
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
                <div className={"flex flex-col w-[450px] gap-2"}>
                    <div className="flex flex-col items-start space-y-2 min-h-[170px]">
                        <label className="font-medium">
                            {"Attributes" + ":"}
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
                                    <span>Storage</span>
                                    {checkAttributes.storage && (
                                        <div className="w-[300px]">
                                            <InputForm
                                                // label="Stogare"
                                                register={register}
                                                errors={errors}
                                                id="storage"
                                                validate={{
                                                    required:
                                                        "Need fill this field",
                                                }}
                                                style="flex-auto"
                                                placeholder="Storage of new product"
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
                                    <span>Color</span>
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
                                                placeholder="Color of new product"
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
        </form>
    );
};

export default SmartphoneFrom;
