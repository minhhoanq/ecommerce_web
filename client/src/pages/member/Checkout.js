import React, { useEffect, useState } from "react";
import payment from "assets/payment.svg";
import { useSelector } from "react-redux";
import { formatMoney } from "ultils/helpers";
import { Congrat, InputForm, Paypal } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import Swal from "sweetalert2";
import { apiCheckout, apiCreateOrder, apiPayment } from "apis";

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
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
                    <div className="flex-2">
                        <table className="table-auto h-fit w-full">
                            <thead>
                                <tr className="border bg-gray-200">
                                    <th className="p-2 text-left">Products</th>
                                    <th className="p-2 text-left">
                                        attributes
                                    </th>
                                    <th className="text-center p-2">
                                        Quantity
                                    </th>
                                    <th className="text-right p-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewCheckout?.orderItems?.map((el) => (
                                    <tr className="border" key={el._id}>
                                        <td className="text-left p-2">
                                            {el.name}
                                        </td>
                                        <td className="text-left p-2">
                                            {el.attributes.color} |{" "}
                                            {el.attributes.ram}
                                        </td>
                                        <td className="text-center p-2">
                                            {el.quantity}
                                        </td>
                                        <td className="text-right p-2">
                                            {formatMoney(el.salePrice) + " VND"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex-1 flex flex-col justify-between gap-[45px]">
                        <div className="flex flex-col gap-6">
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Fee ship:</span>
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
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Address:</span>
                                <span className="text-main font-bold">
                                    {current?.address | "Address"}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Chọn phương thức thanh toán: </span>
                            <select
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                value={paymentMethod}
                                className="border rounded-md px-4 py-3 flex-auto"
                            >
                                <option value="">Chọn</option>
                                <option value="OFFLINE">
                                    Thanh toán khi nhận hàng
                                </option>
                                <option value="ONLINE">
                                    Thanh toán Paypal
                                </option>
                            </select>
                        </div>
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
                            Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(Checkout);
