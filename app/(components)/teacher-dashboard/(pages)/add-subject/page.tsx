'use client';
import { Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchTeachersSubjects } from '@/utils';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Column from 'antd/es/table/Column';

const AddSubjectPage = () => {
    const [subjects, setSubjects] = useState<any>([]);
    const [responseData, setResponseData] = useState([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [search, setSearch] = useState('');

    const [formData, setFormData] = useState({
        grade_level: '',
        class_name: '',
        subject_id: '',
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

    // search by input box
    const handleSearch = (value: string) => {
        setSearch(value);
        const filteredData = responseData.filter((item: any) => item.student.full_name.toLowerCase().includes(value.toLowerCase()) || item.student.index.toLowerCase().includes(value.toLowerCase()));
        setRecordsData(filteredData);
    };

    console.log(recordsData);

    const handleButtonClick = async (record: any) => {
        try {
            const response = await axios.patch(`/api/class-teacher/add-subjects/${record}`);
            if (response.status === 200) {
                axios
                    .post('/api/class-teacher/add-subjects', payload)
                    .then((response) => {
                        setResponseData(response.data);
                        toast.success('Student Added ');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const submitForm = async (e: any) => {
        e.preventDefault();
        if (!payload.class_name || !payload.grade_level || !payload.subject_id) {
            toast.error('Please select all fields');
        } else {
            try {
                setRecordsData([]);
                const response = await axios.post('/api/class-teacher/add-subjects', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    setResponseData(response.data);
                } else {
                    throw new Error('Failed to create!');
                }
            } catch (error) {
                toast.error('Failed to create!');
            }
        }
    };

    return (
        <div className="mx-auto w-full">
            {/* search filter */}
            <div className="mb-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={submitForm} className="flex flex-row items-center justify-between">
                    <Space wrap className="flex flex-row items-center justify-start pl-3 pr-5">
                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Grade"
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
                            onChange={(value) => handleSelectChange('grade_level', value)}
                        />
                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Class"
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
                            onChange={(value) => handleSelectChange('class_name', value)}
                        />
                        <Select placeholder="Select Subject" style={{ width: 300 }} onChange={(value) => handleSelectChange('subject_id', value)}>
                            {subjects.map((data: any, index: any) => (
                                <Option key={data.id} value={data.subject_id}>
                                    {data.subject?.name}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <button type="submit" className="mr-3 w-[130px] items-center rounded-md bg-blue-600 p-1.5 font-semibold text-white">
                        Filter
                    </button>
                </form>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="USER" dataIndex={['student', 'full_name']} key="full_name" className="justify-start self-start font-semibold" width={300} />
                    <Column title="US ID" dataIndex={['student', 'index']} key="index" className="justify-start self-start font-semibold" width={300} />
                    <Column
                        title="STATUS"
                        key="status"
                        className="justify-start self-start font-semibold"
                        render={(record) => (
                            <button
                                onClick={() => handleButtonClick(record.id)}
                                className={`items-center rounded px-4 ${record.added ? 'bg-blue-200 text-blue-600' : 'bg-gray-500 text-gray-200'} hover:bg-opacity-75`}
                            >
                                {record.added ? 'Added' : 'Add'}
                            </button>
                        )}
                    />
                </Table>
            </div>
            <Toaster />
        </div>
    );
};

export default AddSubjectPage;
