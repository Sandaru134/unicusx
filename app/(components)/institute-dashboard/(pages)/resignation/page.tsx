'use client';
import { Dropdown, Menu, Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ResignationPage = () => {
    const [recordsData, setRecordsData] = useState<any>([]);
    const [responseData, setResponseData] = useState<any>([]);

    const [year, setYear] = useState('');
    const [user, setUser] = useState('');
    const [grade, setGrade] = useState('');
    const [className, setClassName] = useState('');
    const [search, setSearch] = useState('');

    const handleSelectChange = (value: any) => {
        axios
            .post('/api/institute-admin/resignation', { user: value })
            .then((response) => {
                setResponseData(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        const filterData = () => {
            return responseData.filter((item: any) => {
                // Filter based on year
                const yearMatch = !year || year === 'all' ? true : item.createdAt.includes(year);

                // Filter based on grade
                const gradeMatch = !grade || grade === 'all' ? true : item.classes?.grade_level.toString() === grade;

                // Filter based on class
                const classMatch = !className || className === 'all' ? true : item.classes?.class_name === className;

                return yearMatch && gradeMatch && classMatch;
            });
        };

        const searchFilteredData = filterData().filter((item: any) => {
            const searchMatch =
                item.full_name.toLowerCase().includes(search.toLowerCase()) ||
                item.index.toLowerCase().includes(search.toLowerCase()) 
            return searchMatch;
        });

        setRecordsData(searchFilteredData);
    }, [className, grade, responseData, search, year]);

    useEffect(() => {
        setRecordsData(responseData);
    }, [responseData]);

    console.log(recordsData, responseData);

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const formatDate = (createdAt: string | number | Date) => {
        return new Date(createdAt).toLocaleDateString('en-UK', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });
    };

    const formatDateResignation = (date_of_resignation: string | number | Date) => {
        if (!date_of_resignation) {
            return 'MM/DD/YYYY'; // Handle null or undefined values
        }
        const date = new Date(date_of_resignation);
        if (isNaN(date.getTime())) {
            return 'MM/DD/YYYY'; // Handle invalid date strings
        }
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    const handleButtonClick = async (record: any) => {
        console.log(record);
        try {
            const response = await axios.patch(`/api/institute-admin/resignation/${record}`);
            if (response.status === 200) {
                toast.success('Subject status updated');
                // Fetch updated data after status update
                axios
                    .post('/api/institute-admin/resignation', { user })
                    .then((response) => {
                        setRecordsData(response.data);
                        toast.success('status updated');
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

    return (
        <div className="mx-auto w-full">
            {/* search filter */}
            <div className="h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-5 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="flex flex-row items-center justify-between pl-5 pr-5">
                    <Select
                        defaultValue="User"
                        style={{ width: 300 }}
                        options={[
                            { value: 'student', label: 'Student' },
                            { value: 'teacher', label: 'Teacher' },
                            { value: 'principal', label: 'Principal' },
                        ]}
                        onChange={(value) => {
                            console.log('Selected value:', value);
                            setUser(value);
                            handleSelectChange(value);
                        }}
                    />

                    <Select
                        defaultValue="Year"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: '2020', label: '2020' },
                            { value: '2021', label: '2021' },
                            { value: '2022', label: '2022' },
                            { value: '2023', label: '2023' },
                            { value: '2024', label: '2024' },
                            { value: '2025', label: '2025' },
                        ]}
                        onChange={(value) => setYear(value)}
                    />
                    <Select
                        defaultValue="Grade"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
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
                        onChange={(value) => setGrade(value)}
                    />
                    <Select
                        defaultValue="Class"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
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
                        onChange={(value) => setClassName(value)}
                    />
                </Space>
            </div>

            <div className="mt-1 bg-white">
                <div className="mx-auto flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="rounded-md bg-white shadow-md md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="User" dataIndex="full_name" key="full_name" className="justify-start self-start font-semibold" align="justify" width={300} />
                    <Column title="US ID" dataIndex="index" key="index" className="justify-start self-start font-semibold" align="justify" width={300} />
                    <Column
                        title="DATE OF ENTERED"
                        dataIndex="createdAt"
                        key="createdAt"
                        className="justify-start self-start font-semibold"
                        render={(createdAt) => formatDate(createdAt)}
                        align="justify"
                        width={300}
                    />
                    <Column
                        title="STATUS"
                        key="status"
                        className="justify-start self-start font-semibold"
                        render={(record) => (
                            <button
                                onClick={() => handleButtonClick(record.index)}
                                className={`items-center rounded px-4 ${record.left ? 'bg-red-200 text-red-600' : 'bg-blue-200 text-blue-600'} hover:bg-opacity-75`}
                            >
                                {record.left ? 'left' : 'leave'}
                            </button>
                        )}
                        align="justify"
                        width={300}
                    />
                    <Column
                        title="Date of Resignation"
                        dataIndex="date_of_resignation"
                        key="date_of_resignation"
                        className="justify-start self-start font-semibold"
                        render={(date) => {
                            console.log('Date of resignation:', date);
                            return formatDateResignation(date);
                        }}
                        align="match-parent"
                    />
                </Table>
            </div>
        </div>
    );
};

export default ResignationPage;
