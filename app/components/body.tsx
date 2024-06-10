"use client";

import { useState } from 'react';
import axios from 'axios';
import Dropdown from './dropdown'

import { Line } from 'react-chartjs-2';
import { ChartData } from 'chart.js';

import Spacer from './spacer'

import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale
} from 'chart.js';

// register the required components with Chart.js
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

interface RequestData {
    from: string;
    to: string;
}

interface HistoricalData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  }

export default function Body(){
    const options: string[] = ['AUD', 'CAD']

    const [fromOption, setFromOption] = useState<string>(options[0]);
    const [toOption, setToOption] = useState<string>(options[0]);
    const [responseData, setResponse] = useState<ChartData<'line'> | null>(null);
    const [message, setMessage] = useState<string>("Please select currencies and click 'Get Rates' to obtain results.");

    const handleFromSelect = (selectedOption: string) => {
        setFromOption(selectedOption);
    };
    const handleToSelect = (selectedOption: string) => {
        setToOption(selectedOption);
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("submitted");

        if (fromOption == toOption){
            setMessage(" 'From' and 'To' currencies must be different.");
            return;
        } else{
            setMessage("");
        }
        const request_data: RequestData = {
            from: fromOption,
            to: toOption
        }

        const apiUrl: string = process.env.NEXT_PUBLIC_API_URL!;
        
        try {
            
            const res = await axios.get(apiUrl, {params: request_data});
            
            const historicalRates = res.data['historical_rates']

            const labels = Object.keys(historicalRates).sort()
            let rates = [];

            for(let i = 0; i < labels.length; i++){
                rates.push(historicalRates[labels[i]])
            }
            console.log(labels)
            console.log(rates)

            const lineChartData: ChartData<"line"> = {
                labels: labels,
                datasets: [
                  {
                    label: 'Historical ForEx Rates',
                    data: rates,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }
                ]
            };
            setResponse(lineChartData);
        
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return(
        <div>
            <div className="flex items-center space-x-4">
                <p>From:</p>
                <Dropdown options={options} onSelect={handleFromSelect} />
                <p>To:</p>
                <Dropdown options={options} onSelect={handleToSelect} />
                <form onSubmit={handleSubmit}>
                    <button type="submit">Get Rates</button>
                </form>
            </div>
            <Spacer/>
            {responseData ? (
                <Line data={responseData} />
            ) : (
                <p>{message}</p>
            )}
        </div>
    )

}



