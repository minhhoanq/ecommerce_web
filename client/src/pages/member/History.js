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
import { showFeedback, showModal } from "store/app/appSlice";
import { useDispatch, useSelector } from "react-redux";
import InputFeedback from "components/common/InputFeedback";
import { Stepper } from "react-form-stepper";

const History = ({ navigate, location }) => {
    const [orders, setOrders] = useState([]);
    const [counts, setCounts] = useState(0);
    const [showOrderDetail, setShowOrderDetail] = useState({
        open: false,
        orderId: 0,
    });
    const { isShowFeedback } = useSelector((state) => state.app);
    const dispatch = useDispatch();
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
            setCounts(response?.metadata.length);
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

    const showModalFeedback = (item) => {
        dispatch(showFeedback({ item }));
    };

    const handleExportPDFFile = (id) => {
        const pdfUrl = `http://localhost:3000/pdf?orderId=${id}`;
        window.open(pdfUrl, "_blank");
    };

    return (
        <div className="w-full relative px-4">
            <header className="text-xl font-semibold py-4 border-b border-b-blue-200">
                <h3 className="uppercase">Đơn đã mua</h3>
            </header>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%] grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder="Tìm kiểm theo trạng thái,..."
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
                    <tr className="border bg-gray-200 text-sm text-gray-400">
                        <th className="text-center py-2">STT</th>
                        <th className="text-center py-2">TỔNG</th>
                        <th className="text-center py-2">TRẠNG THÁi</th>
                        <th className="text-center py-2">NGÀY TẠO</th>
                        <th className="text-center py-2"></th>
                        <th className="text-center py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((el, idx) => (
                        <React.Fragment key={el.orderId}>
                            <tr className="border-b text-sm">
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1
                                        ? (+params.get("page") - 1) *
                                          process.env.REACT_APP_LIMIT
                                        : 0) +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">
                                    {formatMoney(el.total) + " VND"}
                                </td>
                                <td className="text-center py-2">
                                    {el.orderStatusId === 1
                                        ? "Đang xử lí"
                                        : el.orderStatusId === 2
                                        ? "Đã thanh toán"
                                        : el.orderStatusId === 3
                                        ? "Hoàn thành"
                                        : "Đã hủy"}
                                </td>
                                <td className="text-center py-2">
                                    {moment(el.createdAt)?.format("DD/MM/YYYY")}
                                </td>
                                <td
                                    className="text-center flex justify-center py-3 hover:cursor-pointer text-blue-500"
                                    onClick={() =>
                                        handleShowOrderDetail(el.orderId)
                                    }
                                >
                                    {showOrderDetail.open === true &&
                                    showOrderDetail.orderId === el.orderId ? (
                                        <div className="flex justify-center items-center space-x-4">
                                            <span>CHI TIẾT</span>
                                            <IoIosArrowUp color="" />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center space-x-4">
                                            <span>CHI TIẾT</span>
                                            <IoIosArrowDown />
                                        </div>
                                    )}
                                </td>
                                <td
                                    className="text-center py-2 border border-main text-main cursor-pointer hover:bg-red-50"
                                    onClick={() =>
                                        handleExportPDFFile(el.orderId)
                                    }
                                >
                                    Xuất PDF
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
                                    <Stepper
                                        steps={[
                                            { label: "Đang xử lí" },
                                            { label: "Đã thanh toán" },
                                            { label: "Hoàn thành" },
                                        ]}
                                        activeStep={el?.orderStatusId}
                                    />
                                    <div className="p-4 border-t-2">
                                        {el?.orderitems?.map((item) => (
                                            <div
                                                className="flex justify-between my-2"
                                                key={item.id}
                                            >
                                                <div className="w-[200px]">
                                                    <img
                                                        className="h-[70px]"
                                                        src={item?.image}
                                                    />
                                                </div>
                                                <div className="text-left p-2  flex-1">
                                                    <div className="flex-col">
                                                        <span>
                                                            {item.productName}
                                                        </span>
                                                        {item.attributes
                                                            .ram && (
                                                            <p className="text-sm">
                                                                {
                                                                    item
                                                                        .attributes
                                                                        .ram
                                                                }
                                                            </p>
                                                        )}
                                                        {item.attributes
                                                            .inch && (
                                                            <p className="text-sm">
                                                                {
                                                                    item
                                                                        .attributes
                                                                        .inch
                                                                }
                                                            </p>
                                                        )}
                                                        {item.attributes
                                                            .color && (
                                                            <p className="text-sm">
                                                                {
                                                                    item
                                                                        .attributes
                                                                        .color
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-center p-2">
                                                    x {item.quantity}
                                                </div>
                                                <div className="text-right p-2 w-[200px]">
                                                    {formatMoney(item.price) +
                                                        " VND"}
                                                </div>

                                                {el.orderStatusId === 3 && (
                                                    <div className="text-right p-2 flex justify-center items-center">
                                                        <button
                                                            onClick={() =>
                                                                showModalFeedback(
                                                                    item
                                                                )
                                                            }
                                                            className="border h-[35px] w-[100px] border-main text-main hover:bg-red-50"
                                                        >
                                                            Đánh giá
                                                        </button>
                                                    </div>
                                                )}
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
