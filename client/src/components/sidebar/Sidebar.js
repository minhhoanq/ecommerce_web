import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { createSlug } from "ultils/helpers";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const { categories } = useSelector((state) => state.app);
    return (
        <div className="hidden md:flex flex-col border">
            {categories?.map((el) => (
                <NavLink
                    key={createSlug(el.name)}
                    to={createSlug(el.name)}
                    className={({ isActive }) =>
                        isActive
                            ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
                            : "px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
                    }
                >
                    {el.name}
                </NavLink>
            ))}
        </div>
    );
};

export default memo(Sidebar);
