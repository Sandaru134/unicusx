import { fetchSubjectForTeacher } from '@/utils';
import { Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AddSubject = () => {
    const [fetchSubjectData, setFetchSubjectData] = useState<any>([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchData = async () => {
        const data = await fetchSubjectForTeacher();
        setFetchSubjectData(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setRecordsData(fetchSubjectData);
    }, [fetchSubjectData]);

    // update status
    const handleButtonClick = async (record: any) => {
        try {
            const response = await axios.patch(`/api/institute-admin/subject/${record}`);
            if (response.status === 200) {
                toast.success('Subject status updated');
                fetchData();
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    //seach by
    useEffect(() => {
        const filteredData = fetchSubjectData.subject_status?.filter((item: { subject: { name: string; category: string } }) => {
            const searchMatch = item.subject && item.subject.name.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = !selectedCategory || selectedCategory === 'all' || item.subject.category === selectedCategory;

            return searchMatch && categoryMatch;
        });

        setRecordsData(filteredData);
    }, [fetchSubjectData, search, selectedCategory]);

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    return (
        <div className="mx-auto">
            <div className="h-[150px] w-full rounded-md shadow-lg bg-white mb-3">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="pl-3">
                    <Select
                        defaultValue="Select Category"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'primary', label: 'Primary' },
                            { value: 'secondary', label: 'Secondary' },
                            { value: 'collegiate', label: 'Collegiate' },
                        ]}
                        onChange={(value) => setSelectedCategory(value)}
                    />
                </Space>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 pt-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="Subject" dataIndex={['subject', 'name']} key="subject" className="justify-start self-start font-semibold" />
                    <Column
                        title="Status"
                        key="status"
                        className="justify-start self-start font-semibold"
                        render={(record) => (
                            <button
                                onClick={() => handleButtonClick(record.id)}
                                className={`items-center rounded px-4 ${record.status ? 'bg-green-200 text-green-600' : 'bg-gray-500 text-gray-200'} hover:bg-opacity-75`}
                            >
                                {record.status ? 'Activated' : 'Activate'}
                            </button>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default AddSubject;
