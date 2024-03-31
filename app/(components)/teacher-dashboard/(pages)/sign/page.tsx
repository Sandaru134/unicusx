"use client"
import { class_name, grade_level } from '@/utils';
import { Select, Space } from 'antd';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SignPage = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const [formData, setFormData] = useState({
        year: '',
        grade_level: '',
        term: '',
        class_name: '',
    });
    const handleFormChange = (name: any, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
        handleFormChange(name, value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const payload = {
            ...formData,
            grade_level: parseInt(formData.grade_level),
        };
        console.log('this is form data', payload);
        try {
            const response = await axios.post('/api/class-teacher/sign/', payload);
            if (response.status === 200) {
                console.log('This is response', response.data);
                setResponseData(response.data);
            } else {
                throw new Error('Failed get item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="mx-auto w-full">
            <div className="mt-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={handleSubmit}>
                    <Space wrap className="gap-10 pl-3">
                        <Select
                            defaultValue="Select Year"
                            style={{ width: 300 }}
                            options={[
                                { value: 'all', label: 'All' },
                                { value: '2024', label: '2024' },
                                { value: '2023', label: '2023' },
                                { value: '2022', label: '2022' },
                                { value: '2021', label: '2021' },
                                { value: '2020', label: '2020' },
                            ]}
                            onChange={(value) => handleSelectChange('year', value)}
                        />
                        <Select
                            defaultValue="Select Year"
                            style={{ width: 300 }}
                            options={[
                                { value: 'first', label: 'First'},
                                { value: 'second', label: 'Second'},
                                { value: 'third', label: 'Third' },
                            ]}
                            onChange={(value) => handleSelectChange('term', value)}
                        />
                        <Select placeholder="Select Grade" style={{ width: 300 }} onChange={(value) => handleSelectChange('grade_level', value)}>
                            {grade_level.map((value, index) => (
                                <Option key={value} value={value}>
                                    {value}
                                </Option>
                            ))}
                        </Select>

                        <Select defaultValue="Select Class" style={{ width: 300 }} onChange={(value) => handleSelectChange('class_name', value)}>
                            {class_name.map((value, index) => (
                                <Option key={value} value={value}>
                                    {value}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <button type="submit" className="w-[130px] items-center rounded-md bg-blue-600 p-1 font-semibold text-white">
                        Filter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignPage;
