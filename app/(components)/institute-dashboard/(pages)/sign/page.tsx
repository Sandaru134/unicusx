'use client';
import { grade_level } from '@/utils';
import useYear from '@/utils/useYear';
import { message, Select, Space, Table, Tag } from 'antd';
import { Option } from 'antd/es/mentions';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const SignPage = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data } = useYear();

    const [formData, setFormData] = useState({
        year: '',
        grade_level: '',
        term_name: '',
    });
    const handleFormChange = (name: any, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
        handleFormChange(name, value);
    };

    const payload = {
        ...formData,
        grade_level: parseInt(formData.grade_level),
    };

    useEffect(() => {
        setRecordsData(responseData);
    }, [responseData]);

    // update status
    const handleButtonClick = async (record: any) => {
        setIsSubmitting(true);
        try {
            const response = await axios.patch(`/api/institute-admin/sign/${record}`);
            if (response.status === 200) {
                axios
                    .post('/api/institute-admin/sign/', payload)
                    .then((response) => {
                        setRecordsData(response.data);
                        toast.success('Sign Updated');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!payload.grade_level || !payload.term_name || !payload.year) {
            toast.error('Please select all fields');
        } else {
            try {
                const response = await axios.post('/api/institute-admin/sign/', payload);
                if (response.status === 200) {
                    setResponseData(response.data);
                } else {
                    throw new Error('Failed get item');
                }
            } catch (error: any) {
                toast.error('Term Not Found', error.message);
            }
        }
    };

    return (
        <div className="mx-auto w-full">
            <div className="mb-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form className="flex flex-row justify-between" onSubmit={handleSubmit}>
                    <Space wrap className="gap-12 justify-between pl-3">
                        <Select placeholder="Select Year" style={{ width: 300 }} onChange={(value) => handleSelectChange('year', value)}>
                            {data.map((year: any, index) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Select Term"
                            style={{ width: 300 }}
                            options={[
                                { value: 'First', label: 'First' },
                                { value: 'Second', label: 'Second' },
                                { value: 'Third', label: 'Third' },
                            ]}
                            onChange={(value) => handleSelectChange('term_name', value)}
                        />
                        <Select placeholder="Select Grade" style={{ width: 300 }} onChange={(value) => handleSelectChange('grade_level', value)}>
                            {grade_level.map((value, index) => (
                                <Option key={value} value={value}>
                                    {value}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <button disabled={isSubmitting === true} type="submit" className="mr-3 w-[130px] items-center rounded-md bg-blue-600 p-2 font-semibold text-white">
                        Filter
                    </button>
                </form>
            </div>
            <div className="mx-auto mt-1 w-full bg-white">
                <div className="mx-auto flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    {/* <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} /> */}
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="CLASS" align="start" dataIndex={['class', 'class_name']} key="class_name" className="justify-start self-start font-semibold" width={800} />
                    <Column
                        title="CLASS TEACHER"
                        
                        width={900}
                        key="class_teacher_signed"
                        className="font-semibold"
                        render={(record) => (
                            <button disabled className={`items-center rounded px-4 ${record.teacher_signed ? 'bg-green-100 text-green-500' : 'bg-stone-400 text-stone-100'} hover:bg-opacity-75`}>
                                {record.teacher_signed ? 'Signed' : 'Sign'}
                            </button>
                        )}
                    />
                    <Column
                        title="PRINCIPAL"
                        dataIndex="principal_signed"
                        key="principal_signed"
                        className="justify-start self-start font-semibold"
                        render={(text, record: any) => (
                            <button
                                disabled={record.teacher_signed === false || record.principal_signed === true}
                                onClick={() => handleButtonClick(record.id)}
                                className={`items-center rounded px-4 ${record.principal_signed ? 'bg-blue-100 text-blue-600' : 'bg-stone-400 text-stone-100'} hover:bg-opacity-75`}
                            >
                                {record.principal_signed ? 'Signed' : 'Sign'}
                            </button>
                        )}
                    />
                </Table>
            </div>
            <Toaster />
        </div>
    );
};

export default SignPage;
