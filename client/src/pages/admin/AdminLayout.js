import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "ultils/path";
import { useSelector } from "react-redux";
import { AdminSidebar } from "components";

const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    if (!isLoggedIn || !current || +current.roleId !== 1)
        return <Navigate to={`/${path.LOGIN}`} replace={true} />;
    return (
        <div className="flex w-full bg-gray-100 min-h-screen relative text-gray-900">
            <div className="w-[280px] top-0 bottom-0 flex-none fixed">
                <AdminSidebar />
            </div>
            <div className="w-[280px]"></div>
            <div className="flex-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
