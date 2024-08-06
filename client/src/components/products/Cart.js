import Button from "components/buttons/Button";
import withBaseComponent from "hocs/withBaseComponent";
import React, { memo, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { showCart } from "store/app/appSlice";
import { formatMoney } from "ultils/helpers";
import { ImBin } from "react-icons/im";
import { apiRemoveCart, getCartItems } from "apis";
import { getCurrent } from "store/user/asyncActions";
import { toast } from "react-toastify";
import path from "ultils/path";
import { updateCart } from "store/user/userSlice";

const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector((state) => state.user);

    const removeCart = async (id) => {
        const response = await apiRemoveCart(id);
        if (response.status === 200) {
            dispatch(getCurrent());
            const carts = await getCartItems();
            dispatch(updateCart(carts));
        } else toast.error(response.mes);
    };

    // Fix category page
    // Payment method
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-[380px] h-screen bg-[#1c1d1d] grid grid-rows-10 text-white p-6 pt-0"
        >
            <header className="border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold ">
                <span className="text-base font-semibold uppercase">
                    GIỎ HÀNG CỦA TÔI
                </span>
                <span
                    onClick={() => dispatch(showCart())}
                    className="p-2 cursor-pointer"
                >
                    <IoIosClose size={24} />
                </span>
            </header>
            <section className="row-span-7 flex flex-col gap-4 h-full max-h-full overflow-y-auto py-3">
                {!currentCart && (
                    <span className="text-xs italic">
                        Chưa có sản phẩm nào trong giỏ hàng.
                    </span>
                )}
                {currentCart &&
                    currentCart?.map((el) => (
                        <div
                            key={el._id}
                            className="flex justify-between items-center"
                        >
                            <div className="flex gap-2 min-w-[300px]">
                                <img
                                    src={el.image}
                                    alt="thumb"
                                    className="w-20 h-20 object-cover"
                                />
                                <div className="flex flex-col gap-1 w-full justify-between">
                                    <div className="flex flex-col gap-1 w-ful">
                                        <span className="text-sm text-main">
                                            {el.name}
                                        </span>
                                        {el.attributes?.color && (
                                            <span className="text-[10px] font-main">
                                                {el.attributes.color}
                                            </span>
                                        )}
                                        {el.attributes.ram && (
                                            <span className="text-[10px] font-main">
                                                {el.attributes.ram}
                                            </span>
                                        )}
                                        {el.attributes.inch && (
                                            <span className="text-[10px] font-main">
                                                {el.attributes.inch}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            {formatMoney(el.price) + " VND"}
                                        </span>
                                        <span className="text-sm">{`x ${el.quantity}`}</span>
                                    </div>
                                </div>
                            </div>
                            <span
                                onClick={() => removeCart(el?.id)}
                                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer"
                            >
                                <ImBin size={14} />
                            </span>
                        </div>
                    ))}
            </section>
            <div className="row-span-2 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between pt-4 border-t border-gray-500">
                    <span>Tạm tính:</span>
                    <span>
                        {formatMoney(
                            currentCart?.reduce(
                                (sum, el) =>
                                    sum + Number(el.price) * el.quantity,
                                0
                            )
                        ) + " VND"}
                    </span>
                </div>
                <span className="text-center text-gray-700 italic text-xs">
                    Phí vận chuyển, thuế và chiết khấu được tính khi thanh toán.
                </span>
                <Button
                    handleOnClick={() => {
                        dispatch(showCart());
                        navigate(`/${path.DETAIL_CART}`);
                    }}
                    style="rounded-none w-full bg-main py-3"
                >
                    CHI TIẾT GIỎ HÀNG
                </Button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(Cart));
