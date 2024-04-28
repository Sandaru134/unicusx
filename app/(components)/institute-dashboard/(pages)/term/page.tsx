'use client';
import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dropdown, Menu, Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsPencil, BsThreeDotsVertical, BsXLg } from 'react-icons/bs';
import { FormSchema } from './constants';
import { z } from 'zod';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAllTerms } from '@/utils';
import useYear from '@/utils/useYear';
import { Option } from 'antd/es/mentions';

const TermPage = () => {
    const [addTermModal, setAddTermModal] = useState<boolean>(false);
    const [updateTermModal, setUpdateTermModal] = useState<boolean>(false);
    const [recordsData, setRecordsData] = useState([]);
    const { data } = useYear();

    const [year, setYear] = useState('');
    const [terms, setTerms] = useState<any>([]);
    const [selectedTerm, setSelectedTerm] = useState<any>('');
    const [updateFormData, setUpdateFormData] = useState({
        term_name: '',
        start: '',
        end: '',
    });

    const toUpdate = async (record: any) => {
        setSelectedTerm(record);
        setUpdateFormData({
            term_name: record.term_name,
            start: record.start,
            end: record.end,
        });
        setUpdateTermModal(true);
    };

    useEffect(() => {
        fetchTerms();
    }, [terms]);

    useEffect(() => {
        setRecordsData(terms);
    }, [terms]);

    const handleEditFormChange = (name: any, value: any) => {
        setUpdateFormData({ ...updateFormData, [name]: value });
    };

    // for input fields
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        handleEditFormChange(name, value);
    };

    // For Select components
    const handleSelectChange = (name: string, value: string) => {
        handleEditFormChange(name, value);
    };

    useEffect(() => {
        const filteredData = terms.filter((item: any) => {
            // Filter based on year
            const yearMatch = !year || year === 'all' ? true : item.start.includes(year) || item.end.includes(year);
            return yearMatch;
        });
        setRecordsData(filteredData);
    }, [year, terms]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            term_name: 'Select Term',
            start: '',
            end: '',
        },
    });

    // create term
    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        try {
            const response = await axios.post('/api/institute-admin/term', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 201) {
                setAddTermModal(false);
                toast.success('Successfully Term created!');
                reset();
            } else {
                throw new Error('Failed to create!');
            }
        } catch (error) {
            toast.error('Failed to create!');
        }
    };

    // update term
    const handleUpdate = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`/api/institute-admin/term/${selectedTerm?.term_id}`, updateFormData);
            if (response.status === 200) {
                fetchAllTerms();
                setUpdateTermModal(false);
                toast.success('Item updated successfully');
            } else {
                throw new Error('Failed to update term');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const items = [
        {
            key: '1',
            label: (
                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsPencil /> Edit
                </a>
            ),
            onClick: (record: any) => toUpdate(record),
        },
    ];

    const fetchTerms = async () => {
        const data = await fetchAllTerms();
        const sortedData = data.sort((a: { start: string }, b: { start: string }) => {
            return new Date(a.start).getTime() - new Date(b.start).getTime();
        });
        setTerms(sortedData);
    };

    return (
        <div className="mx-auto">
            <div className="mb-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="pl-3">
                    <Select defaultValue="Select Year" style={{ width: 300 }} onChange={(value) => setYear(value)}>
                        {data.map((year: any, index) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Space>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <button className="btn mr-5 bg-blue-600 text-white" onClick={() => setAddTermModal(true)}>
                        Add new term
                    </button>
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="TERMS" dataIndex="term_name" key="term_name" className="justify-start self-start font-semibold" />
                    <Column title="START" dataIndex="start" key="start" className="justify-start self-start font-semibold" />
                    <Column title="END" dataIndex="end" key="end" className="justify-start self-start font-semibold" />
                    <Column
                        className="flex justify-end self-end "
                        title="ACTION"
                        key="action"
                        render={(_, record: any) => (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        {items.map((item: any) => (
                                            <Menu.Item key={item.key} onClick={() => item.onClick && item.onClick(record)}>
                                                {item.label}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <a href="/" onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <BsThreeDotsVertical />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}
                    />
                </Table>
            </div>
            <div className="mx-auto">
                {/* add data model */}
                <Transition appear show={addTermModal} as={Fragment}>
                    <Dialog as="div" open={addTermModal} onClose={() => setAddTermModal(true)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
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
                                            <div className="text-lg font-bold">Subject</div>
                                            <button type="button" onClick={() => setAddTermModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                                <label>Select Term</label>
                                                <div className="relative text-white-dark">
                                                    <Space wrap>
                                                        <Select
                                                            style={{ width: 355 }}
                                                            placeholder="Select Term"
                                                            {...register('term_name', { required: true })}
                                                            options={[
                                                                { value: 'First', label: 'First' },
                                                                { value: 'Second', label: 'Second' },
                                                                { value: 'Third', label: 'Third' },
                                                            ]}
                                                            onChange={(value) => setValue('term_name', value)}
                                                        />
                                                    </Space>
                                                    {errors.term_name && <span className="error text-red-500">{errors.term_name.message}</span>}
                                                </div>

                                                <label>Start</label>
                                                <input type="date" {...register('start', { required: true })} placeholder="Enter Date" className="form-input placeholder:text-white-dark" />
                                                {errors.start && <span className="error text-red-500">{errors.start.message}</span>}

                                                <label>End</label>
                                                <input type="date" {...register('end', { required: true })} placeholder="Enter Date" className="form-input placeholder:text-white-dark" />
                                                {errors.end && <span className="error text-red-500">{errors.end.message}</span>}
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
                {/* update form data */}
                <Transition appear show={updateTermModal} as={Fragment}>
                    <Dialog as="div" open={updateTermModal} onClose={() => setAddTermModal(true)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
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
                                            <div className="text-lg font-bold">Subject</div>
                                            <button type="button" onClick={() => setUpdateTermModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white" onSubmit={handleUpdate}>
                                                <label>Select Term</label>
                                                <div className="relative text-white-dark">
                                                    <Space wrap>
                                                        <Select
                                                            style={{ width: 355 }}
                                                            placeholder="First"
                                                            defaultValue={updateFormData.term_name || ''}
                                                            options={[
                                                                { value: 'First', label: 'First' },
                                                                { value: 'Second', label: 'Second' },
                                                                { value: 'Third', label: 'Third' },
                                                            ]}
                                                            onChange={(value) => handleSelectChange('term_name', value)}
                                                        />
                                                    </Space>
                                                </div>

                                                <label>Start</label>
                                                <input
                                                    type="date"
                                                    onChange={handleInputChange}
                                                    name="start"
                                                    required
                                                    defaultValue={updateFormData.start || ''}
                                                    placeholder="Enter Date"
                                                    className="form-input placeholder:text-white-dark"
                                                />

                                                <label>End</label>
                                                <input
                                                    type="date"
                                                    onChange={handleInputChange}
                                                    name="end"
                                                    required
                                                    defaultValue={updateFormData.end || ''}
                                                    placeholder="Enter Date"
                                                    className="form-input placeholder:text-white-dark"
                                                />

                                                <div className="flex w-full items-center justify-center pt-2">
                                                    <button type="submit" className="w-[130px] items-center justify-center rounded-md bg-green-600 p-1 font-semibold text-white">
                                                        Save Change
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
            </div>
            <Toaster />
        </div>
    );
};

export default TermPage;
