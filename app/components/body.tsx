"use client";

import { useState } from 'react';
import Dropdown from './dropdown'

export default function Body(){
    const options: string[] = ['AUD', 'CAD']

    const [fromOption, setFromOption] = useState<string>(options[0]);
    const [toOption, setToOption] = useState<string>(options[0]);

    const handleFromSelect = (selectedOption: string) => {
        setFromOption(selectedOption);
    };
    const handleToSelect = (selectedOption: string) => {
        setToOption(selectedOption);
    };
    const handleSubmit = () => {
        
    }

    return(
        <div className="flex items-center space-x-4">
                <p>From:</p>
                <Dropdown options={options} onSelect={handleFromSelect} />
                <p>To:</p>
                <Dropdown options={options} onSelect={handleToSelect} />
                <button onClick={handleSubmit}>Get Rates</button>
        </div>
    )

}



