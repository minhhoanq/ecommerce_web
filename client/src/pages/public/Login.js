import React, { useState, useCallback, useEffect } from "react";
import { InputField, Button, Loading } from "components";
import {
    apiSignup,
    apiSignin,
    apiForgotPassword,
    apiFinalSignup,
    getCartItems,
} from "apis/user";
import Swal from "sweetalert2";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import path from "ultils/path";
import { login } from "store/user/userSlice";
import { showModal } from "store/app/appSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "ultils/helpers";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        username: "",
    });
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const resetPayload = () => {
        setPayload({
            email: "minhhoanglost@gmail.com",
            password: "123456789",
            firstName: "",
            lastName: "",
            username: "",
        });
    };
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email });
        if (response.success) {
            toast.success(response.mes, { theme: "colored" });
        } else toast.info(response.mes, { theme: "colored" });
    };
    useEffect(() => {
        resetPayload();
    }, [isRegister]);
    // SUBMIT
    const handleSubmit = useCallback(async () => {
        const { firstName, lastName, username, ...data } = payload;

        const invalids = isRegister
            ? validate(payload, setInvalidFields)
            : validate(data, setInvalidFields);
        if (invalids === 0) {
            if (isRegister) {
                dispatch(
                    showModal({ isShowModal: true, modalChildren: <Loading /> })
                );
                const response = await apiSignup(payload);
                dispatch(
                    showModal({ isShowModal: false, modalChildren: null })
                );
                if (response.status === 200) {
                    setIsVerifiedEmail(true);
                } else Swal.fire("Oops!", response.mes, "error");
            } else {
                const rs = await apiSignin(data);
                if (rs.status === 200) {
                    dispatch(
                        login({
                            isLoggedIn: true,
                            token: rs.metadata.tokens.accessToken,
                            userData: rs.metadata.user,
                        })
                    );
                    searchParams.get("redirect")
                        ? navigate(searchParams.get("redirect"))
                        : navigate(`/${path.HOME}`);
                } else Swal.fire("Oops!", rs.mes, "error");
            }
        }
    }, [payload, isRegister]);

    const finalRegister = async () => {
        const response = await apiFinalSignup(token);
        if (response.status === 201) {
            Swal.fire("Congratulation", response.mes, "success").then(() => {
                setIsRegister(false);
                resetPayload();
            });
        } else Swal.fire("Oops!", response.mes, "error");
        setIsVerifiedEmail(false);
        setToken("");
    };

    return (
        <div className="w-screen h-screen relative">
            {isVerifiedEmail && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center">
                    <div className="bg-white w-[90%] max-w-[500px] rounded-md p-8">
                        <h4 className="mb-4">
                            Chúng tôi đã gửi mã xác nhận cho bạn, vui lòng kiểm
                            tra email và nhập mã tại đây:
                        </h4>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="p-2 border rounded-md outline-none"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 mt-4 mx-auto bg-blue-500 font-semibold text-white rounded-md ml-4"
                            onClick={finalRegister}
                        >
                            XÁC NHẬN
                        </button>
                    </div>
                </div>
            )}
            {isForgotPassword && (
                <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center px-4 py-8 z-50">
                    <div className="flex w-full flex-col gap-4">
                        <label htmlFor="email">Email của bạn:</label>
                        <input
                            type="text"
                            id="email"
                            className="md:w-[800px] w-full pb-2 border-b outline-none placeholder:text-sm"
                            placeholder="Exp: email@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="flex items-center justify-end w-full gap-4">
                            <Button
                                name="Submit"
                                handleOnClick={handleForgotPassword}
                                style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2"
                            >
                                XÁC NHẬN
                            </Button>
                            <Button
                                name="Back"
                                handleOnClick={() => setIsForgotPassword(false)}
                            >
                                TRỞ VỀ
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <img
                src="https://img.freepik.com/premium-photo/shopping-cart-card-icon-discounts_116441-26066.jpg"
                alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center flex">
                <div className="p-8 bg-white flex flex-col items-center rounded-md md:min-w-[500px]">
                    <h1 className="text-[28px] font-semibold text-main mb-8">
                        {isRegister ? "TẠO TÀI KHOẢN" : "ĐĂNG NHẬP"}
                    </h1>
                    {isRegister && (
                        <InputField
                            value={payload.username}
                            setValue={setPayload}
                            nameKey="username"
                            invalidFields={invalidFields}
                            setInvalidFieds={setInvalidFields}
                            fullWidth
                        />
                    )}
                    {isRegister && (
                        <div className="flex items-center gap-2">
                            <InputField
                                value={payload.firstName}
                                setValue={setPayload}
                                nameKey="firstName"
                                invalidFields={invalidFields}
                                setInvalidFieds={setInvalidFields}
                            />
                            <InputField
                                value={payload.lastName}
                                setValue={setPayload}
                                nameKey="lastName"
                                invalidFields={invalidFields}
                                setInvalidFieds={setInvalidFields}
                            />
                        </div>
                    )}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                        invalidFields={invalidFields}
                        setInvalidFieds={setInvalidFields}
                        fullWidth
                    />

                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey="password"
                        type="password"
                        invalidFields={invalidFields}
                        setInvalidFieds={setInvalidFields}
                        fullWidth
                    />
                    <Button handleOnClick={handleSubmit} fw>
                        {isRegister ? "TẠO TÀI KHOẢN" : "ĐĂNG NHẬP"}
                    </Button>
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && (
                            <span
                                onClick={() => setIsForgotPassword(true)}
                                className="text-blue-500 hover:underline cursor-pointer"
                            >
                                Quên mật khẩu?
                            </span>
                        )}
                        {!isRegister && (
                            <span
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => setIsRegister(true)}
                            >
                                Tạo tài khoản
                            </span>
                        )}
                        {isRegister && (
                            <span
                                className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                                onClick={() => setIsRegister(false)}
                            >
                                Đi tới đăng nhập
                            </span>
                        )}
                    </div>
                    <Link
                        className="text-blue-500 text-sm hover:underline cursor-pointer"
                        to={`/${path.HOME}`}
                    >
                        Về trang chủ?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
