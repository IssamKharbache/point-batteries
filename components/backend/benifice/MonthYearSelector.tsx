"use client";

import { useBenificeStore } from "@/context/store";
import React from "react";

const MonthYearSelector = () => {
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } =
    useBenificeStore();

  // Generate months data
  const months = [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  // Generate years (from current year back 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      {/* Month Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        <label
          htmlFor="month-select"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          Mois:
        </label>
        <div className="relative w-full min-w-[120px]  font-sans">
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="
              w-full
              h-10
              pl-3 pr-8
              rounded-lg
              border border-gray-300
              bg-white
              text-gray-700
              font-medium
              text-sm
              appearance-none
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition-all
              duration-200
              cursor-pointer
              hover:border-gray-400
            "
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        <label
          htmlFor="year-select"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          Année:
        </label>
        <div className="relative w-full min-w-[100px] font-sans">
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="
              w-full
              h-10
              pl-3 pr-8
              rounded-lg
              border border-gray-300
              bg-white
              text-gray-700
              font-medium
              text-sm
              appearance-none
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition-all
              duration-200
              cursor-pointer
              hover:border-gray-400
            "
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthYearSelector;
