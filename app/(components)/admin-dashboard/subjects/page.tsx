'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dropdown, Menu, Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import React, { Fragment, useEffect, useState } from 'react';
import { BsEye, BsPencil, BsThreeDotsVertical, BsTrash, BsXLg } from 'react-icons/bs';
import { FormSchema } from './constants';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { fetchSubject, handleSubjectDelete } from '@/utils';

const SubjectPage = () => {
    const [addSubjectModal, setAddSubjectModal] = useState<boolean>(false);
    const [viewSubjectModal, setViewSubjectModal] = useState<boolean>(false);
    const [editSubjectModal, setEditSubjectModal] = useState<boolean>(false);

    const [recordsData, setRecordsData] = useState([]);
    const [subject, setSubject] = useState<any>([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedSubType, setSelectedSubType] = useState('');
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            institute_type: 'Select Institute',
            category: 'Select Category',
        },
    });

    const [viewFormData, setViewFormData] = useState({
        name: '',
        institute_type: '',
        category: '',
    });

    const [updateFormData, setUpdateFormData] = useState({
        name: '',
        institute_type: '',
        category: '',
    });

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

    const fetchToUpdate = async (record: { name: any; institute_type: any; category: any }) => {
        setSelectedSubject(record);
        setUpdateFormData({
            name: record.name,
            institute_type: record.institute_type,
            category: record.category,
        });
        setEditSubjectModal(true);
    };

    const fetchData = async () => {
        const data = await fetchSubject();
        console.log("subject data",data);
        setSubject(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setRecordsData(subject);
    }, [subject]);

    // filter base on dropdowns
    useEffect(() => {
        const filteredData = subject.filter((item: { institute_type: string; category: string }) => {
            // Show all if no filters selected
            if ((!selectedType || selectedType === 'all') && (!selectedSubType || selectedSubType === 'all')) {
                return true;
            }

            // Filter based on the first dropdown selection
            const typeMatch = selectedType && selectedType !== 'all' ? item.institute_type === selectedType : true;

            // Filter based on the second dropdown selection
            const subTypeMatch = selectedSubType && selectedSubType !== 'all' ? item.category === selectedSubType : true;

            return typeMatch && subTypeMatch;
        });
        setRecordsData(filteredData);
    }, [subject, selectedType, selectedSubType]);
    

    // search box
    const handleSearch = (value: string) => {
        setSearch(value);
        const filteredData = subject.filter((item: { name: string }) => item.name.toLowerCase().includes(value.toLowerCase()));
        setRecordsData(filteredData);
    };

    const items = [
        {
            key: '0',
            label: (
                <Button type="text" className="flex flex-row items-center gap-3">
                    <BsEye /> View
                </Button>
            ),
            onClick: (record: any) => handleView(record),
        },
        {
            key: '1',
            label: (
                <Button type="text" className="flex flex-row items-center gap-3">
                    <BsPencil /> Edit
                </Button>
            ),
            onClick: (record: any) => fetchToUpdate(record),
        },
        {
            key: '2', // Use a unique key here (avoid gaps)
            label: (
                <Button type="text" danger className="flex w-[150px] flex-row items-center gap-3">
                    <BsTrash /> Delete
                </Button>
            ),
            onClick: (record: any) => handleDelete(record.subject_id),
        },
    ];

  
    // Create Subject
    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        try {
            const response = await axios.post('/api/unicus-admin/subject', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 201) {
                setAddSubjectModal(false);
                toast.success('Successfully subject created!');
                fetchData();
                reset();
            } else {
                throw new Error('Failed to create!');
            }
        } catch (error) {
            toast.error('Failed to create!');
        }
    };

    // view subject
    const handleView = async (record: { name: any; institute_type: any; category: any }) => {
        setViewFormData({
            name: record.name,
            institute_type: record.institute_type,
            category: record.category,
        });
        setViewSubjectModal(true);
    };

    // Delete Subject
    const handleDelete = async (record: any) => {
        try {
            await handleSubjectDelete(record);
            fetchData(); // Refetch data after successful deletion
        } catch (error) {
            toast.error('Failed to delete record!');
        }
    };

    // Handle Update
    const handleUpdate = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`/api/unicus-admin/subject/${selectedSubject?.subject_id}`, updateFormData);
            if (response.status === 200) {
                toast.success('Item updated successfully');
                fetchData();
                setEditSubjectModal(false);
                reset();
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="mx-auto">
            <div className="h-[150px] w-full rounded-md bg-white">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="pl-3">
                    <Select
                        defaultValue="Select School"
                        style={{ width: 355 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'preSchool', label: 'pre-School' },
                            { value: 'school', label: 'School' },
                            { value: 'piriven', label: 'Piriven' },
                        ]}
                        onChange={(value) => setSelectedType(value)}
                    />
                    <Select
                        defaultValue="Type"
                        style={{ width: 355 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'primary', label: 'Primary' },
                            { value: 'secondary', label: 'Secondary' },
                            { value: 'collegiate', label: 'Collegiate' },
                        ]}
                        onChange={(value) => setSelectedSubType(value)}
                    />
                </Space>
            </div>
            <div className="mt-5 bg-white">
                <div className="mx-auto flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    <input className="form-input h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                    <button className="btn bg-blue-600 text-white" onClick={() => setAddSubjectModal(true)}>
                        Add new subject
                    </button>
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="Subject" dataIndex="name" key="name" className="justify-start self-start font-semibold" />
                    <Column
                        className="flex justify-end self-end "
                        title="Action"
                        key="action"
                        render={(_, record: any) => (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        {items.map((item) => (
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
                <div className="mx-auto">
                    {/* Add subject */}
                    <Transition appear show={addSubjectModal} as={Fragment}>
                        <Dialog as="div" open={addSubjectModal} onClose={() => setAddSubjectModal(true)}>
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
                                <div className="flex min-h-screen items-start justify-center px-4">
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
                                                <button type="button" onClick={() => setAddSubjectModal(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <form className="space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                                    <label>Subject Name</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            {...register('name')} // Use register for form field binding
                                                            placeholder="Enter Subject Name"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                        {errors.name && <span className="error text-red-500">{errors.name.message}</span>}
                                                    </div>
                                                    <label>Institute Type</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="Institute Type"
                                                            style={{ width: 355 }}
                                                            {...register('institute_type')}
                                                            options={[
                                                                { value: 'preSchool', label: 'pre-School' },
                                                                { value: 'school', label: 'School' },
                                                                { value: 'piriven', label: 'Piriven' },
                                                            ]}
                                                            onChange={(value) => setValue('institute_type', value)}
                                                        />
                                                    </Space>
                                                    <label>Category</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="Select Category"
                                                            style={{ width: 355 }}
                                                            {...register('category')}
                                                            options={[
                                                                { value: 'primary', label: 'Primary' },
                                                                { value: 'secondary', label: 'Secondary' },
                                                                { value: 'collegiate', label: 'Collegiate' },
                                                            ]}
                                                            onChange={(value) => setValue('category', value)}
                                                        />
                                                    </Space>
                                                    <button type="submit" className="bg-green-600 w-[130px] rounded-md p-1 text-white font-semibold items-center">
                                                        Save
                                                    </button>
                                                </form>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* view subject */}
                    <Transition appear show={viewSubjectModal} as={Fragment}>
                        <Dialog as="div" open={viewSubjectModal} onClose={() => setViewSubjectModal(true)}>
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
                                <div className="flex min-h-screen items-start justify-center px-4">
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
                                                <button type="button" onClick={() => setViewSubjectModal(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <form className="space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                                    <label>Subject Name</label>
                                                    <div className="relative text-white-dark">
                                                        <input readOnly defaultValue={viewFormData.name} placeholder="Enter Ssubject Name" className="form-input placeholder:text-white-dark" />
                                                    </div>
                                                    <label>Institute Type</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            readOnly
                                                            defaultValue={viewFormData.institute_type}
                                                            placeholder="Enter Ssubject Name"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                    </div>
                                                    <label>Category</label>
                                                    <div className="relative text-white-dark">
                                                        <input readOnly defaultValue={viewFormData.category} placeholder="Enter Ssubject Name" className="form-input placeholder:text-white-dark" />
                                                    </div>
                                                </form>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* Update Subject */}
                    <Transition appear show={editSubjectModal} as={Fragment}>
                        <Dialog as="div" open={editSubjectModal} onClose={() => setEditSubjectModal(true)}>
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
                                <div className="flex min-h-screen items-start justify-center px-4">
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
                                                <button type="button" onClick={() => setEditSubjectModal(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <form className="space-y-3 dark:text-white" onSubmit={handleUpdate}>
                                                    <label>Subject Name</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            name="name"
                                                            defaultValue={updateFormData.name}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter Subject Name"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                    </div>
                                                    <label>Institute Type</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue={updateFormData.institute_type}
                                                            style={{ width: 355 }}
                                                            options={[
                                                                { value: 'preSchool', label: 'pre-School' },
                                                                { value: 'school', label: 'School' },
                                                                { value: 'piriven', label: 'Piriven' },
                                                            ]}
                                                            onChange={(value) => handleSelectChange('institute_type', value)}
                                                        />
                                                    </Space>
                                                    <label>Category</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue={updateFormData.category}
                                                            style={{ width: 355 }}
                                                            options={[
                                                                { value: 'primary', label: 'Primary' },
                                                                { value: 'secondary', label: 'Secondary' },
                                                                { value: 'collegiate', label: 'Collegiate' },
                                                            ]}
                                                            onChange={(value) => handleSelectChange('category', value)}
                                                        />
                                                    </Space>
                                                    <button type="submit" className="bg-green-600 w-[130px] rounded-md p-1 text-white font-semibold items-center">
                                                        Save Changes
                                                    </button>
                                                </form>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default SubjectPage;
