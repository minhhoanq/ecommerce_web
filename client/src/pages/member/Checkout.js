import React, { useEffect, useState } from "react";
import payment from "assets/payment.svg";
import { useSelector } from "react-redux";
import { formatMoney } from "ultils/helpers";
import { Breadcrumb, Congrat, InputForm, Paypal } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import Swal from "sweetalert2";
import { apiCheckout, apiCreateOrder, apiCreatePayment, apiOrder } from "apis";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineDiscount } from "react-icons/md";
import { createSearchParams, useLocation } from "react-router-dom";
import path from "ultils/path";

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(1);
    const [reviewCheckout, setReviewCheckout] = useState(null);
    const location = useLocation();

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
                listItems: currentCart?.map((el) => {
                    return {
                        productItemId: el.id,
                        quantity: el.quantity,
                    };
                }),
            };
            const checkout = await apiCheckout(data);
            setReviewCheckout(checkout.metadata);
        })();
    }, []);

    const changeInfoReceive = () => {
        navigate({
            pathname: `/member/${path.PERSONAL}`,
            search: createSearchParams({
                redirect: location.pathname,
            }).toString(),
        });
    };

    const handleSaveOrder = async () => {
        if (current.address === null || current.phone === null) {
            return Swal.fire({
                name: "Kiểm tra lại thông tin",
                text: "Hãy cung cấp địa chỉ giao hàng và số điện thoại!",
                icon: "info",
                cancelButtonText: "Hủy bỏ",
                showCancelButton: true,
                confirmButtonText: "Tiến hành cập nhật!",
            }).then(async (rs) => {
                if (rs.isConfirmed)
                    navigate({
                        pathname: `/member/${path.PERSONAL}`,
                        search: createSearchParams({
                            redirect: location.pathname,
                        }).toString(),
                    });
            });
        }
        //Banking
        if (paymentMethod === 2) {
            const payload = {
                listItems: reviewCheckout?.orderItems.map((el) => {
                    return {
                        productItemId: el.id,
                        quantity: el.quantity,
                    };
                }),
            };
            const response = await apiCreatePayment(payload);
            if (response.status === "error") {
                return Swal.fire({
                    name: "Kiểm tra lại thông tin",
                    text: "Sản phẩm đã có thay đổi về giá hoặc số lượng, vui lòng quay lại chi tiết các sản phẩm để cập nhật lại!",
                    icon: "warning",
                    confirmButtonText: "Đồng ý!",
                });
            }
            window.location.href = response.metadata.url;
        }
        if (paymentMethod === 1) {
            const data = {
                paymentMethodId: 1,
                listItems: reviewCheckout?.orderItems.map((el) => {
                    return {
                        productItemId: el.id,
                        quantity: el.quantity,
                    };
                }),
            };
            const order = await apiOrder(data);
            if (order.status === 201)
                window.location = order.metadata.urlResult;
            if (order.status === "error") {
                return Swal.fire({
                    name: "Kiểm tra lại thông tin",
                    text: "Sản phẩm đã có thay đổi về giá hoặc số lượng, vui lòng quay lại chi tiết các sản phẩm để cập nhật lại!",
                    icon: "info",
                    confirmButtonText: "Đồng ý!",
                });
            }
        }
        //Payment upon delivery
    };
    return (
        <div className="w-full h-full max-h-screen overflow-y-auto gap-6">
            {isSuccess && <Congrat />}
            {/* <div className="w-full flex justify-center items-center col-span-4">
                <img
                    src={payment}
                    alt="payment"
                    className="h-[70%] object-contain"
                />
            </div> */}
            <div className="flex w-full flex-col justify-center items-center col-span-6 gap-6 mb-12 ">
                <div className="h-[81px] w-full flex justify-center items-center  bg-gray-100">
                    <div className="lg:w-main w-screen px-4 lg:px-0">
                        <h3 className="font-semibold uppercase">Thanh toán</h3>
                        <Breadcrumb
                            category={location?.pathname
                                ?.replace("/", "")
                                ?.split("-")
                                ?.join(" ")}
                        />
                    </div>
                </div>
                <div className="flex lg:w-main gap-6">
                    <div className="flex-1 mr-10">
                        <div className="w-full max-h-[350px] overflow-y-auto">
                            <table className="table-auto w-full ">
                                <tbody>
                                    {reviewCheckout?.orderItems?.map((el) => (
                                        <tr className="" key={el._id}>
                                            <td className="">
                                                <img
                                                    className="h-[100px]"
                                                    src={el.image}
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
                                                {formatMoney(el.price) + " VND"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="space-y-6">
                            <div className="space-x-4">
                                <span>Phương thức thanh toán</span>
                                <button
                                    onClick={() => setPaymentMethod(1)}
                                    className={`${
                                        paymentMethod === 1
                                            ? "bg-main text-white hover:bg-red-500"
                                            : "text-red-600 outline outline-1 hover:bg-red-50"
                                    }  text-sm p-2 outline outline-1 hover:bg-red-50`}
                                >
                                    Thanh toán khi nhận hàng
                                </button>
                                <button
                                    onClick={() => setPaymentMethod(2)}
                                    className={`${
                                        paymentMethod === 2
                                            ? "bg-main text-white hover:bg-red-500"
                                            : "text-red-600 outline outline-1 hover:bg-red-50"
                                    }   text-sm p-2 `}
                                >
                                    Thẻ tín dụng/Ghi nợ
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
                                    <span>Chuyển khoản.</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-[350px] flex flex-col justify-between gap-[30px] ">
                        <div className="space-y-4 border-b border-solid border-gray-300 pb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm uppercase">
                                    Thông tin nhận hàng
                                </span>
                                <button
                                    onClick={changeInfoReceive}
                                    className="rounded-sm text-sm text-red-600 p-1 outline outline-1 uppercase hover:bg-red-50"
                                >
                                    Thay đổi
                                </button>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between space-x-1">
                                    <IoLocationOutline />
                                    <span>
                                        {current?.address
                                            ? current.address
                                            : "Chưa có địa chỉ cụ thể"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between space-x-1">
                                    <FaPhoneAlt />
                                    <span>
                                        {current?.phone
                                            ? current.phone
                                            : "Vui lòng cập nhật"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 border-b border-solid border-gray-300 pb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm uppercase">
                                    Phiếu giảm giá
                                </span>
                                <button className="rounded-sm uppercase text-sm text-red-600 p-1 outline outline-1 hover:bg-red-50">
                                    Nhận
                                </button>
                            </div>
                            <div className="space-x-1 flex items-center border border-solid border-gray-300 rounded-sm pl-2 pr-2">
                                <MdOutlineDiscount />
                                <input
                                    className="h-[40px] outline-none pl-2 flex-1"
                                    placeholder="Thêm thẻ giảm giá hoặc thẻ quà tặng"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Phí vận chuyển:
                                </span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.feeShip
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Tổng tiền hàng:
                                </span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.total
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Giảm giá:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.totalDiscount
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Thanh toán:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    reviewCheckout?.checkoutOrder?.totalCheckout
                                )} VND`}</span>
                            </span>
                        </div>
                        <button
                            className="bg-main h-[40px] text-white uppercase"
                            onClick={handleSaveOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(Checkout);
