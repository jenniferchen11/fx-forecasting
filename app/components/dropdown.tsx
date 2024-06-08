"use client";

import React, { useState } from 'react';

interface DropdownProps {
    options: string[];
    onSelect: (option: string) => void;
  }

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  function handleOptionClick(option: string) {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  }

  return (
    <div className="relative inline-block w-64">
      <button
        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded inline-flex items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-1">{selectedOption}</span>
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M0 0h20v20H0z" fill="none" />
          <path d="M5.41 7.41L10 12l4.59-4.59L16 9l-6 6-6-6z" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 text-black"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
