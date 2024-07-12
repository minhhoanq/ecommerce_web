import Button from "components/buttons/Button";
import withBaseComponent from "hocs/withBaseComponent";
import React, { memo, useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
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
            className="w-[400px] h-screen bg-black grid grid-rows-10 text-white p-6"
        >
            <header className="border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl">
                <span>Your Cart</span>
                <span
                    onClick={() => dispatch(showCart())}
                    className="p-2 cursor-pointer"
                >
                    <AiFillCloseCircle size={24} />
                </span>
            </header>
            <section className="row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3">
                {!currentCart && (
                    <span className="text-xs italic">Your cart is empty.</span>
                )}
                {currentCart &&
                    currentCart?.map((el) => (
                        <div
                            key={el._id}
                            className="flex justify-between items-center"
                        >
                            <div className="flex gap-2 min-w-[300px]">
                                <img
                                    src={
                                        el.thumbnail ||
                                        `https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png`
                                    }
                                    alt="thumb"
                                    className="w-16 h-16 object-cover"
                                />
                                <div className="flex flex-col gap-1 w-full">
                                    <span className="text-sm text-main">
                                        {el.name}
                                    </span>
                                    <span className="text-[10px]">
                                        {el.attributes.color} |{" "}
                                        {el.attributes.ram}
                                    </span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            {formatMoney(el.salePrice) + " VND"}
                                        </span>
                                        <span className="text-sm">{`x ${el.quantity}`}</span>
                                    </div>
                                </div>
                            </div>
                            <span
                                onClick={() => removeCart(el?.id)}
                                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer"
                            >
                                <ImBin size={16} />
                            </span>
                        </div>
                    ))}
            </section>
            <div className="row-span-2 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between pt-4 border-t">
                    <span>Subtotal:</span>
                    <span>
                        {formatMoney(
                            currentCart?.reduce(
                                (sum, el) =>
                                    sum + Number(el.salePrice) * el.quantity,
                                0
                            )
                        ) + " VND"}
                    </span>
                </div>
                <span className="text-center text-gray-700 italic text-xs">
                    Shipping, taxes, and discounts calculated at checkout.
                </span>
                <Button
                    handleOnClick={() => {
                        dispatch(showCart());
                        navigate(`/${path.DETAIL_CART}`);
                    }}
                    style="rounded-none w-full bg-main py-3"
                >
                    Shopping Cart
                </Button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(Cart));
