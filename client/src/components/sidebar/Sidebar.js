import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { createSlug } from "ultils/helpers";
import { useSelector } from "react-redux";
import { TfiViewListAlt } from "react-icons/tfi";
import { BsPhone } from "react-icons/bs";
import { BsTablet } from "react-icons/bs";
import { IoIosLaptop } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";

const Sidebar = () => {
    const { categories } = useSelector((state) => state.app);

    return (
        <div className="hidden md:flex flex-col border h-[500px]">
            <div className="h-[40px] bg-main text-white flex items-center space-x-2 pl-6">
                <TfiViewListAlt size={20} />
                <span className="font-semibold">TẤT CẢ DANH MỤC</span>
            </div>
            {categories?.map((el) => (
                <NavLink
                    key={createSlug(el.name)}
                    to={`/products/${createSlug(el.name)}`}
                    className={({ isActive }) =>
                        isActive
                            ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main "
                            : "px-5 pt-[15px] pb-[14px] text-sm hover:text-main flex items-center w-full"
                    }
                >
                    {el.id === 1 && <BsPhone size={25} />}
                    {el.id === 2 && <BsTablet size={25} />}
                    {el.id === 3 && <IoIosLaptop size={25} />}
                    {el.id === 4 && <IoCameraOutline size={25} />}
                    {el.id === 5 && <RiComputerLine size={25} />}
                    <span className="ml-2">{el.name}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default memo(Sidebar);
