import { apiCheckout, apiGetOrder } from "apis";
import { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { useSelector } from "react-redux";
import { formatMoney } from "ultils/helpers";
import { IoLocationOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { MdOutlineDiscount } from "react-icons/md";
import { Button, Footer } from "components";
import TopHeaders from "components/headers/TopHeader";
import { NavLink, useParams, useSearchParams } from "react-router-dom";

const OrderResult = () => {
    const { current } = useSelector((state) => state.user);
    const [order, setOrder] = useState([]);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        (async () => {
            const orderDetail = await apiGetOrder(orderId);
            setOrder(orderDetail.metadata[0]);
        })();
    }, []);
    return (
        <div className="flex flex-col">
            <TopHeaders />
            <div className="w-full flex flex-col items-center justify-center bg-white pt-4 pb-4">
                <BsCheckCircle size={80} color="#32CD32" />
                <span className="text-xl font-semibold">
                    Đặt hàng thành công
                </span>
                <p className="text-base">
                    Chúng tôi sẽ liên hệ với bạn sớm nhất, cảm ơn đã mua hàng!
                </p>
            </div>
            <div className="w-full bg-gray-100 flex justify-center items-center pt-4 pb-4">
                <div className="flex  w-[1000px] gap-6 bg-white h-[450px] shadow-md rounded">
                    <div className="flex-1 mr-10">
                        <div className="w-full max-h-[350px] overflow-y-auto">
                            <table className="table-auto w-full ">
                                <tbody>
                                    {order.orderitems?.map((el) => (
                                        <tr className="" key={el.id}>
                                            <td className="">
                                                <img
                                                    className="h-[80px]"
                                                    src={el.image}
                                                />
                                            </td>
                                            <td className="text-left p-2">
                                                <div className="flex-col">
                                                    <span>
                                                        {el.productName}
                                                    </span>
                                                    <p className="text-sm">
                                                        {el.attributes?.color}
                                                    </p>
                                                    <p className="text-sm">
                                                        {el.attributes?.storage}
                                                    </p>
                                                    <p className="text-sm">
                                                        {el.attributes?.ram}
                                                    </p>
                                                    <p className="text-sm">
                                                        {el.attributes?.inch}
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
                    </div>
                    <div className="w-[400px] flex flex-col justify-between gap-[20px] p-2">
                        <div className="space-y-4 border-b border-solid border-gray-300 pb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-md">
                                    Thông tin người nhận
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-col items-start space-y-2">
                                    <span className="text-sm">
                                        Họ và tên: {order?.lastName}{" "}
                                        {order?.firstName}
                                    </span>
                                    <span className="text-sm">
                                        Số điện thoại:{" "}
                                        {order?.phone || "0353727257"}
                                    </span>
                                    <span className="text-sm">
                                        Địa chỉ nhận hàng:{" "}
                                        {order?.address ||
                                            "9B Trịnh Hoài Đức,Hiệp Phú, Thủ Đức, HCM"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Phương thức thanh toán:
                                </span>
                                <span className="text-main font-bold">
                                    {order[0]?.paymentMethodId === 1
                                        ? "Thanh toán khi nhận hàng"
                                        : "Thẻ tín dụng/Ghi nợ"}
                                </span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Phí vận chuyển:
                                </span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.checkoutOrder?.feeShip || 0
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Tiền hàng:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.total
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Giảm giá:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.checkoutOrder?.totalDiscount || 0
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Thanh toán:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.total
                                )} VND`}</span>
                            </span>
                        </div>
                        <div className="flex space-x-2 text-sm justify-end">
                            <NavLink to={"/member/order/history"}>
                                <Button
                                    style={`bg-black px-4 py-2 uppercase rounded-none text-white flex items-center justify-center text-semibold my-2 flex-1 hover:bg-main`}
                                >
                                    LỊCH SỬ MUA HÀNG
                                </Button>
                            </NavLink>

                            <NavLink to={"/"}>
                                <Button>TRANG CHỦ</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderResult;
