import {
    apiDeleteOrderByAdmin,
    apiGetOrders,
    addToCart,
    apiUpdateStatus,
} from "apis";
import { Button, InputForm, Pagination } from "components";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCustomize, BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
    createSearchParams,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { formatMoney } from "ultils/helpers";

const ManageOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm();
    const [orders, setOrders] = useState();
    const [counts, setCounts] = useState(0);
    const [update, setUpdate] = useState(false);
    const [editOrder, setEditOrder] = useState();
    const fetchOrders = async (params) => {
        const response = await apiGetOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.status === 200) {
            setCounts(response.metadata.totalOrders);
            setOrders(response.metadata.orders);
        }
    };
    const render = useCallback(() => {
        setUpdate(!update);
    });
    const queryDecounce = useDebounce(watch("q"), 800);
    useEffect(() => {
        if (queryDecounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDecounce }).toString(),
            });
        } else
            navigate({
                pathname: location.pathname,
            });
    }, [queryDecounce]);
    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchOrders(searchParams);
    }, [params, update]);
    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure remove this order",
            icon: "warning",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteOrderByAdmin(id);
                if (response.success) toast.success(response.mes);
                else toast.error(response.mes);
                render();
            }
        });
    };

    const handleUpdate = async () => {
        const response = await apiUpdateStatus({
            userId: editOrder.userId,
            orderId: editOrder.orderId,
            orderStatusId: watch("orderStatusId"),
        });
        if (response.status === 200) {
            toast.success(response.message);
            setUpdate(!update);
            setEditOrder(null);
        } else toast.error(response.message);
    };

    return (
        <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-50 flex items-center fixed top-0">
                <h1 className="text-xl font-bold tracking-tight mt-2">
                    QUẢN LÝ ĐƠN HÀNG
                </h1>
                {editOrder && (
                    <>
                        <Button
                            handleOnClick={handleUpdate}
                            style="bg-blue-500 text-white px-4 py-2 rounded-md mx-6"
                        >
                            CẬP NHẬT
                        </Button>
                        <Button handleOnClick={() => setEditOrder(null)}>
                            HỦY
                        </Button>
                    </>
                )}
            </div>
            {/* <div className="flex justify-end bg-gray-50 items-center px-4">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Search products by title, description,..."
          />
        </form>
      </div> */}
            <div className="px-4 mt-6 w-full">
                <table className="table-auto w-full px-4">
                    <thead>
                        <tr className="border bg-sky-900 text-white border-white">
                            <th className="text-center py-2">#</th>
                            <th className="text-center py-2">NGƯỜI ĐẶT</th>
                            <th className="text-center py-2">SẢN PHẨM</th>
                            <th className="text-center py-2">TỔNG</th>
                            <th className="text-center py-2">TRẠNG THÁI</th>
                            <th className="text-center py-2">NGÀY ĐẶT</th>
                            <th className="text-center py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((el, idx) => (
                            <tr className="border-b" key={el.orderId}>
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1
                                        ? +params.get("page") - 1
                                        : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">
                                    {el.username}
                                </td>
                                <td className="text-center py-2">
                                    <span className="max-w-[350px] flex flex-col gap-2">
                                        {el.products?.map((n, index) => (
                                            <span
                                                key={index}
                                                className="w-full border-b flex items-center gap-2"
                                            >
                                                <img
                                                    src={n.productimage}
                                                    alt=""
                                                    className="w-12 h-12 object-cover border"
                                                />
                                                <span className="flex text-xs flex-col items-start gap-1">
                                                    <h3 className="font-semibold text-red-500">
                                                        {n.productname}
                                                    </h3>
                                                    <span>
                                                        {n.attributes.color}
                                                    </span>
                                                    <div className="flex space-x-4">
                                                        <span>
                                                            {formatMoney(
                                                                n.price
                                                            )}
                                                        </span>
                                                        <span>
                                                            {n.quantity +
                                                                " items"}
                                                        </span>
                                                    </div>
                                                </span>
                                            </span>
                                        ))}
                                    </span>
                                </td>
                                <td className="text-center py-2">
                                    {formatMoney(el.total) + " VND"}
                                </td>
                                <td className="text-center py-2">
                                    {editOrder &&
                                    editOrder?.orderId === el.orderId ? (
                                        <select
                                            {...register("orderStatusId")}
                                            className="form-select"
                                        >
                                            <option value={1}>
                                                Đang xử lí
                                            </option>
                                            <option value={2}>
                                                Đã thanh toán
                                            </option>
                                            <option value={3}>
                                                Hoàn thành
                                            </option>
                                            <option value={4}>Đã hủy</option>
                                        </select>
                                    ) : el.orderStatusId === 1 ? (
                                        "Đang xử lí"
                                    ) : el.orderStatusId === 2 ? (
                                        "Đã thanh toán"
                                    ) : el.orderStatusId === 3 ? (
                                        "Hoàn thành"
                                    ) : (
                                        "Đã hủy"
                                    )}
                                </td>
                                <td className="text-center py-2">
                                    {moment(el.createdAt).format("DD/MM/YYYY")}
                                </td>
                                <td className="text-center py-2">
                                    <span
                                        onClick={() => {
                                            setEditOrder(el);
                                            setValue(
                                                "orderStatusId",
                                                parseInt(el.orderStatusId)
                                            );
                                        }}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                                    >
                                        <BiEdit size={20} />
                                    </span>
                                    {/* <span
                                        onClick={() =>
                                            handleDeleteProduct(el.orderId)
                                        }
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                                    >
                                        <RiDeleteBin6Line size={20} />
                                    </span> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex px-4 justify-end my-8">
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default ManageOrder;
