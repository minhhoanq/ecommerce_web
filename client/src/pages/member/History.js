import { apiGetUserOrders } from "apis";
import { CustomSelect, InputForm, Pagination } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { statusOrders } from "ultils/contants";
import { formatMoney } from "ultils/helpers";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const History = ({ navigate, location }) => {
    const [orders, setOrders] = useState([]);
    const [counts, setCounts] = useState(0);
    const [showOrderDetail, setShowOrderDetail] = useState({
        open: false,
        orderId: 0,
    });
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm();
    const q = watch("q");
    const status = watch("status");
    const fetchPOrders = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.status === 200) {
            setOrders(response?.metadata);
            setCounts(response?.metadata?.length);
        }
    };
    useEffect(() => {
        const pr = Object.fromEntries([...params]);
        fetchPOrders(pr);
    }, [params]);

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString(),
        });
    };

    const handleShowOrderDetail = (orderId) => {
        setShowOrderDetail({ open: !showOrderDetail.open, orderId: orderId });
    };

    return (
        <div className="w-full relative px-4">
            <header className="text-xl font-semibold py-4 border-b border-b-blue-200">
                <h3 className="uppercase">History</h3>
            </header>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%] grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder="Search orders by status,..."
                        />
                    </div>
                    <div className="col-span-1 flex items-center">
                        <CustomSelect
                            options={statusOrders}
                            value={status}
                            onChange={(val) => handleSearchStatus(val)}
                            wrapClassname="w-full"
                        />
                    </div>
                </form>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr className="border bg-sky-900 text-white border-white">
                        <th className="text-center py-2">STT</th>
                        <th className="text-center py-2">Total</th>
                        <th className="text-center py-2">Status</th>
                        <th className="text-center py-2">Created At</th>
                        <th className="text-center py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((el, idx) => (
                        <React.Fragment key={el.orderId}>
                            <tr className="border-b">
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1
                                        ? (+params.get("page") - 1) *
                                          process.env.REACT_APP_LIMIT
                                        : 0) +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">
                                    {el.total + " VND"}
                                </td>
                                <td className="text-center py-2">Success</td>
                                <td className="text-center py-2">
                                    {moment(el.createdAt)?.format("DD/MM/YYYY")}
                                </td>
                                <td
                                    className="text-center flex justify-center py-2 hover:cursor-pointer"
                                    onClick={() =>
                                        handleShowOrderDetail(el.orderId)
                                    }
                                >
                                    {showOrderDetail.open === true &&
                                    showOrderDetail.orderId === el.orderId ? (
                                        <IoIosArrowUp />
                                    ) : (
                                        <IoIosArrowDown />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan="5"
                                    className={`${
                                        showOrderDetail.open === true &&
                                        showOrderDetail.orderId === el.orderId
                                            ? ""
                                            : "hidden"
                                    }`}
                                >
                                    <div className="p-4">
                                        {el?.orderitems?.map((item) => (
                                            <div
                                                className="flex justify-between my-2"
                                                key={item.id}
                                            >
                                                <div>
                                                    <img
                                                        className="h-[70px]"
                                                        src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png"
                                                    />
                                                </div>
                                                <div className="text-left p-2">
                                                    <div className="flex-col">
                                                        <span>
                                                            {item.productName}
                                                        </span>
                                                        <p className="text-sm">
                                                            {
                                                                item.attributes
                                                                    ?.color
                                                            }{" "}
                                                            |{" "}
                                                            {
                                                                item.attributes
                                                                    ?.ram
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-center p-2">
                                                    x {item.quantity}
                                                </div>
                                                <div className="text-right p-2">
                                                    {formatMoney(item.price) +
                                                        " VND"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-end my-8">
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default withBaseComponent(History);
