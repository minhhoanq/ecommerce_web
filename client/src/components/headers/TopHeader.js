import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "ultils/path";
import { getCurrent } from "store/user/asyncActions";
import { useSelector, useDispatch } from "react-redux";
import icons from "ultils/icons";
import { logout, clearMessage } from "store/user/userSlice";
import Swal from "sweetalert2";

const { AiOutlineLogout } = icons;

const TopHeaders = () => {
    const { isLoggedIn, current, mes } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) dispatch(getCurrent());
        }, 300);

        return () => {
            clearTimeout(setTimeoutId);
        };
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (mes)
            Swal.fire("Oops!", mes, "info").then(() => {
                dispatch(clearMessage());
                navigate(`/${path.LOGIN}`);
            });
    }, [mes]);
    return (
        <div className="h-[38px] w-full bg-main flex items-center justify-center">
            <div className="w-main flex items-center justify-between text-xs text-white">
                <span className="hidden md:inline-block">
                    ĐẶT HÀNG TRỰC TUYẾN HOẶC GỌI CHO CHÚNG TÔI (+1800) 000 8808
                </span>
                {isLoggedIn && current ? (
                    <div className=" flex gap-4 w-full md:w-fit text-sm justify-between md:justify-start items-center">
                        {/* <span className="pl-2">{`Welcome, ${current?.lastname} ${current?.firstname}`}</span> */}
                        <span className="pl-2">{`Chào mừng, ${current?.lastName} ${current?.firstName}`}</span>
                        <span
                            onClick={() => dispatch(logout())}
                            className="hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-2"
                        >
                            <AiOutlineLogout size={18} />
                        </span>
                    </div>
                ) : (
                    <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
                        Đăng nhập hoặc Tạo tài khoản
                    </Link>
                )}
            </div>
        </div>
    );
};

export default TopHeaders;
