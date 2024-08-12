import { apiGetBestSellers, apiGetDashboard, apiGetStatistical } from "apis";
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
    const [bestSellers, setBestSellers] = useState([]);
    const [customTime, setCustomTime] = useState({
        from: "",
        to: "",
    });
    const fetchDataDashboard = async () => {
        const response = await apiGetStatistical();
        if (response.status === 200) setData(response.metadata);
        const dataBestSellers = await apiGetBestSellers();
        if (dataBestSellers.status === 200)
            setBestSellers(dataBestSellers.metadata);
    };
    // useEffect(() => {
    //     const type = isMonth ? "MTH" : "D";
    //     const params = { type };
    //     if (customTime.from) params.from = customTime.from;
    //     if (customTime.to) params.to = customTime.to;
    //     fetchDataDashboard(params);
    // }, [isMonth, customTime]);
    // const handleCustomTime = () => {
    //     setCustomTime({ from: "", to: "" });
    // };

    useEffect(() => {
        fetchDataDashboard();
    }, []);

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
                <div className="mt-6 grid grid-cols-10 gap-4">
                    <div className="col-span-7 min-h-[500px] border flex flex-col gap-4 relative flex-1 rounded-md p-4">
                        <div className="flex items-center justify-between font-bold">
                            Thống kê doanh thu 15 ngày gần nhất
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
                            Số đơn hàng thành công và đã hủy
                        </span>
                        <div>
                            <Pie data={pieData} />;
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4">
                    <div className="col-span-7 min-h-[500px] border flex flex-col gap-4 relative flex-1 rounded-md p-4">
                        <span className="font-bold">
                            Các sản phẩm bán chạy nhất trong tháng
                        </span>
                        <div>
                            <table className="table-auto mb-6 text-left w-full">
                                <thead className="font-bold bg-gray-700 text-[13px] text-white">
                                    <tr className="border border-gray-500">
                                        <th className="px-4 py-2">#</th>
                                        <th className="px-4 py-2">Ảnh</th>
                                        <th className="px-4 py-2">Tên</th>
                                        <th className="px-4 py-2">Đã bán</th>
                                        <th className="px-4 py-2">Tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bestSellers &&
                                        bestSellers.map((el, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4">
                                                    {index + 1}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <img
                                                        src={el.image}
                                                        className="h-[50px] "
                                                    />
                                                </td>
                                                <td className="py-2 px-4">
                                                    {el.productname}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {el.total_quantity} sản phẩm
                                                </td>
                                                <td className="py-2 px-4">
                                                    {el.stock} sản phẩm
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
