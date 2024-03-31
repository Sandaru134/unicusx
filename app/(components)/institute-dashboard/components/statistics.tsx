import React from 'react';
import { BsPersonCheckFill, BsPersonFill } from 'react-icons/bs';

const StatisticsPage = () => {
    return (
        <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div className="h-[110px] w-[330px] rounded-md bg-white shadow-md">
                <div className="flex w-full flex-row justify-between">
                    <h1 className="p-5 text-lg font-semibold">Total users</h1>
                    <BsPersonFill fill="blue" className="mr-3 mt-3 size-[42px]" />
                </div>
                <h1 className="bottom-3 pl-5 align-text-bottom text-lg font-semibold">1 500</h1>
            </div>
            <div className="h-[110px] w-[330px] rounded-md bg-white shadow-md">
                <div className="flex w-full flex-row justify-between">
                    <h1 className="p-5 text-lg font-semibold">Principles</h1>
                    <BsPersonCheckFill fill="green" className="mr-3 mt-3 size-[42px]" />
                </div>
                <h1 className="bottom-3 pl-5 align-text-bottom text-lg font-semibold">7</h1>
            </div>
            <div className="h-[110px] w-[330px] rounded-md bg-white shadow-md">
                <div className="flex w-full flex-row justify-between">
                    <h1 className="p-5 text-lg font-semibold">Teachers</h1>
                    <BsPersonCheckFill fill="orange" className="mr-3 mt-3 size-[42px]" />
                </div>
                <h1 className="bottom-3 pl-5 align-text-bottom text-lg font-semibold">150</h1>
            </div>
            <div className="h-[110px] w-[330px] rounded-md bg-white shadow-md">
                <div className="flex w-full flex-row justify-between">
                    <h1 className="p-5 text-lg font-semibold">Students</h1>
                    <BsPersonCheckFill fill="red" className="mr-3 mt-3 size-[42px]" />
                </div>
                <h1 className="bottom-3 pl-5 align-text-bottom text-lg font-semibold">1 300</h1>
            </div>
        </div>
    );
};

export default StatisticsPage;
