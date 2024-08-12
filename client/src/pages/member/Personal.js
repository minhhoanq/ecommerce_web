import { Button, InputForm } from "components";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import avatar from "assets/avatarDefault.png";
import { apiUpdateCurrent } from "apis";
import { getCurrent } from "store/user/asyncActions";
import { toast } from "react-toastify";
import { getBase64 } from "ultils/helpers";
import { useSearchParams } from "react-router-dom";
import withBaseComponent from "hocs/withBaseComponent";
import { uploadImage } from "apis/image";

const Personal = ({ navigate }) => {
    const [preview, setPreview] = useState(null);
    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
        watch,
    } = useForm();
    const { current } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        reset({
            firstName: current?.firstName,
            lastName: current?.lastName,
            phone: current?.phone,
            email: current?.email,
            avatar: current?.avatar,
            address: current?.address,
        });
    }, [current]);

    const handlePreviewThumb = async () => {
        const formData = new FormData();
        const fileImages = watch("avatar"); // Assuming `watch` returns the list of selected files
        formData.append("file", fileImages[0]); // Append files to FormData with the key "files"

        const image = await uploadImage(formData);
        // let imagesArray = uploadInmage.metadata.map((el) => el.url);
        setPreview(image.metadata.url);
    };

    useEffect(() => {
        if (watch("avatar") instanceof FileList && watch("avatar").length > 0)
            handlePreviewThumb();
    }, [watch("avatar")]);

    const handleUpdateInfor = async (data) => {
        if (preview) data.avatar = preview;
        const response = await apiUpdateCurrent(data);
        if (response.status === 200) {
            dispatch(getCurrent());
            toast.success(response.mesage);
            if (searchParams.get("redirect"))
                navigate(searchParams.get("redirect"));
        } else toast.error(response.mes);
    };
    return (
        <div className="w-full relative px-4">
            <header className="text-xl font-semibold py-4 border-b border-b-blue-200">
                <h3 className="uppercase">Hồ sơ cá nhân</h3>
            </header>
            <form
                onSubmit={handleSubmit(handleUpdateInfor)}
                className="w-3/5 mx-auto py-8 flex flex-col gap-4"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="file">
                        <img
                            src={
                                preview ? preview : current?.avatar
                                // "https://png.pngtree.com/png-clipart/20200727/original/pngtree-smartphone-shop-sale-logo-design-png-image_5069958.jpg"
                            }
                            alt="avatar"
                            className="w-20 h-20 ml-8 object-cover rounded-full cursor-pointer"
                        />
                    </label>
                    <input
                        type="file"
                        id="file"
                        {...register("avatar")}
                        hidden
                    />
                </div>
                <div className="flex space-x-4">
                    <InputForm
                        style={"flex-1"}
                        label="Tên"
                        register={register}
                        errors={errors}
                        id="firstName"
                        validate={{
                            required: "Need fill this field",
                        }}
                    />
                    <InputForm
                        style={"flex-1"}
                        label="Họ"
                        register={register}
                        errors={errors}
                        id="lastName"
                        validate={{
                            required: "Need fill this field",
                        }}
                    />
                </div>
                <InputForm
                    label="Địa chỉ email"
                    register={register}
                    errors={errors}
                    disabled={true}
                    id="email"
                    validate={{
                        required: "Need fill this field",
                        pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                            message: "Email invalid.",
                        },
                    }}
                />
                <InputForm
                    label="Số điện thoại"
                    register={register}
                    errors={errors}
                    id="phone"
                    validate={{
                        required: "Need fill this field",
                        pattern: {
                            value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                            message: "Phone invalid.",
                        },
                    }}
                />
                <InputForm
                    label="Địa chỉ"
                    register={register}
                    errors={errors}
                    id="address"
                    validate={{
                        required: "Need fill this field",
                    }}
                />
                <div className="flex items-center gap-2">
                    <span className="font-medium">Trạng thái tài khoản:</span>
                    <span>{current?.isBlocked ? "Bị chặn" : "Hoạt động"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Ngày tạo:</span>
                    <span>{moment(current?.createdAt).fromNow()}</span>
                </div>

                {isDirty && (
                    <div className="w-full flex justify-end">
                        <Button type="submit">Cập nhật thông tin</Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default withBaseComponent(Personal);
