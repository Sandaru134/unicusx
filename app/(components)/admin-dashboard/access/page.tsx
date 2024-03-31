'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Button, Select, Space, Table } from 'antd';
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
    }, [responseData,filteredData]);

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

    // const getSubjectDataIndex = (record: { student_name: any; subject: any }) => {
    //     if (record.student_name) {
    //         return record.student_name;
    //     } else if (record.subject) {
    //         return record.subject;
    //     } else {
    //         return 'N/A'; // or whatever default value you prefer
    //     }
    // };

    // const renderParentTeacherNameColumn = (text: any, record: { student_index: any; teacherName: any }) => {
    //     if (record.student_index) {
    //         return record.student_index;
    //     } else if (record.teacherName) {
    //         return record.teacherName;
    //     } else {
    //         return 'N/A'; // or whatever default value you prefer
    //     }
    // };

    // const columns = [
    //     {
    //         title: 'Name',
    //         key: 'subject',
    //         width: '20%',
    //         className: 'justify-start self-start font-semibold',
    //         render: (text: any, record: any) => <span>{getSubjectDataIndex(record)}</span>,
    //     },
    //     {
    //         title: 'US ID',
    //         key: 'parentTeacherName',
    //         className: 'justify-start self-start font-semibold',
    //         align: 'left', // Add this line,
    //         render: renderParentTeacherNameColumn,
    //     },
    //     {
    //         title: 'Action',
    //         className: 'justify-end self-end font-semibold',
    //         align: 'right',
    //         key: 'action',
    //         render: (_: any, record: { student_index: any }) => (
    //             <Space size="middle">
    //                 <button onClick={() => handleEdit(record.student_index)}>
    //                     <BsPencil />
    //                 </button>
    //             </Space>
    //         ),
    //     },
    // ];

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // update password
    const submitPasswordForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Password:', editPassword.password);
        console.log('Confirm Password:', editPassword.ConfirmPassword);

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
        }
    };

    return (
        <div className="mx-auto">
            <div className="h-[150px] w-full items-center rounded-md bg-white">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={getFilteredData}>
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
                            onChange={(value) => handleSelectChange('institute', value)}
                        />
                        <Select
                            defaultValue="User"
                            style={{ width: 355 }}
                            options={[
                                { value: 'all', label: 'All' },
                                { value: 'student', label: 'Student' },
                                { value: 'teacher', label: 'Teacher' },
                                { value: 'principle', label: 'Principle' },
                            ]}
                            onChange={(value) => handleSelectChange('user', value)}
                        />
                        <Select
                            defaultValue="Type"
                            style={{ width: 355 }}
                            options={[
                                { value: 'all', label: 'All' },
                                { value: 'government', label: 'Government' },
                                { value: 'semi government', label: 'Semi Goverment' },
                                { value: 'private', label: 'Private' },
                                { value: 'international', label: 'International' },
                            ]}
                            onChange={(value) => handleSelectChange('type', value)}
                        />
                    </Space>
                    <button className="text-md ml-5 w-[150px] rounded-md bg-blue-600 p-2 font-semibold text-white">Filter</button>
                </form>
            </div>
            <div className="mt-5 bg-white">
                <div className="mx-auto flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    <input className="form-input h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                {/* <Table className="items-center justify-between bg-white md:ml-5 md:mr-5" dataSource={responseData} columns={columns} /> */}
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="User" dataIndex="full_name" key="full_name" width="30%" className="justify-start self-start font-semibold" />
                    <Column title="US ID" dataIndex="index" key="index" align="left" className="justify-start self-start font-semibold" />
                    <Column
                        title="US ID"
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
                                                <div className="text-lg font-bold">Change Password</div>
                                                <button type="button" onClick={() => setEditPasswordModal(false)} className="text-white-dark hover:text-dark">
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

                                                    <button type="submit" className="w-[130px] items-center rounded-md bg-green-600 p-1 font-semibold text-white">
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
                </form>
            </div>
            <Toaster />
        </div>
    );
};

export default AccessPage;
