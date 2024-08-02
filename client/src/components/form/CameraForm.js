import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const { default: InputForm } = require("components/inputs/InputForm");

const attributes = [
    {
        id: 1,
        name: "Color",
        state: "color",
    },
];

const CameraFrom = ({
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
    }, [watch("name"), watch("price"), watch("stock"), watch("color")]);

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
                            {attributes &&
                                attributes.map((el, index) => (
                                    <div
                                        className="flex items-center w-full"
                                        key={index}
                                    >
                                        <input
                                            checked={checkAttributes.color}
                                            onClick={() =>
                                                setAttributesCheck((prev) => ({
                                                    ...prev,
                                                    color: !checkAttributes.color,
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
                                            <span>{el.name}</span>
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
                                                        placeholder="color of new product"
                                                    />
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                ))}
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
                        label="stock"
                        register={register}
                        errors={errors}
                        id="stock"
                        validate={{
                            required: "Need fill this field",
                        }}
                        style="flex-auto"
                        placeholder="stock of new product"
                        type="number"
                    />
                </div>
            </div>
        </form>
    );
};

export default CameraFrom;
