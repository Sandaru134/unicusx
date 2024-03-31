"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { Dropdown, Menu, Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormSchema } from './constants';
import { fetchTeachersSubjects } from '@/utils';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import toast from 'react-hot-toast';
import Column from 'antd/es/table/Column';

const AddSubjectPage = () => {
    const [subjects, setSubjects] = useState<any>([]);
    const [responseData, setResponseData] = useState([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [search, setSearch] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            grade_level: undefined,
            class_name: '',
            subject_id: '',
        },
    });

    const fetchSubjects = async () => {
        const data = await fetchTeachersSubjects();
        setSubjects(data);
    };

    useEffect(() => {
        fetchSubjects();
    }, [responseData]);

    useEffect(() => {
        setRecordsData(responseData);
    }, [responseData]);

    console.log("This is Subjects",subjects);

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const handleButtonClick = async (record: any) => {
        console.log(record);
        try {
            const response = await axios.patch(`/api/class-teacher/add-subjects/${record}`);
            if (response.status === 200) {
                toast.success('student status updated');
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        try {
            const response = await axios.post('/api/class-teacher/add-subjects', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                console.log('Data created successfully:', response.data);
                setResponseData(response.data);
            } else {
                throw new Error('Failed to create!');
            }
        } catch (error) {
            console.error('Error creating data:', error);
            toast.error('Failed to create!');
        }
    };

    return (
        <div className="mx-auto w-full">
            {/* search filter */}
            <div className="h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-5 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={handleSubmit(submitForm)} className="flex flex-row items-center">
                    <Space wrap className="flex flex-row items-center justify-start pl-5 pr-5">
                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Grade"
                            {...register('grade_level', { required: true })}
                            options={[
                                { value: '1', label: '1' },
                                { value: '2', label: '2' },
                                { value: '3', label: '3' },
                                { value: '4', label: '4' },
                                { value: '5', label: '5' },
                                { value: '6', label: '6' },
                                { value: '7', label: '7' },
                                { value: '8', label: '8' },
                                { value: '9', label: '9' },
                                { value: '10', label: '10' },
                                { value: '11', label: '11' },
                                { value: '12', label: '12' },
                                { value: '13', label: '13' },
                            ]}
                            onChange={(value) => setValue('grade_level', parseInt(value, 10))}
                        />
                        {errors.grade_level && <span className="error text-red-500">{errors.grade_level.message}</span>}
                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Class"
                            {...register('class_name', { required: true })}
                            options={[
                                { value: 'A', label: 'A' },
                                { value: 'B', label: 'B' },
                                { value: 'C', label: 'C' },
                                { value: 'D', label: 'D' },
                                { value: 'E', label: 'E' },
                                { value: 'F', label: 'F' },
                                { value: 'G', label: 'G' },
                                { value: 'H', label: 'H' },
                                { value: 'I', label: 'I' },
                                { value: 'J', label: 'J' },
                                { value: 'K', label: 'K' },
                                { value: 'L', label: 'L' },
                                { value: 'M', label: 'M' },
                                { value: 'N', label: 'N' },
                                { value: 'O', label: 'O' },
                                { value: 'P', label: 'P' },
                                { value: 'Q', label: 'Q' },
                                { value: 'R', label: 'R' },
                                { value: 'S', label: 'S' },
                                { value: 'T', label: 'T' },
                                { value: 'U', label: 'U' },
                                { value: 'V', label: 'V' },
                                { value: 'W', label: 'W' },
                                { value: 'X', label: 'X' },
                                { value: 'Y', label: 'Y' },
                                { value: 'Z', label: 'Z' },
                            ]}
                            onChange={(value) => setValue('class_name', value)}
                        />
                        {errors.class_name && <span className="error text-red-500">{errors.class_name.message}</span>}
                        <Select placeholder="Select Subject" {...register('subject_id', { required: true })} style={{ width: 300 }} onChange={(value) => setValue('subject_id', value)}>
                            {subjects.map((data: any, index: any) => (
                                <Option key={data.id} value={data.subject_id}>
                                    {data.subject?.name}
                                </Option>
                            ))}
                            {errors.subject_id && <span className="error text-red-500">{errors.subject_id.message}</span>}
                        </Select>
                    </Space>
                    <button type="submit" className="w-[130px] items-center rounded-md bg-blue-600 p-1 font-semibold text-white">
                        Filter
                    </button>
                </form>
            </div>
            <div className='mt-1 mx-auto w-full bg-white'>
            <div className="mx-auto flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="User" dataIndex={['student', 'full_name']} key="full_name" className="justify-start self-start font-semibold" width={300} />
                    <Column title="US ID" dataIndex={['student', 'index']} key="index" className="justify-start self-start font-semibold" width={300} />
                    <Column
                        title="Status"
                        key="status"
                        className="justify-start self-start font-semibold"
                        render={(record) => (
                            <button
                                onClick={() => handleButtonClick(record.id)}
                                className={`items-center rounded px-4 ${record.added ? 'bg-blue-200 text-blue-600' : 'bg-gray-500 text-gray-200'} hover:bg-opacity-75`}
                            >
                                {record.status ? 'Added' : 'Added'}
                            </button>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default AddSubjectPage;
