"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
    ssr: false,
});
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    /* --- Logic for FAGI Stock Market --- */
    const [stockFagiData, setStockFagiData] = useState<any>(null);
    const [stockFagiSelectedTab, setStockFagiSelectedTab] = useState(0);

    useEffect(() => {
        fetch("/api/stock-fagi")
            .then((res) => res.json())
            .then((data) => {
                setStockFagiData(data);
            });
    }, []);

    /* --- Logic for FAGI Crypto Market --- */
    const [cryptoFagiData, setCryptoFagiData] = useState<any>(null);
    const [cryptoFagiSelectedTab, setCryptoFagiSelectedTab] = useState(0);

    useEffect(() => {
        fetch("/api/crypto-fagi")
            .then((res) => res.json())
            .then((data) => {
                setCryptoFagiData(data);
            });
    }, []);

    if (!cryptoFagiData || !stockFagiData || !Array.isArray(cryptoFagiData)) {
        // TODO: Create a better skeleton loader here. Ref: https://tailwindcss.com/docs/animation#pulse
        return (
            <div className="flex items-center justify-center h-screen animate-pulse">
                <p>Loading...</p>
            </div>
        );
    }

    const stockFagiValue = Math.round(stockFagiData.fear_and_greed.score);
    const stockFagiHistoricalDates =
        stockFagiData.fear_and_greed_historical.data.map(
            (p: any) => new Date(p.x).toISOString().split("T")[0]
        );
    const stockFagiHistoricalValues =
        stockFagiData.fear_and_greed_historical.data.map((p: any) =>
            Math.round(p.y)
        );
    const explainStockFagiValue = (value: number): string => {
        if (value < 25) {
            return "Extreme Fear";
        } else if (value < 45) {
            return "Fear";
        } else if (value < 55) {
            return "Neutral";
        } else if (value < 75) {
            return "Greed";
        } else {
            return "Extreme Greed";
        }
    };

    const cryptoFagiHistoricalDates = cryptoFagiData.map(
        (p: any) => new Date(p[0]).toISOString().split("T")[0]
    );
    const cryptoFagiHistoricalValues = cryptoFagiData.map((p: any) =>
        Math.round(p[1])
    );
    const cryptoFagiValue = Math.round(
        cryptoFagiHistoricalValues[cryptoFagiHistoricalValues.length - 1]
    );
    const explainCryptoFagiValue = (value: number): string => {
        if (value < 20) {
            return "Extreme Fear";
        } else if (value < 40) {
            return "Fear";
        } else if (value < 60) {
            return "Neutral";
        } else if (value < 80) {
            return "Greed";
        } else {
            return "Extreme Greed";
        }
    };

    return (
        <main className="flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-4">Fear and Greed Index</h1>
            <p className="mb-4">
                Welcome to Fear n Greed Index, your comprehensive resource for
                decoding market sentiment in the US stock and cryptocurrency
                markets. The Fear n Greed Index is a powerful tool that gauges
                the emotional state of investors, providing valuable insights
                into market dynamics. By analyzing a spectrum of factors, this
                index helps investors understand prevailing sentiments – whether
                driven by fear or greed.
            </p>

            {/* Body section */}
            <section
                id="stock-fagi"
                className="flex flex-col items-center w-full p-8 mb-8 bg-white rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold mb-4">Stock Market</h2>

                <div className="flex w-full space-x-4">
                    <button
                        className={`flex-grow p-2 ${
                            stockFagiSelectedTab === 0
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        onClick={() => setStockFagiSelectedTab(0)}
                    >
                        Overview
                    </button>
                    <button
                        className={`flex-grow p-2 ${
                            stockFagiSelectedTab === 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        onClick={() => setStockFagiSelectedTab(1)}
                    >
                        Timeline
                    </button>
                </div>

                {stockFagiSelectedTab === 0 && (
                    <section className="p-4">
                        <GaugeComponent
                            value={stockFagiValue}
                            type="grafana"
                            labels={{
                                valueLabel: {
                                    matchColorWithArc: true,
                                    formatTextValue: (value) =>
                                        explainStockFagiValue(value),
                                },
                                tickLabels: {
                                    type: "outer",
                                    ticks: [
                                        { value: 0 },
                                        { value: 25 },
                                        { value: 45 },
                                        { value: 55 },
                                        { value: 75 },
                                        { value: 100 },
                                    ],
                                    defaultTickValueConfig: {
                                        formatTextValue: (value) => value,
                                        style: { fontSize: "20px" },
                                    },
                                },
                            }}
                            arc={{
                                cornerRadius: 0,
                                colorArray: ["#EA4228", "#5BE12C"],
                                subArcs: [
                                    {
                                        limit: 24,
                                        tooltip: {
                                            text: "Extremely Fear",
                                        },
                                    },
                                    {
                                        limit: 44,
                                        tooltip: {
                                            text: "Fear",
                                        },
                                    },
                                    {
                                        limit: 54,
                                        tooltip: {
                                            text: "Neutral",
                                        },
                                    },
                                    {
                                        limit: 74,
                                        tooltip: {
                                            text: "Greed",
                                        },
                                    },
                                    {
                                        limit: 100,
                                        tooltip: {
                                            text: "Extremely Greed",
                                        },
                                    },
                                ],
                                padding: 0,
                                width: 0.3,
                                gradient: false,
                            }}
                            pointer={{
                                elastic: false,
                                animationDelay: 0,
                            }}
                        />
                        <p
                            className="text-center text-3xl font-semibold"
                            style={{ color: "rgb(173, 172, 171)" }}
                        >
                            {stockFagiValue}
                        </p>
                    </section>
                )}

                {stockFagiSelectedTab === 1 && (
                    <section className="p-4 w-full">
                        <Line
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (tooltipItem: any) => {
                                                return `${
                                                    tooltipItem.raw
                                                } (${explainStockFagiValue(
                                                    tooltipItem.raw
                                                )})`;
                                            },
                                        },
                                    },
                                },
                                elements: {
                                    point: {
                                        radius: 0,
                                    },
                                },
                            }}
                            data={{
                                labels: stockFagiHistoricalDates,
                                datasets: [
                                    {
                                        data: stockFagiHistoricalValues,
                                        borderColor: "rgb(255, 99, 132)",
                                        backgroundColor:
                                            "rgba(255, 99, 132, 0.5)",
                                    },
                                ],
                            }}
                        />
                    </section>
                )}
            </section>

            <section
                id="crypto-fagi"
                className="flex flex-col items-center w-full p-8 mb-8 bg-white rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold mb-4">Crypto Market</h2>

                <div className="flex w-full space-x-4">
                    <button
                        className={`flex-grow p-2 ${
                            cryptoFagiSelectedTab === 0
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        onClick={() => setCryptoFagiSelectedTab(0)}
                    >
                        Overview
                    </button>
                    <button
                        className={`flex-grow p-2 ${
                            cryptoFagiSelectedTab === 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        onClick={() => setCryptoFagiSelectedTab(1)}
                    >
                        Timeline
                    </button>
                </div>

                {cryptoFagiSelectedTab === 0 && (
                    <section className="p-4">
                        <GaugeComponent
                            value={cryptoFagiValue}
                            type="grafana"
                            labels={{
                                valueLabel: {
                                    matchColorWithArc: true,
                                    formatTextValue: (value) =>
                                        explainCryptoFagiValue(value),
                                },
                                tickLabels: {
                                    type: "outer",
                                    ticks: [
                                        { value: 0 },
                                        { value: 20 },
                                        { value: 40 },
                                        { value: 60 },
                                        { value: 80 },
                                        { value: 100 },
                                    ],
                                    defaultTickValueConfig: {
                                        formatTextValue: (value) => value,
                                        style: { fontSize: "20px" },
                                    },
                                },
                            }}
                            arc={{
                                cornerRadius: 0,
                                colorArray: ["#EA4228", "#5BE12C"],
                                subArcs: [
                                    {
                                        limit: 19,
                                        tooltip: {
                                            text: "Extremely Fear",
                                        },
                                    },
                                    {
                                        limit: 39,
                                        tooltip: {
                                            text: "Fear",
                                        },
                                    },
                                    {
                                        limit: 59,
                                        tooltip: {
                                            text: "Neutral",
                                        },
                                    },
                                    {
                                        limit: 79,
                                        tooltip: {
                                            text: "Greed",
                                        },
                                    },
                                    {
                                        limit: 100,
                                        tooltip: {
                                            text: "Extremely Greed",
                                        },
                                    },
                                ],
                                padding: 0,
                                width: 0.3,
                                gradient: false,
                            }}
                            pointer={{
                                elastic: false,
                                animationDelay: 0,
                            }}
                        />
                        <p
                            className="text-center text-3xl font-semibold"
                            style={{ color: "rgb(173, 172, 171)" }}
                        >
                            {cryptoFagiValue}
                        </p>
                    </section>
                )}

                {cryptoFagiSelectedTab === 1 && (
                    <section className="p-4 w-full">
                        <Line
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (tooltipItem: any) => {
                                                return `${
                                                    tooltipItem.raw
                                                } (${explainCryptoFagiValue(
                                                    tooltipItem.raw
                                                )})`;
                                            },
                                        },
                                    },
                                },
                                elements: {
                                    point: {
                                        radius: 0,
                                    },
                                },
                            }}
                            data={{
                                labels: cryptoFagiHistoricalDates,
                                datasets: [
                                    {
                                        data: cryptoFagiHistoricalValues,
                                        borderColor: "rgb(255, 99, 132)",
                                        backgroundColor:
                                            "rgba(255, 99, 132, 0.5)",
                                    },
                                ],
                            }}
                        />
                    </section>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">
                    Why Fear and Greed index?
                </h2>
                <p>
                    In the world of finance, emotions play a significant role in
                    shaping market trends. The Fear and Greed Index quantifies
                    these emotions, offering a unique perspective on investor
                    psychology. Fear often drives markets to undervalue assets,
                    while greed can lead to overvaluation. Recognizing these
                    sentiments can be crucial for making well-informed
                    investment decisions.
                </p>
            </section>
        </main>
    );
}
