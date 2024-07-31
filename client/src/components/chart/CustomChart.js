import React, { memo, useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import {
    getDaysInMonth,
    getDaysInRange,
    getMonthInYear,
    getMonthsInRange,
} from "ultils/helpers";
import moment from "moment";

// Sample mock data

const CustomChart = ({ data, isMonth, customTime }) => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const chartDataConvert = data.map((el) => {
            return {
                date: moment(el.date)?.format("DD/MM/YYYY"),
                sum: el.sum,
            };
        });
        setChartData(chartDataConvert);
    }, [data]);
    const options = {
        responsive: true,
        pointRadius: 0,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: { display: true },
                grid: { color: "rgba(0,0,0,0.1)", drawTicks: false },
                min:
                    Math.min(...chartData?.map((el) => Math.round(+el.sum))) -
                        5 <
                    0
                        ? 0
                        : Math.min(
                              ...chartData?.map((el) => Math.round(+el.sum))
                          ) - 5,
                max:
                    Math.max(...chartData?.map((el) => Math.round(+el.sum))) +
                    5,
                border: { dash: [20, 0] },
            },
            x: {
                ticks: { color: "black" },
                grid: { color: "transparent" },
            },
        },
        plugins: {
            legend: false,
        },
        hover: {
            mode: "dataset",
            intersect: false,
        },
    };
    return (
        <div className="py-4 w-full h-full">
            {chartData ? (
                <Line
                    options={options}
                    data={{
                        labels: chartData?.map((el) => el.date),
                        datasets: [
                            {
                                data: chartData?.map((el) =>
                                    Math.round(+el.sum)
                                ),
                                borderColor: "#e35050",
                                tension: 0.2,
                                borderWidth: 2,
                                pointBackgroundColor: "white",
                                pointHoverRadius: 4,
                                pointBorderColor: "#e35050",
                                pointHoverBorderWidth: 4,
                            },
                        ],
                    }}
                />
            ) : (
                <span>Không có data.</span>
            )}
        </div>
    );
};

export default memo(CustomChart);
