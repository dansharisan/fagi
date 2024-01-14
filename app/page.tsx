'use client'

import dynamic from "next/dynamic";
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
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
  const [stockFagiData, setStockFagiData] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
      method: 'GET',
      headers: {
        // Need to set User-Agent to mimic a normal browser otherwise CNN will think this is a bot and won't provide the data
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setStockFagiData(data)
      })
  }, [])

  if (!stockFagiData) {
    return <p>Loading...</p>
  }

  const stockFagiValue = Math.round(stockFagiData.fear_and_greed.score)
  const stockFagiHistoricalDates = stockFagiData.fear_and_greed_historical.data.map(p => (new Date(p.x)).toISOString().split('T')[0]);
  const stockFagiHistoricalValues = stockFagiData.fear_and_greed_historical.data.map(p => Math.round(p.y));
  const explainStockFagiValue = (value: number): string => {
    if (value < 25) {
      return "Extreme Fear"
    } else if (value < 45) {
      return "Fear"
    } else if (value < 55) {
      return "Neutral"
    } else if (value < 75) {
      return "Greed"
    } else {
      return "Extreme Greed"
    }
  }
  const stockFagiText = explainStockFagiValue(stockFagiValue)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <section id="stock-fagi" className="flex flex-col items-center w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Fear & Greed Index - Stock Market</h1>

        <div className="flex w-full">
          <button
            className={`w-1/2 p-4 ${selectedTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab(0)}
          >
            Overview
          </button>
          <button
            className={`w-1/2 p-4 ${selectedTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab(1)}
          >
            Timeline
          </button>
        </div>

        {selectedTab === 0 && (
          <section className="p-4">

            <GaugeComponent
              value={stockFagiValue}
              type="radial"
              labels={{
                valueLabel: {
                  matchColorWithArc: true,
                  formatTextValue: (value) => explainStockFagiValue(value)
                },
                tickLabels: {
                  type: "outer",
                  ticks: [
                    { value: 0 },
                    { value: 25 },
                    { value: 45 },
                    { value: 55 },
                    { value: 75 },
                    { value: 100 }
                  ],
                  defaultTickValueConfig: { formatTextValue: value => value, style: { "fontSize": "20px" } },
                },
              }}
              arc={{
                cornerRadius: 0,
                colorArray: ['#EA4228', '#5BE12C'],
                subArcs: [{ limit: 24 }, { limit: 44 }, { limit: 54 }, { limit: 74 }, { limit: 100 }],
                padding: 0,
                width: 0.3,
                gradient: true
              }}
              pointer={{
                elastic: false,
                animationDelay: 0
              }}
            />
            <p className="text-center text-xl font-semibold" style={{"color": "rgb(173, 172, 171)"}}>{stockFagiValue}</p>
          </section>
        )}

        {selectedTab === 1 && (
          <section className="p-4 w-full">
            <Line
              options={{

                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem: any) => {
                        return `${tooltipItem.raw} (${explainStockFagiValue(tooltipItem.raw)})`;
                      },
                    }
                 }
                },
                // elements: {
                //   point: {
                //     radius: 0
                //   }
                // }
              }}
              data={{
                labels: stockFagiHistoricalDates,
                datasets: [
                  {
                    data: stockFagiHistoricalValues,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                ],
              }}
            />
          </section>
        )}
      </section>
    </main>
  );
}
