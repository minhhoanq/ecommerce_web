import React, { useCallback, useEffect, useState } from "react";
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from "apis/user";
import { roles, blockStatus } from "ultils/contants";
import moment from "moment";
import { InputField, Pagination, InputForm, Select, Button } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import clsx from "clsx";

const ManageUser = () => {
    const [users, setUsers] = useState(null);
    const [queries, setQueries] = useState({
        q: "",
    });
    const [params] = useSearchParams();
    const fetchUsers = async (params) => {
        const response = await apiGetUsers({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.status === 200) setUsers(response.metadata);
    };

    const queriesDebounce = useDebounce(queries.q, 800);

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queriesDebounce) queries.q = queriesDebounce;
        fetchUsers(queries);
    }, [queriesDebounce, params]);

    return (
        <div className={clsx("w-full")}>
            <h1 className="h-[75px] flex justify-between items-center text-xl font-bold px-4 border-b">
                <span>Quản lí người dùng</span>
            </h1>
            <div className="w-full p-4">
                <div className="flex justify-end py-4">
                    <InputField
                        nameKey={"q"}
                        value={queries.q}
                        setValue={setQueries}
                        style={"w500"}
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        isHideLabel
                    />
                </div>
                <div>
                    <table className="table-auto mb-6 text-left w-full">
                        <thead className="font-bold bg-gray-700 text-[13px] text-white">
                            <tr className="border border-gray-500">
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Họ</th>
                                <th className="px-4 py-2">Tên</th>
                                <th className="px-4 py-2">Quyền</th>
                                <th className="px-4 py-2">Số điện thoại</th>
                                <th className="px-4 py-2">Trạng thái</th>
                                <th className="px-4 py-2">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((el, idx) => (
                                <tr
                                    key={idx}
                                    className="border border-gray-500"
                                >
                                    <td className="py-2 px-4">{idx + 1}</td>
                                    <td className="py-2 px-4">
                                        <span>{el.email}</span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span>{el.firstName}</span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span>{el.lastName}</span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span>User</span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span>{el.phone}</span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span>
                                            {el.isBlocked
                                                ? "Đã chặn"
                                                : "Hoạt động"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        {moment(el.createdAt).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex justify-end">
                    <Pagination totalCount={3} />
                </div>
            </div>
        </div>
    );
};

export default ManageUser;
