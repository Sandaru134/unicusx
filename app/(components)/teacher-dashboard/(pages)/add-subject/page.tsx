'use client';
import { Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchTeachersSubjects } from '@/utils';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Column from 'antd/es/table/Column';
import useGrade from '@/utils/useGrade';
import useClass from '@/utils/useClass';
import useSubject from '@/utils/useSubject';

const AddSubjectPage = () => {
    const [subjects, setSubjects] = useState<any>([]);
    const [responseData, setResponseData] = useState([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [search, setSearch] = useState('');

    const { GradeData } = useGrade();
    const { ClassData } = useClass();
    const { subjectData } = useSubject();

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
                    throw new Error('Failed to find data!');
                }
            } catch (error) {
                toast.error('Failed to find data!');
            }
        }
    };
    
    return (
        <div className="mx-auto w-full">
            {/* search filter */}
            <div className="mb-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={submitForm} className="flex flex-row items-center justify-between">
                    <Space wrap className="flex flex-row items-center justify-between gap-12 pl-3 pr-5">
                        <Select style={{ width: 300 }} placeholder="Select Grade" onChange={(value) => handleSelectChange('grade_level', value)}>
                            {GradeData.map((data: any, index: any) => (
                                <Option key={data} value={data.class?.grade_level}>
                                    {data.class?.grade_level || ""}
                                </Option>
                            ))}
                        </Select>
                        <Select style={{ width: 300 }} placeholder="Select Class" onChange={(value) => handleSelectChange('class_name', value)}>
                            {ClassData.map((data: any, index: any) => (
                                <Option key={data} value={data.class?.class_name}>
                                    {data.class?.class_name || ""}
                                </Option>
                            ))}
                        </Select>
                        <Select placeholder="Select Subject" style={{ width: 300 }} onChange={(value) => handleSelectChange('subject_id', value)}>
                            {subjectData.map((data: any, index: any) => (
                                <Option key={data.id} value={data.subject?.subject_id}>
                                    {data.subject?.name || ""}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <button type="submit" className="mr-3 w-[130px] items-center rounded-md bg-blue-600 p-2 font-semibold text-white">
                        Filter
                    </button>
                </form>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="STUDENT" dataIndex={['student', 'full_name']} key="full_name" className="justify-start self-start font-semibold" width={300} />
                    <Column title="US ID" dataIndex={['student', 'index']} key="index" className="justify-start self-start font-semibold" width={300} />
                    <Column
                        title="STATUS"
                        key="status"
                        className="justify-start self-start font-semibold"
                        render={(record) => (
                            <button
                                onClick={() => handleButtonClick(record.id)}
                                className={`items-center rounded px-4 ${record.added ? 'bg-blue-100 text-blue-600' : 'bg-stone-400 text-stone-100'} hover:bg-opacity-75`}
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
