import { apiGetDashboard, apiGetStatistical } from "apis";
import BoxInfo from "components/chart/BoxInfo";
import CustomChart from "components/chart/CustomChart";
import React, { useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { formatMoney } from "ultils/helpers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
    const [data, setData] = useState();
    const [isMonth, setIsMonth] = useState(false);
    const [customTime, setCustomTime] = useState({
        from: "",
        to: "",
    });
    const fetchDataDashboard = async (params) => {
        const response = await apiGetStatistical();
        if (response.status === 200) setData(response.metadata);
    };
    useEffect(() => {
        const type = isMonth ? "MTH" : "D";
        const params = { type };
        if (customTime.from) params.from = customTime.from;
        if (customTime.to) params.to = customTime.to;
        fetchDataDashboard(params);
    }, [isMonth, customTime]);
    const handleCustomTime = () => {
        setCustomTime({ from: "", to: "" });
    };

    const pieData = {
        labels: ["Tông đơn đã hủy", "Tổng đơn thành công"],
        datasets: [
            {
                label: "Tổng đơn",
                data: [
                    data?.statusOrder?.cancel || 0,
                    data?.statusOrder?.complete || 0,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                ],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="w-full flex flex-col gap-4 bg-gray-50">
            <div className="w-full"></div>
            <div className="p-4 border-b w-full bg-gray-50 flex ">
                <h1 className="text-xl font-bold tracking-tight">
                    QUẢN LÍ CHUNG
                </h1>
            </div>
            <div className="px-4 flex flex-col">
                <div className="grid grid-cols-4 gap-4">
                    <BoxInfo
                        text="Số thành viên mới"
                        icon={<AiOutlineUserAdd size={22} />}
                        number={data?.countNewUser}
                        className="border-blue-500 text-white bg-blue-500"
                    />
                    <BoxInfo
                        text="Số tiền đã được thanh toán"
                        icon={
                            <img
                                src="/dong.svg"
                                className="h-6 object-contain"
                            />
                        }
                        number={
                            data?.paid > 0
                                ? formatMoney(parseInt(data.paid))
                                : 0
                        }
                        className="border-green-500 text-white bg-green-500"
                    />
                    <BoxInfo
                        text="Số tiền chưa thanh toán"
                        icon={
                            <img
                                src="/dong.svg"
                                className="h-6 object-contain"
                            />
                        }
                        number={
                            data?.unPaid > 0
                                ? formatMoney(parseInt(data.unPaid))
                                : 0
                        }
                        className="border-orange-500 text-white bg-orange-500"
                    />
                    <BoxInfo
                        text="Số sản phẩm đã bán"
                        // icon={<img src="/dong.svg" className="h-6 object-contain" />}
                        number={data?.sold > 0 ? data.sold : 0}
                        className="border-yellow-500 text-white bg-yellow-500"
                    />
                </div>
                <div className="mt-6 grid grid-cols-10 gap-4 w-[1230px]">
                    <div className="col-span-7 min-h-[500px] border flex flex-col gap-4 relative flex-1 rounded-md  p-4">
                        <div className="flex items-center justify-between">
                            Thống kê doanh thu
                        </div>
                        {data?.orderDate && (
                            <CustomChart
                                customTime={customTime}
                                isMonth={false}
                                data={data?.orderDate}
                            />
                        )}
                    </div>
                    <div className="col-span-3 rounded-md border p-4">
                        <span className="font-bold gap-8">
                            Số người truy cập chưa đăng ký và đã đăng ký
                        </span>
                        <div>
                            <Pie data={pieData} />;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
