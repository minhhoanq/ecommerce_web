import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "ultils/path";
import { useDispatch, useSelector } from "react-redux";
import { MemberSidebar } from "components";
import { getCartItems } from "apis";
import { updateCart } from "store/user/userSlice";

const MemberLayout = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, current } = useSelector((state) => state.user);
    useEffect(() => {
        (async () => {
            const carts = await getCartItems();
            console.log(carts);
            dispatch(updateCart(carts));
        })();
    }, []);
    if (!isLoggedIn || !current)
        return <Navigate to={`/${path.LOGIN}`} replace={true} />;

    return (
        <div className="flex">
            <MemberSidebar />
            <div className="flex-auto bg-gray-100 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default MemberLayout;
