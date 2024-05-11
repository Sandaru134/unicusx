'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsPencil, BsXLg } from 'react-icons/bs';

const AccessPage = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [recordsData, setRecordsData] = useState([]);
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editPasswordModal, setEditPasswordModal] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<any>({
        institute: '',
        user: '',
        type: '',
    });
    const [editPassword, setEditPassword] = useState<any>({
        password: '',
        ConfirmPassword: '',
    });

    useEffect(() => {
        setRecordsData(responseData);
    }, [responseData, filteredData]);

    // search box
    const handleSearch = (value: string) => {
        setSearch(value);
        const filteredData = responseData.filter(
            (item: { full_name: string; index: any }) => item.full_name.toLowerCase().includes(value.toLowerCase()) || item.index.toLowerCase().includes(value.toLowerCase())
        );
        setRecordsData(filteredData);
    };

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        handleUpdateFormChange(name, value);
    };

    const handleUpdateFormChange = (name: any, value: any) => {
        setEditPassword({ ...editPassword, [name]: value });
    };

    const handleEditFormChange = (name: any, value: any) => {
        setFilteredData({ ...filteredData, [name]: value });
    };

    // get values from select
    const handleSelectChange = (name: string, value: string) => {
        handleEditFormChange(name, value);
    };

    const handleEdit = (record: any) => {
        setEditPasswordModal(true);
        setId(record);
    };

    const getFilteredData = async (e: any) => {
        e.preventDefault();
        if (!filteredData.institute || !filteredData.user || !filteredData.type) {
            toast.error('Please select all fields');
            return;
        }
        try {
            const response = await axios.post(`/api/unicus-admin/userPassword`, filteredData);
            if (response.status === 200) {
                setResponseData(response.data);
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // update password
    const submitPasswordForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (editPassword.password !== editPassword.ConfirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await axios.patch(`/api/unicus-admin/userPassword/${id}`, {
                password: editPassword.password,
            });
            if (response.status === 200) {
                toast.success('Password updated successfully');
                setEditPasswordModal(false);
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
        <div className="mx-auto">
            <div className="h-[150px] w-full items-center rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={getFilteredData} className="flex flex-row justify-between">
                    <Space wrap className="justify-between gap-12 pl-3">
                        <Select
                            placeholder="Select Institute"
                            style={{ width: 300 }}
                            options={[
                                { value: 'Pre-School', label: 'Pre-School' },
                                { value: 'School', label: 'School' },
                                { value: 'Piriven', label: 'Piriven' },
                            ]}
                            onChange={(value) => handleSelectChange('institute', value)}
                        />
                        <Select
                            placeholder="Type"
                            style={{ width: 300 }}
                            options={[
                                { value: 'Government', label: 'Government' },
                                { value: 'Semi government', label: 'Semi Goverment' },
                                { value: 'International', label: 'International' },
                                { value: 'Private', label: 'Private' },
                            ]}
                            onChange={(value) => handleSelectChange('type', value)}
                        />
                        <Select
                            placeholder="User"
                            style={{ width: 300 }}
                            options={[
                                { value: 'teacher', label: 'Teacher' },
                                { value: 'institute', label: 'Institute' },
                            ]}
                            onChange={(value) => handleSelectChange('user', value)}
                        />
                    </Space>
                    <button className="text-md ml-5 mr-3 w-[130px] rounded-md bg-blue-600 p-2 font-semibold text-white">Filter</button>
                </form>
            </div>
            <div className="mt-3 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 mr-5 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column
                        title="USER"
                        dataIndex="full_name"
                        key="full_name"
                        width="30%"
                        className="justify-start self-start font-semibold"
                        render={(text, record: any) => (
                            <span>
                                {record.institutes && record.institutes.institute_name ? (
                                    <>
                                        <span>{record.full_name}</span>
                                        <span>{record.institutes.institute_name}</span>
                                    </>
                                ) : (
                                    <span>{record.full_name}</span>
                                )}
                            </span>
                        )}
                    />
                    <Column title="US ID" dataIndex="index" key="index" align="left" className="justify-start self-start font-semibold" />
                    <Column
                        title="ACTIONS"
                        dataIndex="index"
                        key="index"
                        align="end"
                        className="justify-start self-start font-semibold"
                        render={(_, record: any) => (
                            <Space size="middle">
                                <button onClick={() => handleEdit(record.index)}>
                                    <BsPencil />
                                </button>
                            </Space>
                        )}
                    />
                </Table>

                <form onSubmit={submitPasswordForm}>
                    <Transition appear show={editPasswordModal} as={Fragment}>
                        <Dialog as="div" open={editPasswordModal} onClose={() => setEditPasswordModal(true)}>
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
                                                <div className="text-lg font-bold">Change Password</div>
                                                <button type="button" disabled={isSubmitting} onClick={() => setEditPasswordModal(false)} className="text-white-dark hover:text-dark">
                                                    <BsXLg />
                                                </button>
                                            </div>
                                            <div className="items-center justify-center p-5">
                                                <form className="items-center justify-center space-y-3 dark:text-white">
                                                    <label>Password</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            name="password"
                                                            onChange={handleInputChange}
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Enter Password"
                                                            className="form-input pr-10 placeholder:text-white-dark"
                                                        />
                                                        <button type="button" className="password-toggle absolute right-2 top-1/2 -translate-y-1/2 transform" onClick={handleTogglePassword}>
                                                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                                        </button>
                                                    </div>

                                                    <label>Confirm Password</label>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            name="ConfirmPassword"
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter Password again"
                                                            className="form-input placeholder:text-white-dark"
                                                        />
                                                        <button type="button" className="password-toggle absolute right-2 top-1/2 -translate-y-1/2 transform" onClick={handleToggleConfirmPassword}>
                                                            {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                                                        </button>
                                                    </div>

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
                </form>
            </div>
            <Toaster />
        </div>
    );
};

export default AccessPage;
