"use client";

import "./components.css";

import axios, { AxiosResponse } from 'axios';

import { useState } from 'react';
import { FadeLoader } from 'react-spinners';
import currencyNames from "./constants";
import Dropdown from './dropdown';
import LineGraph from './lineGraph';
import Spacer from './spacer';

interface RequestData {
    from: string;
    to: string;
    performForecast: boolean;
}

const formattedCurrencies: string[] = Object.keys(currencyNames).map(key => {
    return `${key} (${currencyNames[key]})`;
});

export default function Body(){
    const [fromOption, setFromOption] = useState<string>("CAD");
    const [toOption, setToOption] = useState<string>("USD");
    const [message, setMessage] = useState<string>("Please select currencies and click Submit");
    const [performForecast, setPerformForecast] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<AxiosResponse<any, any> | null>(null);

    const handleForecastSelect = (selectedOption: string | null) => {
        if(selectedOption == null){
            setPerformForecast(false);
        } else if(selectedOption == "Yes"){
            setPerformForecast(true);
        } else{
            setPerformForecast(false);
        }
    };

    const handleFromSelect = (selectedOption: string | null) => {
        if(selectedOption != null){
            setFromOption(selectedOption.slice(0, 3));
        } else {
            setFromOption("Select");
        }
    };

    const handleToSelect = (selectedOption: string | null) => {
        if(selectedOption != null){
            setToOption(selectedOption.slice(0, 3));
        } else {
            setToOption("Select");
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (fromOption == toOption){
            setMessage("NOTE: 'From' and 'To' currencies must be different");
            return;
        } 
        setIsLoading(true);
        setMessage("")
        
        const request_data: RequestData = {
            from: fromOption,
            to: toOption,
            performForecast: performForecast
        }
        const apiUrl: string = process.env.NEXT_PUBLIC_API_URL!;
        
        try {
            const res: AxiosResponse<any, any> = await axios.get(apiUrl, {params: request_data});
            setResponse(res);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    return(
        <div>
            <div className="flex items-center space-x-4 justify-center">
                <p className="dropdown-label"> From: </p>
                <Dropdown options={formattedCurrencies} defaultOption="CAD (Canadian Dollar)" onSelect={handleFromSelect} />
                <p className="dropdown-label"> To: </p>
                <Dropdown options={formattedCurrencies} defaultOption="USD (United States Dollar)" onSelect={handleToSelect} />
                <p className="dropdown-label"> Forecast next 14 days: </p>
                <Dropdown options={['No', 'Yes']} defaultOption="No" onSelect={handleForecastSelect} />
                <form onSubmit={handleSubmit}>
                    <button className="submit-button" type="submit">
                        Submit
                    </button>
                </form>
            </div>
            <Spacer/>
            <p className="message">{message}</p>
            <LineGraph res={response} performForecast={performForecast} fromOption={fromOption} toOption={toOption} isLoading={isLoading}/>
            {isLoading && 
                <div className="flex justify-center items-center">
                    <FadeLoader color={'#705642'} loading={isLoading} radius={50} />
                </div>
            }
        </div>
    )
}




