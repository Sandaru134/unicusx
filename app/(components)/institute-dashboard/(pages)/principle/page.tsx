'use client';
import React, { Fragment, useEffect, useState } from 'react';
import StatisticsPage from '../../components/statistics';
import { Dropdown, Menu, Select, Space, Table, Tag } from 'antd';
import { BsEye, BsPencil, BsThreeDotsVertical, BsXLg } from 'react-icons/bs';
import Column from 'antd/es/table/Column';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from './constants';
import { z } from 'zod';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAllPrincipals } from '@/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Option } from 'antd/es/mentions';
import useYear from '@/utils/useYear';
import CustomButton from '@/components/button';

const PrincipalPage = () => {
    const [addPrincipalModal, setAddPrincipalModal] = useState<boolean>(false);
    const [viewPrincipalModal, setViewPrincipalModal] = useState<boolean>(false);
    const [updatePrincipalModal, setUpdatePrincipalModal] = useState<boolean>(false);

    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [search, setSearch] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data } = useYear();

    const [principals, setPrincipals] = useState<any>([]);
    const [selectedPrincipal, setSelectedPrincipal] = useState<any>([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [viewFormData, setViewFormData] = useState({
        full_name: '',
        gender: '',
        type: '',
        grade: '',
        nic: '',
        contact_number: undefined,
    });
    const [updateFormData, setUpdateFormData] = useState({
        full_name: '',
        gender: '',
        grade: '',
        type: '',
        nic: '',
        contact_number: '',
    });
    const toUpdate = async (record: any) => {
        setSelectedPrincipal(record);
        setUpdateFormData({
            full_name: record.full_name || '',
            gender: record.gender || '',
            grade: record.grade || '',
            type: record.type || '',
            nic: record.nic || '',
            contact_number: record.contact_number || '',
        });
        setUpdatePrincipalModal(true);
    };

    const handleView = (record: any) => {
        setViewFormData({
            full_name: record.full_name,
            gender: record.gender,
            type: record.type,
            grade: record.grade || '',
            nic: record.nic || '',
            contact_number: record.contact_number || '',
        });
        setViewPrincipalModal(true);
    };

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            full_name: '',
            gender: '',
            grade: undefined,
            nic: '',
            contact_number: undefined,
        },
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

    const fetchPrincipals = async () => {
        const data = await fetchAllPrincipals();
        setPrincipals(data);
    };

    useEffect(() => {
        fetchPrincipals();
    }, []);

    useEffect(() => {
        setRecordsData(principals);
    }, [principals]);

    // filter by dropdown
    useEffect(() => {
        const filterData = () => {
            return principals.filter((item: any) => {
                // Filter based on year
                const yearMatch = !year || year === 'all' ? true : item.createdAt.includes(year);

                // Filter based on class
                const typeMatch = !type || type === 'all' ? true : item.type === type;

                return yearMatch && typeMatch;
            });
        };

        const searchFilteredData = filterData().filter((item: any) => {
            const searchMatch = item.full_name.toLowerCase().includes(search.toLowerCase()) || item.index.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        setRecordsData(searchFilteredData);
    }, [principals, type, year, search]);

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
            onClick: (record: any) => toUpdate(record),
        },
    ];

    // Create Principal
    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        if (!data.full_name || !data.gender || !data.grade || !data.nic || !data.contact_number) {
            toast.error('Please fill all the fields!');
            return;
        } else {
            // Check if contact number has exactly 10 digits
            const contactNumber = String(data['contact_number']); // Convert to string
            if (!/^\d{9}$/.test(contactNumber)) {
                toast.error('Contact number must have exactly 10 digits!');
                return;
            }

            setIsSubmitting(true);

            try {
                const response = await axios.post('/api/institute-admin/principal', data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.status === 201) {
                    toast.success('Successfully Principal created!');
                    fetchPrincipals();
                    setAddPrincipalModal(false);
                    reset();
                } else {
                    throw new Error('Failed to create!');
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    //  update principal
    const handleUpdate = async (e: any) => {
        e.preventDefault();
        const updatedFormData = {
            ...updateFormData,
            contact_number: parseInt(updateFormData.contact_number),
        };
        try {
            const response = await axios.patch(`/api/institute-admin/principal/${selectedPrincipal?.principal_id}`, updatedFormData);
            if (response.status === 200) {
                toast.success('Principal updated successfully');
                fetchPrincipals();
                setUpdatePrincipalModal(false);
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
        <div className="mx-auto w-full">
            <div className="py-4">
                <StatisticsPage />
            </div>
            <div className="mb-3 mt-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="gap-12 pl-3">
                    <Select placeholder="Select Year" style={{ width: 300 }} onChange={(value) => setYear(value)}>
                        {data.map((year: any, index) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        style={{ width: 300 }}
                        placeholder="Select User"
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'Principal', label: 'Principal' },
                            { value: 'Deputy', label: 'Deputy' },
                            { value: 'Assistant', label: 'Assistant' },
                        ]}
                        onChange={(value) => setType(value)}
                    />
                </Space>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                    <button className="btn mr-5 bg-blue-600 text-white" onClick={() => setAddPrincipalModal(true)}>
                        Add new principal
                    </button>
                </div>

                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="USER" dataIndex="full_name" key="full_name" className="justify-start self-start font-semibold" width={300} />
                    <Column title="US ID" dataIndex="index" key="index" className="justify-start self-start font-semibold" width={300} />
                    <Column
                        title="TYPE"
                        dataIndex="student_type"
                        key="type"
                        className="justify-start self-start font-semibold"
                        render={(text, record: any) => (
                            <div>
                                {record.type === 'Principal' && <CustomButton title="Principal" width="26" textColor="text-teal-500" color="bg-teal-100" bgColor="" />}
                                {record.type === 'Deputy' && <CustomButton title="Deputy" width="26" textColor="text-green-600" color="bg-green-100" bgColor="" />}
                                {record.type === 'Assistant' && <CustomButton title="Assistant" width="26" textColor="text-orange-400" color="bg-orange-100" bgColor="" />}
                            </div>
                        )}
                    />
                    <Column
                        className="flex justify-end self-end "
                        title="ACTIONS"
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
                {/* add student modal */}
                <Transition appear show={addPrincipalModal} as={Fragment}>
                    <Dialog as="div" open={addPrincipalModal} onClose={() => setAddPrincipalModal(true)}>
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
                                            <div className="text-lg font-bold">Add user</div>
                                            <button disabled={isSubmitting} type="button" onClick={() => setAddPrincipalModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        {...register('full_name')} // Use register for form field binding
                                                        placeholder="Enter Name"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                    {errors.full_name && <span className="error text-red-500">{errors.full_name.message}</span>}
                                                </div>

                                                <label>Select Gender</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Gender"
                                                        {...register('gender', { required: true })}
                                                        options={[
                                                            { value: 'Male', label: 'Male' },
                                                            { value: 'Female', label: 'Female' },
                                                            { value: 'Other', label: 'Other' },
                                                        ]}
                                                        onChange={(value) => setValue('gender', value)}
                                                    />
                                                    {errors.gender && <span className="error text-red-500">{errors.gender.message}</span>}
                                                </Space>

                                                <label>Type</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Type"
                                                        {...register('type', { required: true })}
                                                        options={[
                                                            { value: 'Principal', label: 'Principal' },
                                                            { value: 'Deputy', label: 'Deputy' },
                                                            { value: 'Assistant', label: 'Assistant' },
                                                        ]}
                                                        onChange={(value) => setValue('type', value)}
                                                    />
                                                    {errors.type && <span className="error text-red-500">{errors.type.message}</span>}
                                                </Space>

                                                <label>Grade</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Grade"
                                                        {...register('grade', { required: true })}
                                                        options={[
                                                            { value: '1 st', label: '1 st' },
                                                            { value: '2 nd', label: '2 nd' },
                                                            { value: '3 rd', label: '3 rd' },
                                                        ]}
                                                        onChange={(value) => setValue('grade', value)}
                                                    />
                                                    {errors.grade && <span className="error text-red-500">{errors.grade.message}</span>}
                                                </Space>

                                                <label>NIC Number</label>
                                                <input {...register('nic')} placeholder="Enter NIC" className="form-input placeholder:text-white-dark" />
                                                {errors.nic && <span className="error text-red-500">{errors.nic.message}</span>}

                                                <label>Contact Number</label>
                                                <input
                                                    {...register('contact_number', { valueAsNumber: true })}
                                                    type="tel"
                                                    placeholder="Enter Contact Number"
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                                {errors.contact_number && <span className="error text-red-500">{errors.contact_number.message}</span>}

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

                {/* view principal modal */}
                <Transition appear show={viewPrincipalModal} as={Fragment}>
                    <Dialog as="div" open={viewPrincipalModal} onClose={() => setViewPrincipalModal(true)}>
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
                                            <div className="text-lg font-bold">User</div>
                                            <button type="button" onClick={() => setViewPrincipalModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white">
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input defaultValue={viewFormData.full_name || ''} readOnly className="form-input placeholder:text-white-dark" />
                                                </div>
                                                <label>Gender</label>
                                                <input defaultValue={viewFormData.gender || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Type</label>
                                                <input defaultValue={viewFormData.type || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Grade</label>
                                                <input defaultValue={viewFormData.grade || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label> NIC Number</label>
                                                <input defaultValue={viewFormData.nic || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Contact Number</label>
                                                <input defaultValue={viewFormData.contact_number || ''} readOnly className="form-input placeholder:text-white-dark" />
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                {/* Update Principal Modal */}
                <Transition appear show={updatePrincipalModal} as={Fragment}>
                    <Dialog as="div" open={updatePrincipalModal} onClose={() => setUpdatePrincipalModal(true)}>
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
                                            <div className="text-lg font-bold">Add user</div>
                                            <button type="button" onClick={() => setUpdatePrincipalModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white" onSubmit={handleUpdate}>
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        defaultValue={updateFormData.full_name || ''}
                                                        onChange={handleInputChange}
                                                        name="full_name"
                                                        placeholder="Enter Name"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                </div>

                                                <label>Select Gender</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Gender"
                                                        defaultValue={updateFormData.gender || ''}
                                                        options={[
                                                            { value: 'Male', label: 'Male' },
                                                            { value: 'Female', label: 'Female' },
                                                            { value: 'Other', label: 'Other' },
                                                        ]}
                                                        onChange={(value) => handleSelectChange('gender', value)}
                                                    />
                                                </Space>

                                                <label>Type</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Type"
                                                        defaultValue={updateFormData.type || ''}
                                                        options={[
                                                            { value: 'Principal', label: 'Principal' },
                                                            { value: 'Deputy', label: 'Deputy' },
                                                            { value: 'Assistant', label: 'Assistant' },
                                                        ]}
                                                        onChange={(value) => handleSelectChange('type', value)}
                                                    />
                                                </Space>

                                                <label>Grade</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Grade"
                                                        defaultValue={updateFormData.grade || ''}
                                                        options={[
                                                            { value: '1 st', label: '1 st' },
                                                            { value: '2 nd', label: '2 nd' },
                                                            { value: '3 rd', label: '3 rd' },
                                                        ]}
                                                        onChange={(value) => handleSelectChange('grade', value)}
                                                    />
                                                </Space>

                                                <label>NIC Number</label>
                                                <input
                                                    defaultValue={updateFormData.nic || ''}
                                                    onChange={handleInputChange}
                                                    name="nic"
                                                    placeholder="Enter NIC"
                                                    className="form-input placeholder:text-white-dark"
                                                />

                                                <label>Contact Number</label>
                                                <input
                                                    defaultValue={updateFormData.contact_number || ''}
                                                    onChange={handleInputChange}
                                                    name="contact_number"
                                                    type="tel"
                                                    placeholder="Enter Contact Number"
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

export default PrincipalPage;
