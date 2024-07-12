import React, { useEffect, useState } from "react";
import payment from "assets/payment.svg";
import { useSelector } from "react-redux";
import { formatMoney } from "ultils/helpers";
import { Congrat, InputForm, Paypal } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import Swal from "sweetalert2";
import { apiCheckout, apiCreateOrder, apiPayment } from "apis";
import { IoLocationOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { MdOutlineDiscount } from "react-icons/md";

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(1);
    const [reviewCheckout, setReviewCheckout] = useState(null);
    useEffect(() => {
        if (isSuccess) dispatch(getCurrent());
    }, [isSuccess]);
    // useEffect(() => {
    //     if (paymentMethod === "OFFLINE") {
    //         const total = Math.round(
    //             +currentCart?.reduce(
    //                 (sum, el) => +el?.salePrice * el.quantity + sum,
    //                 0
    //             )
    //         );
    //         Swal.fire({
    //             icon: "info",
    //             title: "Thanh toán",
    //             text: `Vui lòng trả bằng tiền mặt số tiền ${formatMoney(
    //                 total
    //             )} VNĐ khi nhận hàng.`,
    //             showConfirmButton: true,
    //             confirmButtonText: "Thanh toán",
    //             showCancelButton: true,
    //             cancelButtonText: "Quay lại",
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 handleSaveOrder();
    //             } else {
    //                 setPaymentMethod("");
    //             }
    //         });
    //     }
    // }, [paymentMethod]);
    useEffect(() => {
        (async () => {
            const data = {
                listItems: currentCart.map((el) => {
                    return {
                        productItemId: el.id,
                        quantity: el.quantity,
                    };
                }),
            };
            console.log(data);
            const checkout = await apiCheckout(data);
            setReviewCheckout(checkout.metadata);
        })();
    }, []);
    const handleSaveOrder = async () => {
        // const payload = {
        //     products: currentCart,
        //     total: Math.round(
        //         +currentCart?.reduce(
        //             (sum, el) => +el?.salePrice * el.quantity + sum,
        //             0
        //         ) / 23500
        //     ),
        //     address: current?.address,
        // };
        // const response = await apiCreateOrder({
        //     ...payload,
        //     status: "Pending",
        // });
        // if (response.success) {
        //     setIsSuccess(true);
        //     setTimeout(() => {
        //         Swal.fire("Congrat!", "Order was created.", "success").then(
        //             () => {
        //                 navigate("/");
        //             }
        //         );
        //     }, 1500);
        // }
        const response = await apiPayment();
        window.location.href = response.vnpUrl;
    };
    return (
        <div className="p-8 w-full  h-full max-h-screen overflow-y-auto gap-6">
            {isSuccess && <Congrat />}
            {/* <div className="w-full flex justify-center items-center col-span-4">
                <img
                    src={payment}
                    alt="payment"
                    className="h-[70%] object-contain"
                />
            </div> */}
            <div className="flex w-full flex-col justify-center col-span-6 gap-6">
                <h2 className="text-3xl mb-6 font-bold">Checkout your order</h2>
                <div className="flex w-full gap-6">
                    <div className="flex-1 mr-10">
                        <div className="w-full max-h-[350px] overflow-y-auto">
                            <table className="table-auto w-full ">
                                <tbody>
                                    {reviewCheckout?.orderItems?.map((el) => (
                                        <tr className="" key={el._id}>
                                            <td className="">
                                                <img
                                                    className="h-[100px]"
                                                    src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png"
                                                />
                                            </td>
                                            <td className="text-left p-2">
                                                <div className="flex-col">
                                                    <span>{el.name}</span>
                                                    <p className="text-sm">
                                                        {el.attributes.color} |{" "}
                                                        {el.attributes.ram}
                                                    </p>
                                                </div>
                                            </td>
                                            {/* <td className="text-left p-2">
                                            {el.attributes.color} |{" "}
                                            {el.attributes.ram}
                                        </td> */}
                                            <td className="text-center p-2">
                                                x {el.quantity}
                                            </td>
                                            <td className="text-right p-2">
                                                {formatMoney(el.salePrice) +
                                                    " VND"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="space-y-6">
                            <div className="space-x-4">
                                <span>Payment method</span>
                                <button
                                    onClick={() => setPaymentMethod(1)}
                                    className={`${
                                        paymentMethod === 1
                                            ? "bg-main text-white hover:bg-red-500"
                                            : "text-red-600 outline outline-1 hover:bg-red-50"
                                    }  rounded-sm text-sm p-2 outline outline-1 hover:bg-red-50`}
                                >
                                    Payment upon delirery
                                </button>
                                <button
                                    onClick={() => setPaymentMethod(2)}
                                    className={`${
                                        paymentMethod === 2
                                            ? "bg-main text-white hover:bg-red-500"
                                            : "text-red-600 outline outline-1 hover:bg-red-50"
                                    }  rounded-sm text-sm p-2 `}
                                >
                                    Banking
                                </button>
                            </div>
                            <div className="text-sm">
                                {paymentMethod === 1 ? (
                                    <span>
                                        Phí thu hộ: ₫0 VNĐ. Ưu đãi về phí vận
                                        chuyển (nếu có) áp dụng cả với phí thu
                                        hộ.
                                    </span>
                                ) : (
                                    <span>
                                        Phí thu hộ: ₫0 VNĐ. Ưu đãi về phí vận
                                        chuyển (nếu có) áp dụng cả với phí thu
                                        hộ.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-[350px] flex flex-col justify-between gap-[30px] ">
                        <div className="space-y-4 border-b border-solid border-gray-300 pb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-md">
                                    HOW TO GET IT
                                </span>
                                <button className="rounded-sm text-sm text-red-600 p-1 outline outline-1 hover:bg-red-50">
                                    CHANGE
                                </button>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between space-x-1">
                                    <IoLocationOutline />
                                    <span>
                                        9B Trịnh Hoài Đức, Hiệp Phú, Thủ Đức,
                                        HCM
                                    </span>
                                </div>
                                <div className="flex items-center justify-between space-x-1">
                                    <BsClock />
                                    <span>08:00 am</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 border-b border-solid border-gray-300 pb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-md">
                                    COUPONS
                                </span>
                                <button className="rounded-sm text-sm text-red-600 p-1 outline outline-1 hover:bg-red-50">
                                    GET
                                </button>
                            </div>
                            <div className="space-x-1 flex items-center border border-solid border-gray-300 rounded-sm pl-2 pr-2">
                                <MdOutlineDiscount />
                                <input
                                    className="h-[40px] outline-none pl-2 flex-1"
                                    placeholder="Add coupons or git cards"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Transport fee:
                                </span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.feeShip
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Total:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.total
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Discount:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.totalDiscount
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Subtotal:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.totalCheckout
                                )} VND`}</span>
                            </span>
                            {/* <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Address:</span>
                                <span className="text-main font-bold">
                                    {current?.address | "Address"}
                                </span>
                            </span> */}
                        </div>
                        {/* <div className="flex items-center gap-4 text-sm font-medium">
                            <span>Payment method: </span>
                            <select
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                value={paymentMethod}
                                className="border rounded-sm px-2 py-2 flex-auto outline-none cursor-pointer"
                            >
                                <option value="OFFLINE">
                                    Payment upon delivery
                                </option>
                                <option value="ONLINE">Banking</option>
                            </select>
                        </div> */}
                        {/* {paymentMethod === "ONLINE" && (
                            <div className="w-full mx-auto">
                                <Paypal
                                    payload={{
                                        products: currentCart,
                                        total: Math.round(
                                            +currentCart?.reduce(
                                                (sum, el) =>
                                                    +el?.salePrice *
                                                        el.quantity +
                                                    sum,
                                                0
                                            ) / 23500
                                        ),
                                        address: current?.address,
                                    }}
                                    setIsSuccess={setIsSuccess}
                                    amount={Math.round(
                                        +currentCart?.reduce(
                                            (sum, el) =>
                                                +el?.salePrice * el.quantity +
                                                sum,
                                            0
                                        ) / 23500
                                    )}
                                />
                            </div>
                        )} */}
                        <button
                            className="bg-main h-[40px] rounded text-white"
                            onClick={handleSaveOrder}
                        >
                            ORDER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(Checkout);
