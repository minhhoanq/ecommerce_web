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

    console.log(orderId);

    useEffect(() => {
        (async () => {
            const orderDetail = await apiGetOrder(orderId);
            console.log(orderDetail);
            setOrder(orderDetail.metadata);
        })();
    }, []);
    return (
        <div className="flex flex-col">
            <TopHeaders />
            <div className="w-full flex flex-col items-center justify-center bg-white pt-4 pb-4">
                <BsCheckCircle size={80} color="#32CD32" />
                <span className="text-xl font-semibold">
                    Order successfully
                </span>
                <p className="text-base">
                    We will contact you soon, thank you!
                </p>
            </div>
            <div className="w-full bg-gray-100 flex justify-center items-center pt-4 pb-4">
                <div className="flex  w-[1000px] gap-6 bg-white h-[400px] shadow-md rounded">
                    <div className="flex-1 mr-10">
                        <div className="w-full max-h-[350px] overflow-y-auto">
                            <table className="table-auto w-full ">
                                <tbody>
                                    {order?.map((el) => (
                                        <tr className="" key={el.id}>
                                            <td className="">
                                                <img
                                                    className="h-[80px]"
                                                    src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png"
                                                />
                                            </td>
                                            <td className="text-left p-2">
                                                <div className="flex-col">
                                                    <span>
                                                        {el.productName}
                                                    </span>
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
                    </div>
                    <div className="w-[350px] flex flex-col justify-between gap-[20px] p-2">
                        <div className="space-y-4 border-b border-solid border-gray-300 pb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-md">
                                    Receiver's information
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-col items-start space-y-2">
                                    <span className="text-sm">
                                        Full name: {order[0]?.username}
                                    </span>
                                    <span className="text-sm">
                                        Phone: 0353727257
                                    </span>
                                    <span className="text-sm">
                                        Address: 9B Trịnh Hoài Đức, Hiệp Phú,
                                        Thủ Đức, HCM
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Payment method:
                                </span>
                                <span className="text-main font-bold">
                                    {order[0]?.paymentMethodId === 1
                                        ? "Cash on delivery"
                                        : "Banking"}
                                </span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">
                                    Transport fee:
                                </span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.checkoutOrder?.feeShip
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Total:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.checkoutOrder?.total
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Discount:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order?.checkoutOrder?.totalDiscount
                                )} VND`}</span>
                            </span>
                            <span className="flex items-center justify-between gap-8 text-sm">
                                <span className="font-medium">Subtotal:</span>
                                <span className="text-main font-bold">{`${formatMoney(
                                    order[0]?.total
                                )} VND`}</span>
                            </span>
                        </div>
                        <div className="flex space-x-2 text-sm justify-end">
                            <NavLink to={"/member/order/history"}>
                                <Button
                                    style={`bg-black px-4 py-2 rounded-none text-white flex items-center justify-center text-semibold my-2 flex-1 hover:bg-main`}
                                >
                                    Order history
                                </Button>
                            </NavLink>

                            <NavLink to={"/"}>
                                <Button>HOME</Button>
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
