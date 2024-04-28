'use client';
import React, { useEffect, useState } from 'react';
import { BsXLg } from 'react-icons/bs';
import { Button, Form, Input, Menu, Modal, Select, Space, Table, Tag } from 'antd';
const { Column, ColumnGroup } = Table;
import { Dropdown } from 'antd';
import { BsThreeDotsVertical, BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';
import * as z from 'zod';
import toast, { Toaster } from 'react-hot-toast';

import { fetchInstitutes, handleInstituteDelete } from '@/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const FormSchema = z.object({
    institute_name: z.string().min(1, 'Name is required').optional(),
    gender: z.string().optional(),
    institute_type: z.string().optional(),
    type: z.string().optional(),
    from: z.number().optional(),
    to: z.number().optional(),
    contact_number: z
        .string()
        .min(1, 'Contact number is required')
        .max(10, 'Contact number must contain 10 digits')
        .transform((str) => {
            const parsedContactNumber = parseInt(str, 10);
            if (isNaN(parsedContactNumber)) {
                throw new Error('Invalid contact number. Must be a valid integer.');
            }
            return parsedContactNumber;
        })
        .optional(),
    password: z.string().min(1, 'Password is required').optional(),
});

const InstituteRegistration = () => {
    const [institute, setInstitute] = useState<any>([]);
    const [recordsData, setRecordsData] = useState([]);
    const [search, setSearch] = useState('');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState<any>([]);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [type, setType] = useState('');
    const [instituteType, setInstituteType] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [updateModalView, setUpdateModalView] = useState(false);
    const [formData, setFormData] = useState({
        institute_name: '',
        contact_number: '',
        gender: '',
        institute_type: '',
        type: '',
        from: '',
        to: '',
    });

    const fetchData = async () => {
        const data = await fetchInstitutes();
        setInstitute(data);
    };

    useEffect(() => {
        fetchData();
    }, [institute]);

    useEffect(() => {
        setRecordsData(institute);
    }, [institute]);

    useEffect(() => {
        const filterData = () => {
            return institute.filter((item: any) => {
                // Filter based on year
                const instituteTypeMatch = !instituteType || instituteType === 'all' ? true : item.institute_type === instituteType;

                // Filter based on class
                const typeMatch = !type || type === 'all' ? true : item.type === type;

                return instituteTypeMatch && typeMatch;
            });
        };
        const searchFilteredData = filterData().filter((item: any) => {
            const searchMatch = item.institute_name.toLowerCase().includes(search.toLowerCase()) || item.institute_admin?.index.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        setRecordsData(searchFilteredData);
    }, [institute, type, instituteType, search]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            institute_name: '',
            contact_number: undefined,
            gender: 'Select Gender',
            type: 'Select Type',
            from: 0,
            to: 0,
            password: '',
        },
    });

    // Handle delete function
    const handleDelete = async (recordId: any) => {
        try {
            await handleInstituteDelete(recordId);
            fetchData(); // Refetch data after successful deletion
        } catch (error) {
            toast.error('Failed to delete record!');
        }
    };

    const handleView = async (recordId: any) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/unicus-admin/institute/${recordId}`);
            setSelectedInstitute(response.data);
            setViewModalVisible(true);
        } catch (error) {
            toast.error('Error fetching institute details');
        } finally {
            setLoading(false);
        }
    };

    const fetchToUpdate = async (recordId: any) => {
        setSelectedItem(recordId);
        setFormData({
            institute_name: recordId.institute_name,
            contact_number: recordId.contact_number,
            gender: recordId.gender,
            institute_type: recordId.institute_type,
            type: recordId.type,
            from: recordId.from,
            to: recordId.to,
        });
        setUpdateModalView(true);
    };

    const handleEditFormChange = (name: string, value: string | number) => {
        if (name === 'from' || name === 'to' || name === 'contact_number') {
            value = parseInt(value as string); // Parse value as integer
        }
        setFormData({ ...formData, [name]: value });
    };

    // For input fields
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        handleEditFormChange(name, value);
    };

    // For Select components
    const handleSelectChange = (name: string, value: string) => {
        handleEditFormChange(name, value);
    };

    const submitUpdateForm = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.patch(`/api/unicus-admin/institute/${selectedItem?.institute_id}`, formData);
            if (response.status === 201) {
                toast.success('Item updated successfully');
                setUpdateModalView(false);
                reset();
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error) {
            toast.error('Error updating institute details:');
        } finally {
            setLoading(false);
        }
    };

    const items = [
        {
            key: '0',
            label: (
                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsEye /> View
                </a>
            ),
            onClick: (recordId: any) => handleView(recordId.institute_id), // Pass record.id directly
        },
        {
            key: '1',
            label: (
                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsPencil /> Edit
                </a>
            ),
            onClick: (recordId: any) => fetchToUpdate(recordId), // Pass record.id directly
        },
        {
            key: '2', // Use a unique key here (avoid gaps)
            label: (

                <a type="text" className="flex w-[100px] flex-row items-center gap-3">
                    <BsTrash fill='red' /> <span className='text-red-500'>Delete</span>
                </a>
            ),
            onClick: (recordId: { institute_id: any }) => handleDelete(recordId.institute_id), // Pass record.id directly
        },
    ];

    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        const contactNumber = String(data['contact_number']); // Convert to string
        if (!/^\d{9}$/.test(contactNumber)) {
            toast.error('Contact number must have exactly 10 digits!');
            return;
        }
        try {
            const response = await axios.post('/api/unicus-admin/institute', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 201) {
                toast.success('Successfully created!');
                fetchData(); // Refetch data after successful creation
                setEditModalVisible(false);
                reset();
            } else {
                throw new Error('Failed to create!');
            }
        } catch (error) {
            toast.error('Failed to create!');
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mx-auto">
            <div className="h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="gap-6 pl-3">
                    <Select
                        defaultValue="Select School"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'preSchool', label: 'Pre-School' },
                            { value: 'school', label: 'School' },
                            { value: 'piriven', label: 'Piriven' },
                        ]}
                        onChange={(value) => setInstituteType(value)}
                    />
                    <Select
                        defaultValue="Type"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'government', label: 'Government' },
                            { value: 'semi government', label: 'Semi government' },
                            { value: 'international', label: 'International' },
                            { value: 'Private', label: 'Private' },
                        ]}
                        onChange={(value) => setType(value)}
                    />
                </Space>
            </div>
            <div className="mt-3 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 mr-5 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                    <button className="btn bg-blue-600 text-white" onClick={() => setEditModalVisible(true)}>
                        Add new institute
                    </button>
                </div>
                <Table dataSource={recordsData} className="bg-white md:ml-5 md:mr-5">
                    <Column title="USER" dataIndex="institute_name" key="institute_name" width="30%" className="font-semibold" />
                    <Column title="US ID" dataIndex={['institute_admin', 'index']} key="institute_initial" className="font-semibold" />
                    <Column
                        className="flex justify-end self-end "
                        title="ACTION"
                        key="action"
                        render={(_: any, record: any) => (
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

                {/* popup for add school */}
                <div className="mx-auto">
                    <Transition appear show={editModalVisible} as={Fragment}>
                        <Dialog as="div" open={editModalVisible} onClose={() => setEditModalVisible(true)}>
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
                                                <div className="text-lg font-bold">Institute</div>
                                                <button type="button" onClick={() => setEditModalVisible(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <form className="space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                                    <label>Name</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            {...register('institute_name')} // Use register for form field binding
                                                            placeholder="Enter Institute Name"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                        {errors.institute_name && <span className="error text-red-500">{errors.institute_name.message}</span>}
                                                    </div>
                                                    <label>Gender</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="Select Gender"
                                                            style={{ width: 355 }}
                                                            {...register('gender')}
                                                            options={[
                                                                { value: 'boys', label: 'Boys' },
                                                                { value: 'girls', label: 'Girls' },
                                                                { value: 'boys/girls', label: 'Boys/Girls' },
                                                                { value: 'monks', label: 'Monks' },
                                                                { value: 'monks boys', label: 'Monks Boys' },
                                                            ]}
                                                            onChange={(value) => setValue('gender', value)}
                                                        />
                                                    </Space>
                                                    <label>Institute</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="Select School"
                                                            style={{ width: 355 }}
                                                            {...register('institute_type')}
                                                            options={[
                                                                { value: 'preSchool', label: 'Pre-School' },
                                                                { value: 'school', label: 'School' },
                                                                { value: 'piriven', label: 'Piriven' },
                                                            ]}
                                                            onChange={(value) => setValue('institute_type', value)}
                                                        />
                                                    </Space>
                                                    <label htmlFor="gender">Type</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="Select Type"
                                                            style={{ width: 355 }}
                                                            {...register('type')}
                                                            options={[
                                                                { value: 'government', label: 'Government' },
                                                                { value: 'semiGov', label: 'Semi Government' },
                                                                { value: 'international', label: 'International' },
                                                                { value: 'Private', label: 'Private' },
                                                            ]}
                                                            onChange={(value) => setValue('type', value)}
                                                        />
                                                    </Space>
                                                    <label>From</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="From"
                                                            style={{ width: 355 }}
                                                            {...register('from')}
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
                                                            onChange={(value) => setValue('from', Number(value))}
                                                        />
                                                    </Space>
                                                    <label htmlFor="gender">To</label>
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="To"
                                                            style={{ width: 355 }}
                                                            {...register('to')}
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
                                                            onChange={(value) => setValue('to', Number(value))}
                                                        />
                                                    </Space>
                                                    <label>Contact Number</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            {...register('contact_number')} // Use register for form field binding
                                                            placeholder="Enter contact number"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                        {errors.contact_number && <span className="error text-red-500">{errors.contact_number.message}</span>}
                                                    </div>
                                                    <label>Institute Password</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            {...register('password')} // Use register for form field binding
                                                            placeholder="Enter password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                        <button type="button" className="password-toggle absolute right-2 top-1/2 -translate-y-1/2 transform" onClick={handleTogglePassword}>
                                                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                                        </button>
                                                        {errors.password && <span className="error text-red-500">{errors.password.message}</span>}
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

                    {/* View institute details */}

                    <Transition appear show={viewModalVisible} as={Fragment}>
                        <Dialog as="div" open={viewModalVisible} onClose={() => setViewModalVisible(true)}>
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
                                                <div className="text-lg font-bold">Institute</div>
                                                <button type="button" onClick={() => setViewModalVisible(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <form className="space-y-3 dark:text-white">
                                                    <label>Name</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            id="institute_name"
                                                            type="text"
                                                            value={selectedInstitute?.institute_name || ''}
                                                            readOnly
                                                            placeholder="Enter User ID"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                    </div>
                                                    <label>Gender</label>
                                                    <input
                                                        id="gender"
                                                        type="text"
                                                        value={selectedInstitute?.gender || ''}
                                                        readOnly
                                                        placeholder="Enter User ID"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                    <label>Institute</label>
                                                    <input
                                                        id="institute_type"
                                                        type="text"
                                                        value={selectedInstitute?.institute_type || ''}
                                                        readOnly
                                                        placeholder="Enter User ID"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                    <label htmlFor="gender">Type</label>
                                                    <input
                                                        id="type"
                                                        type="text"
                                                        value={selectedInstitute?.type || ''}
                                                        readOnly
                                                        placeholder="Enter User ID"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                    <label>From</label>
                                                    <input
                                                        id="from"
                                                        type="text"
                                                        value={selectedInstitute?.from || ''}
                                                        readOnly
                                                        placeholder="Enter User ID"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                    <label htmlFor="gender">To</label>
                                                    <input
                                                        id="to"
                                                        type="text"
                                                        value={selectedInstitute?.to || ''}
                                                        readOnly
                                                        placeholder="Enter User ID"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                    <label>Contact Number</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            id="contact_number"
                                                            type="text"
                                                            value={selectedInstitute?.contact_number || ''}
                                                            readOnly
                                                            placeholder="Enter User ID"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* update modal */}

                    <Transition appear show={updateModalView} as={Fragment}>
                        <Dialog as="div" open={updateModalView} onClose={() => setUpdateModalView(true)}>
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
                                                <div className="text-lg font-bold">Institute</div>
                                                <button type="button" onClick={() => setUpdateModalView(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <form className="space-y-3 dark:text-white" onSubmit={submitUpdateForm}>
                                                    <label>Name</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            defaultValue={formData.institute_name}
                                                            name="institute_name"
                                                            placeholder="Enter institute name"
                                                            className="form-input placeholder:text-white-dark"
                                                            onChange={handleInputChange}
                                                        />
                                                        {errors.institute_name && <span className="error text-red-500">{errors.institute_name.message}</span>}
                                                    </div>
                                                    <label>Gender</label>
                                                    <Space wrap>
                                                        <Select
                                                            placeholder="Select Gender" // Provide a generic placeholder
                                                            style={{ width: 355 }}
                                                            options={[
                                                                { value: 'boys', label: 'Boys' },
                                                                { value: 'girls', label: 'Girls' },
                                                                { value: 'boys/girls', label: 'Boys/Girls' },
                                                                { value: 'monks', label: 'Monks' },
                                                                { value: 'monks boys', label: 'Monks Boys' },
                                                            ]}
                                                            onChange={(value) => handleSelectChange('gender', value)} // Pass name and value
                                                            value={formData.gender} // Bind the value to formData.gender
                                                        />
                                                    </Space>
                                                    <label>Institute</label>
                                                    <Space wrap>
                                                        <Select
                                                            value={formData.institute_type}
                                                            style={{ width: 355 }}
                                                            options={[
                                                                { value: 'preSchool', label: 'pre-School' },
                                                                { value: 'school', label: 'School' },
                                                                { value: 'piriven', label: 'Piriven' },
                                                            ]}
                                                            onChange={(value) => handleSelectChange('institute_type', value)}
                                                        />
                                                    </Space>
                                                    <label htmlFor="gender">Type</label>
                                                    <Space wrap>
                                                        <Select
                                                            value={formData.type}
                                                            style={{ width: 355 }}
                                                            onChange={(value) => handleSelectChange('type', value)}
                                                            options={[
                                                                { value: 'gov', label: 'Gov' },
                                                                { value: 'semiGov', label: 'Semi gov' },
                                                                { value: 'international', label: 'International' },
                                                                { value: 'Private', label: 'Private' },
                                                            ]}
                                                        />
                                                    </Space>
                                                    <label>From</label>
                                                    <Space wrap>
                                                        <Select
                                                            value={formData.from}
                                                            style={{ width: 355 }}
                                                            onChange={(value) => handleSelectChange('from', value)}
                                                            options={[
                                                                { value: '1', label: '1' },
                                                                { value: '2', label: '2' },
                                                                { value: '3', label: '3' },
                                                            ]}
                                                        />
                                                    </Space>
                                                    <label htmlFor="gender">To</label>
                                                    <Space wrap>
                                                        <Select
                                                            value={formData.to}
                                                            style={{ width: 355 }}
                                                            onChange={(value) => handleSelectChange('to', value)}
                                                            options={[
                                                                { value: '1', label: '1' },
                                                                { value: '2', label: '2' },
                                                                { value: '3', label: '3' },
                                                            ]}
                                                        />
                                                    </Space>
                                                    <label>Contact Number</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            type="number"
                                                            name="contact_number"
                                                            maxLength={10}
                                                            defaultValue={formData.contact_number}
                                                            placeholder="Enter contact number"
                                                            className="form-input placeholder:text-white-dark"
                                                            onChange={handleInputChange}
                                                        />
                                                        {errors.contact_number && <span className="error text-red-500">{errors.contact_number.message}</span>}
                                                    </div>
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
        </div>
    );
};

export default InstituteRegistration;
