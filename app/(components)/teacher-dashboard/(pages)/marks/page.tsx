'use client';
import { fetchAllSubjectsForAddMarks, fetchAllTermsForTeacher } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Select, Space, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsXLg } from 'react-icons/bs';

const MarksPages = () => {
    const [addMarksModal, setAddMarksModal] = useState<boolean>(false);
    const [id, setId] = useState('');
    const [recordsData, setRecordsData] = useState<any>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [search, setSearch] = useState('');
    const [term, setTerm] = useState<any>([]);
    const [subjects, setSubjects] = useState<any>([]);
    const [responseData, setResponseData] = useState<any>([]);
    const [marksForm, setMarksForm] = useState({
        mark: '',
    });
    const [formData, setFormData] = useState({
        term_id: '',
        grade_level: '',
        class_name: '',
        subject: '',
    });

    const getData = async () => {
        const data = await fetchAllTermsForTeacher();
        const subjects = await fetchAllSubjectsForAddMarks();
        setTerm(data);
        setSubjects(subjects);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setRecordsData(responseData);
    }, [responseData]);

    const handleEditFormChange = (name: any, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleMarksFormChange = (name: any, value: any) => {
        setMarksForm({ ...marksForm, [name]: value });
    };

    // for input fields
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        handleMarksFormChange(name, value);
    };

    // search by input box
    const handleSearch = (value: string) => {
        setSearch(value);
        const filteredData = responseData.filter(
            (item: any) => item.student_subject.student.full_name.toLowerCase().includes(value.toLowerCase()) || item.student_subject.student.index.toLowerCase().includes(value.toLowerCase())
        );
        setRecordsData(filteredData);
    };

    // For Select components
    const handleSelectChange = (name: string, value: string) => {
        handleEditFormChange(name, value);
    };

    const handleMarks = (record: any) => {
        setAddMarksModal(true);
        setMarksForm({
            mark: record.mark || '',
        });
        setId(record.id);
    };

    const payload = {
        ...formData,
        grade_level: parseInt(formData.grade_level),
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!payload.class_name || !payload.grade_level || !payload.subject || !payload.term_id) {
            toast.error('Please select all the fields');
        } else {
            try {
                const response = await axios.post('/api/class-teacher/enter-marks/', payload);
                if (response.status === 200) {
                    setResponseData(response.data);
                } else {
                    throw new Error('Failed to update item');
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    const handleMarksSubmit = async (e: any) => {
        setIsSubmitting(true);
        e.preventDefault();
        const payloadMarks = {
            ...marksForm,
            mark: parseInt(marksForm.mark),
        };
        try {
            const response = await axios.patch(`/api/class-teacher/enter-marks/${id}`, payloadMarks);
            if (response.status === 200) {
                axios
                    .post('/api/class-teacher/enter-marks/', payload)
                    .then((response) => {
                        setRecordsData(response.data);
                        toast.success('status updated');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                setAddMarksModal(false);
            } else {
                throw new Error('Failed to update password');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // absent
    const handleAbsent = async (record: any) => {
        setIsSubmitting(true);
        try {
            const response = await axios.patch(`/api/class-teacher/enter-marks/absent/${record.id}`);
            if (response.status === 200) {
                axios
                    .post('/api/class-teacher/enter-marks/', payload)
                    .then((response) => {
                        setRecordsData(response.data);
                        toast.success('status updated');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                setAddMarksModal(false);
            } else {
                throw new Error('Failed to update password');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full">
            <div className="mb-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form className="flex flex-row items-center justify-between" onSubmit={handleSubmit}>
                    <Space wrap className="flex flex-row items-center justify-start pl-3 pr-5">
                        <Select style={{ width: 300 }} placeholder="Select Term" onChange={(value) => handleSelectChange('term_id', value)}>
                            {term
                                .sort((a: { term_name: string }, b: { term_name: any }) => a.term_name.localeCompare(b.term_name))
                                .map((data: any, index: any) => (
                                    <Option key={data.term_id} value={data.term_id}>
                                        {data.term_name}
                                    </Option>
                                ))}
                        </Select>

                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Grade"
                            onChange={(value) => handleSelectChange('grade_level', value)}
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
                        />
                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Class"
                            onChange={(value) => handleSelectChange('class_name', value)}
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
                        />
                        <Select placeholder="Select Subject" style={{ width: 300 }} onChange={(value) => handleSelectChange('subject', value)}>
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
                        title="MARKS"
                        key="mark"
                        className="justify-start self-start font-semibold"
                        width={300}
                        render={(_, record: any) => <span>{record.absent ? 'Absent' : record.mark}</span>}
                    />
                    <Column
                        title="ACTION"
                        dataIndex="action"
                        key="action"
                        align="end"
                        className="justify-start self-start font-semibold"
                        render={(_, record: any) => (
                            <Space size="middle">
                                <button disabled={isSubmitting === true} className="h-[30px] w-[80px] rounded-md bg-red-600 p-1 text-xs text-white hover:bg-red-700" onClick={() => handleAbsent(record)}>
                                    Absent
                                </button>
                                <button disabled={isSubmitting === true} className="h-[30px] w-[80px] rounded-md bg-blue-600 p-1 text-xs text-white hover:bg-blue-700" onClick={() => handleMarks(record)}>
                                    Add marks
                                </button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
            <Transition appear show={addMarksModal} as={Fragment}>
                <Dialog as="div" open={addMarksModal} onClose={() => setAddMarksModal(true)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-center justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-[400px] max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-lg font-bold">Add Marks</div>
                                        <button type="button" disabled={isSubmitting === true} onClick={() => setAddMarksModal(false)} className="text-white-dark hover:text-dark">
                                            <BsXLg />
                                        </button>
                                    </div>
                                    <div className="items-center justify-center p-5">
                                        <form className="items-center justify-center space-y-3 dark:text-white" onSubmit={handleMarksSubmit}>
                                            <label>Enter Mark</label>
                                            <div className=" text-white-dark">
                                                <input
                                                    name="mark"
                                                    required
                                                    type='number'
                                                    defaultValue={marksForm.mark || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Marks"
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                            </div>
                                            <div className="flex w-full items-center justify-center pt-2">
                                                <button type="submit" className="w-[130px] items-center justify-center rounded-md bg-green-600 p-1 font-semibold text-white">
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Toaster />
        </div>
    );
};

export default MarksPages;
