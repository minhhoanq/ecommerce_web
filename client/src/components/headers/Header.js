import React, { Fragment, memo, useEffect, useState } from "react";
import logo from "assets/logo.png";
import icons from "ultils/icons";
import { Link } from "react-router-dom";
import path from "ultils/path";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/user/userSlice";
import withBaseComponent from "hocs/withBaseComponent";
import { showCart } from "store/app/appSlice";

const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle } = icons;
const Header = () => {
    const dispatch = useDispatch();
    const { current, currentCart } = useSelector((state) => state.user);
    const [isShowOption, setIsShowOption] = useState(false);
    useEffect(() => {
        const handleClickoutOptions = (e) => {
            const profile = document.getElementById("profile");
            if (!profile?.contains(e.target)) setIsShowOption(false);
        };

        document.addEventListener("click", handleClickoutOptions);

        return () => {
            document.removeEventListener("click", handleClickoutOptions);
        };
    }, []);

    return (
        <div className="md:w-main w-full flex justify-between md:h-[110px] py-[35px]">
            <Link className="w-fit h-fit px-4" to={`/${path.HOME}`}>
                <img
                    src={logo}
                    alt="logo"
                    className="h-[20px] md:w-[234px] md:h-fit object-contain"
                />
            </Link>
            <div className="flex text-[13px]">
                <div className="md:flex hidden flex-col px-6 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <RiPhoneFill color="red" />
                        <span className="font-semibold">(+1800) 000 8808</span>
                    </span>
                    <span>Thứ Hai - Thứ Bảy 9:00 sáng - 8:00 tối</span>
                </div>
                <div className="md:flex hidden flex-col items-center px-6 border-r">
                    <span className="flex gap-4 items-center">
                        <MdEmail color="red" />
                        <span className="font-semibold">
                            MH.TRANMINHHOANG@GMAIL.COM
                        </span>
                    </span>
                    <span>Hỗ trợ trực tuyến 24/7</span>
                </div>
                {current && (
                    <Fragment>
                        <div
                            onClick={() => dispatch(showCart())}
                            className="cursor-pointer flex items-center justify-center gap-2 px-6 border-r"
                        >
                            <span className="relative inline-block">
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white flex items-center justify-center text-[10px] text-main rounded-full border border-main">
                                    {currentCart?.length || 0}
                                </span>
                                <BsHandbagFill size={20} color="red" />
                            </span>
                            {/* <span className="hidden md:inline-block">{`${
                                currentCart?.length || 0
                            } item(s)`}</span> */}
                        </div>
                        <div
                            className="flex cursor-pointer items-center justify-center px-6 gap-2 relative"
                            onClick={() => setIsShowOption((prev) => !prev)}
                            id="profile"
                        >
                            <FaUserCircle size={20} color="red" />
                            {/* <span className="hidden md:inline-block">
                                Tài khoản của tôi
                            </span> */}
                            {isShowOption && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-full flex-col flex right-4 md:left-[16px] bg-gray-100 border md:min-w-[150px] py-2"
                                >
                                    <Link
                                        className="p-2 w-full hover:bg-sky-100"
                                        to={`/${path.MEMBER}/${path.PERSONAL}`}
                                    >
                                        Tài khoản của tôi
                                    </Link>
                                    {+current.roleId === 1 && (
                                        <Link
                                            className="p-2 w-full hover:bg-sky-100"
                                            to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                        >
                                            Quản lí cửa hàng
                                        </Link>
                                    )}
                                    <span
                                        onClick={() => dispatch(logout())}
                                        className="p-2 w-full hover:bg-sky-100"
                                    >
                                        Đăng xuất
                                    </span>
                                </div>
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default Header;
