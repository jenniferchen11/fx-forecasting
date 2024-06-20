"use client";

import "./components.css";

import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Title
} from 'chart.js';
import React, { useEffect, useState } from 'react';

import { AxiosResponse } from 'axios';
import { ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Spacer from './spacer';

// register the required components with Chart.js
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend);

interface LineGraphProps {
    res: AxiosResponse<any, any> | null;
    performForecast: boolean;
    fromOption: string | null;
    toOption: string | null;
    isLoading: boolean;
}

const LineGraph: React.FC<LineGraphProps> = ({ res, performForecast, fromOption, toOption, isLoading }) => {
    const [lineGraphData, setLineGraphData] = useState<ChartData<'line'> | null>(null);
    const [currentRate, setCurrentRate] = useState<number | null>(null);
    const [chartOptions, setChartOptions] = useState<ChartOptions<'line'> | null>(null);
    const [message, setMessage] = useState<string>("");
    const [displayedFrom, setDisplayedFrom] = useState<string | null>("");
    const [displayedTo, setDisplayedTo] = useState<string | null>("");

    useEffect(() => {
        if(res === null){
            return;
        }
        if(isLoading){
            setLineGraphData(null);
            setCurrentRate(null);
            return;
        }
        setDisplayedFrom(fromOption);
        setDisplayedTo(toOption);
        const datedHistoricalRates = res.data['historical_rates'];
        const datedPredictedRates = res.data['predicted_rates'];
        const datedRates = { ...datedHistoricalRates, ...datedPredictedRates};
        const labels = Object.keys(datedRates).sort();

        if(Object.keys(datedPredictedRates).length === 0 && performForecast){
            setMessage(`NOTE: The forecasting model for ${fromOption} to ${toOption} is not available yet...Apologies!`);
        } else {
            setMessage("");
        }

        const chartOptions: ChartOptions<'line'> = {
            plugins: {
                legend: {
                    display: performForecast,
                    position: 'bottom',
                    labels: {
                        boxWidth: 30,
                        boxHeight: 3,
                        padding: 20,
                        font: {
                          size: 14,
                          family: 'Tahoma',
                          style: 'normal',
                        },
                    }
                },
            }
        };
        setChartOptions(chartOptions);

        const lineChartData: ChartData<"line"> = {
            labels: labels,
            datasets: [
              {
                label: 'Historical Exchange Rates',
                data: datedHistoricalRates,
                fill: false,
                borderColor: 'rgb(10, 138, 61)',
                tension: 0.1
              },
              {
                label: 'Predicted Exchange Rates',
                data: datedPredictedRates,
                fill: false,
                borderColor: 'rgb(166, 17, 17)',
                tension: 0.1
              }
            ]
        };
        setLineGraphData(lineChartData);

        let currentRate = parseFloat(res.data['current_rate']);
        setCurrentRate(currentRate);
      }, [res, isLoading]);


  return (
    <div>
        <p className="graph-message">{message}</p>
        <Spacer/>
        {currentRate !== null && 
        <p className="message-large"> 
            Current Conversion Rate: 1 {displayedFrom} = <strong>{currentRate.toFixed(4)} {displayedTo}</strong>
        </p>}
        <Spacer/>
        {lineGraphData !== null && chartOptions !== null &&
            <Line data={lineGraphData} options={chartOptions} />
        }
    </div>
  );
}

export default LineGraph;
