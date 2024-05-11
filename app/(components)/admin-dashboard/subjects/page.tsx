'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dropdown, Menu, Modal, Select, Space, Table } from 'antd';
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
import { ExclamationCircleFilled } from '@ant-design/icons';

const SubjectPage = () => {
    const [addSubjectModal, setAddSubjectModal] = useState<boolean>(false);
    const [viewSubjectModal, setViewSubjectModal] = useState<boolean>(false);
    const [editSubjectModal, setEditSubjectModal] = useState<boolean>(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [recordsData, setRecordsData] = useState([]);
    const [subject, setSubject] = useState<any>([]);
    const [instituteType, setInstituteType] = useState('');
    const [category, setCategory] = useState('');

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
            institute_type: '',
            category: '',
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

    const { confirm } = Modal;


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
        setSubject(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setRecordsData(subject);
    }, [subject]);

    useEffect(() => {
        const filterData = () => {
            return subject.filter((item: any) => {
                // Filter based on year
                const instituteTypeMatch = !instituteType || instituteType === 'all' ? true : item.institute_type === instituteType;

                // Filter based on class
                const categoryMatch = !category || category === 'all' ? true : item.category === category;

                return instituteTypeMatch && categoryMatch;
            });
        };
        const searchFilteredData = filterData().filter((item: any) => {
            const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        setRecordsData(searchFilteredData);
    }, [subject, category, instituteType, search]);

    const items = [
        {
            key: '0',
            label: (
                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsEye /> View
                </a>
            ),
            onClick: (record: any) => handleView(record),
        },
        {
            key: '1',
            label: (
                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsPencil /> Edit
                </a>
            ),
            onClick: (record: any) => fetchToUpdate(record),
        },
        {
            key: '2', // Use a unique key here (avoid gaps)
            label: (
                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsTrash fill="red" /> <span className="text-red-500">Delete</span>
                </a>
            ),
            onClick: (record: any) => showConfirm(record.subject_id),
        },
    ];

    // Create Subject
    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        setIsSubmitting(true);
        if (data.institute_type === 'Select Institute' || data.category === 'Select Category' || data.name === '') {
            toast.error('Please fill all fields');
            setIsSubmitting(false);
            return;
        }
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
        } finally {
            setIsSubmitting(false);
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

    const showConfirm = (record: any) => {
        confirm({
            title: 'Do you want to delete this subject?',
            content: "This process can't be undone!",
            centered: true,
            icon: <ExclamationCircleFilled />,
            okType: 'danger',
            okText: 'Delete',
            onOk() {
                handleDelete(record);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
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

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    return (
        <div className="mx-auto">
            <div className="h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="justify-between gap-12 pl-3">
                    <Select
                        placeholder="Select Institute"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'Pre-School', label: 'Pre-School' },
                            { value: 'School', label: 'School' },
                            { value: 'Piriven', label: 'Piriven' },
                        ]}
                        onChange={(value) => setInstituteType(value)}
                    />
                    <Select
                        placeholder="Type"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'Primary', label: 'Primary' },
                            { value: 'Secondary', label: 'Secondary' },
                            { value: 'Collegiate', label: 'Collegiate' },
                        ]}
                        onChange={(value) => setCategory(value)}
                    />
                </Space>
            </div>
            <div className="mt-3 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 mr-5 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                    <button className="btn bg-blue-600 text-white" onClick={() => setAddSubjectModal(true)}>
                        Add new subject
                    </button>
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="SUBJECT" dataIndex="name" key="name" className="justify-start self-start font-semibold" />
                    <Column
                        className="flex justify-end self-end "
                        title="ACTIONS"
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
                                                <button type="button" onClick={() => setAddSubjectModal(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-center p-5">
                                                <form className="items-center justify-center space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
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
                                                            placeholder="Institute Type"
                                                            style={{ width: 355 }}
                                                            {...register('institute_type', { required: true })}
                                                            options={[
                                                                { value: 'Pre-School', label: 'Pre-School' },
                                                                { value: 'School', label: 'School' },
                                                                { value: 'Piriven', label: 'Piriven' },
                                                            ]}
                                                            onChange={(value) => setValue('institute_type', value)}
                                                        />
                                                        {errors.institute_type && <span className="error text-red-500">{errors.institute_type.message}</span>}
                                                    </Space>
                                                    <label>Category</label>
                                                    <Space wrap>
                                                        <Select
                                                            placeholder="Select Category"
                                                            style={{ width: 355 }}
                                                            {...register('category', { required: true })}
                                                            options={[
                                                                { value: 'Primary', label: 'Primary' },
                                                                { value: 'Secondary', label: 'Secondary' },
                                                                { value: 'Collegiate', label: 'Collegiate' },
                                                            ]}
                                                            onChange={(value) => setValue('category', value)}
                                                        />
                                                        {errors.category && <span className="error text-red-500">{errors.category.message}</span>}
                                                    </Space>
                                                    <div className="flex w-full items-center justify-center pt-2">
                                                        <button
                                                            disabled={isSubmitting}
                                                            type="submit"
                                                            className="w-[130px] items-center justify-center rounded-md bg-green-600 p-1 font-semibold text-white"
                                                        >
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
                                                            defaultValue={updateFormData.name.split('-')[0]}
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
                                                                { value: 'Pre-School', label: 'Pre-School' },
                                                                { value: 'School', label: 'School' },
                                                                { value: 'Piriven', label: 'Piriven' },
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
                                                                { value: 'Primary', label: 'Primary' },
                                                                { value: 'Secondary', label: 'Secondary' },
                                                                { value: 'Collegiate', label: 'Collegiate' },
                                                            ]}
                                                            onChange={(value) => handleSelectChange('category', value)}
                                                        />
                                                    </Space>
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
            </div>
            <Toaster />
        </div>
    );
};

export default SubjectPage;
