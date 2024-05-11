'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Fragment, useEffect, useState } from 'react';
import { BsEye, BsPencil, BsThreeDotsVertical, BsXLg } from 'react-icons/bs';
import { z } from 'zod';
import { class_name, FormSchema, grade } from './constants';
import { useForm } from 'react-hook-form';
import { Dropdown, Menu, Select, Space, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import { Dialog, Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { fetchAllStudents } from '@/utils';
import StatisticsPage from '../../components/statistics';
import { Option } from 'antd/es/mentions';
import useYear from '@/utils/useYear';
import CustomButton from '@/components/button';

const StudentRegistrationPage = () => {
    const [addStudentModal, setAddStudentModal] = useState<boolean>(false);
    const [viewStudentModal, setViewStudentModal] = useState<boolean>(false);
    const [updateStudentModal, setUpdateStudentModal] = useState<boolean>(false);

    const [year, setYear] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [className, setClassName] = useState('');
    const [search, setSearch] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data } = useYear();

    const [selectedStudent, setSelectedStudent] = useState<any>('');
    const [recordsData, setRecordsData] = useState<any>([]);
    const [students, setStudents] = useState<any>([]);
    const [viewFormData, setViewFormData] = useState({
        full_name: '',
        gender: '',
        date_of_birth: '',
        grade: '',
        class_name: '',
        medium: '',
        nic: '',
        guardian_nic: '',
        contact_number: '',
    });
    const [updateFormData, setUpdateFormData] = useState({
        full_name: '',
        gender: '',
        date_of_birth: '',
        grade: '',
        class_name: '',
        medium: '',
        nic: '',
        guardian_nic: '',
        contact_number: '',
    });

    const toUpdate = async (record: any) => {
        setSelectedStudent(record);
        setUpdateFormData({
            full_name: record.full_name || '',
            gender: record.gender || '',
            date_of_birth: record.date_of_birth || '',
            grade: record.classes?.grade_level || '',
            class_name: record.classes?.class_name || '',
            medium: record.medium || '',
            nic: record.nic || '',
            guardian_nic: record.guardian_nic || '',
            contact_number: record.contact_number || '',
        });
        setUpdateStudentModal(true);
    };

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
            date_of_birth: '',
            grade: undefined,
            class_name: '',
            medium: '',
            nic: '',
            guardian_nic: '',
            contact_number: undefined,
        },
    });

    const fetchStudents = async () => {
        const data = await fetchAllStudents();
        setStudents(data);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        setRecordsData(students);
    }, []);

    const handleView = (record: any) => {
        setViewFormData({
            full_name: record.full_name,
            gender: record.gender,
            date_of_birth: record.date_of_birth,
            grade: record.classes?.grade_level || '',
            class_name: record.classes?.class_name || '',
            medium: record.medium || '',
            nic: record.nic || '',
            guardian_nic: record.guardian_nic || '',
            contact_number: record.contact_number || '',
        });
        setViewStudentModal(true);
    };

    // filter by dropdown
    useEffect(() => {
        const filterData = () => {
            return students.filter((item: any) => {
                // Filter based on year
                const yearMatch = !year || year === 'all' ? true : item.createdAt.includes(year);

                // Filter based on grade
                const gradeMatch = !gradeLevel || gradeLevel === 'all' ? true : item.classes?.grade_level.toString() === gradeLevel;

                // Filter based on class
                const classMatch = !className || className === 'all' ? true : item.classes?.class_name === className;

                return yearMatch && gradeMatch && classMatch;
            });
        };

        const searchFilteredData = filterData().filter((item: any) => {
            const searchMatch =
                item.full_name.toLowerCase().includes(search.toLowerCase()) ||
                item.index.toLowerCase().includes(search.toLowerCase()) ||
                item.date_of_birth.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        setRecordsData(searchFilteredData);
    }, [students, year, gradeLevel, className, search]);

    // create student
    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/institute-admin/student', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 201) {
                fetchStudents();
                setAddStudentModal(false);
                toast.success('Successfully Student created!');
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

    //  update student
    const handleUpdate = async (e: any) => {
        e.preventDefault();
        const updatedFormData = {
            ...updateFormData,
            grade: parseInt(updateFormData.grade),
            contact_number: parseInt(updateFormData.contact_number),
        };
        try {
            const response = await axios.patch(`/api/institute-admin/student/${selectedStudent?.student_id}`, updatedFormData);
            if (response.status === 200) {
                toast.success('Student updated successfully');
                fetchStudents();
                setUpdateStudentModal(false);
                reset();
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
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
                    <Select placeholder="Select Grade" style={{ width: 300 }} onChange={(value) => setGradeLevel(value)}>
                        {grade.map((value, index) => (
                            <Option key={value} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>

                    <Select placeholder="Select Class" style={{ width: 300 }} onChange={(value) => setClassName(value)}>
                        {class_name.map((value, index) => (
                            <Option key={value} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </Space>
            </div>

            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                    <button className="btn mr-5 bg-blue-600 text-white" onClick={() => setAddStudentModal(true)}>
                        Add new student
                    </button>
                </div>

                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="USER" dataIndex="full_name" key="full_name" width={400} className="items-center justify-center font-semibold" />
                    <Column title="US ID" dataIndex="index" key="index" width={400} className="items-center justify-center font-semibold" />
                    <Column
                        title="STUDENT"
                        dataIndex="student_type"
                        width={400}
                        key="student_type"
                        className="justify-start self-start font-semibold"
                        render={(text, record: any) => (
                            <div>
                                {record.student_type === 'Kindergarten' && <CustomButton title='Kindergarten' width='26' textColor='text-red-600' color='bg-red-100' bgColor='' />}
                                {record.student_type === 'Primary' && <CustomButton title='Primary' width='26' textColor='text-orange-500' color='bg-orange-100' bgColor='' />}
                                {record.student_type === 'Senior Secondary' && <CustomButton title='Senior Secondary' width='26' textColor='text-blue-700' color='bg-blue-100' bgColor='' />}
                                {record.student_type === 'Junior Secondary' && <CustomButton title='Junior Secondary' width='26' textColor='text-green-600' color='bg-green-100' bgColor='' />}
                                {record.student_type === 'Collegiate' && <CustomButton title='Collegiate' width='26' textColor='text-fuchsia-600' color='bg-fuchsia-100' bgColor='' />}
                            </div>
                        )}
                    />
                    <Column title="MEDIUM" dataIndex="medium" key="medium" className="justify-start self-start font-semibold" width={400} />
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
                <Transition appear show={addStudentModal} as={Fragment}>
                    <Dialog as="div" open={addStudentModal} onClose={() => setAddStudentModal(true)}>
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
                                            <div className="text-lg font-bold">Add user</div>
                                            <button disabled={isSubmitting} type="button" onClick={() => setAddStudentModal(false)} className="text-white-dark hover:text-dark">
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
                                                <label>Birthday</label>
                                                <input type="date" {...register('date_of_birth', { required: true })} placeholder="Enter Date" className="form-input placeholder:text-white-dark" />
                                                {errors.date_of_birth && <span className="error text-red-500">{errors.date_of_birth.message}</span>}
                                                <label>Grade</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Grade"
                                                        {...register('grade', { required: true })}
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
                                                        onChange={(value) => setValue('grade', parseInt(value, 10))}
                                                    />
                                                    {errors.grade && <span className="error text-red-500">{errors.grade.message}</span>}
                                                </Space>
                                                <label>Class</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Class"
                                                        {...register('class_name', { required: true })}
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
                                                        onChange={(value) => setValue('class_name', value)}
                                                    />
                                                    {errors.class_name && <span className="error text-red-500">{errors.class_name.message}</span>}
                                                </Space>
                                                <label>Medium</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Medium"
                                                        {...register('medium', { required: true })}
                                                        options={[
                                                            { value: 'Sinhala', label: 'Sinhala' },
                                                            { value: 'English', label: 'English' },
                                                            { value: 'Tamil', label: 'Tamil' },
                                                        ]}
                                                        onChange={(value) => setValue('medium', value)}
                                                    />
                                                    {errors.medium && <span className="error text-red-500">{errors.medium.message}</span>}
                                                </Space>
                                                <label>Student&apos;s NIC No</label>
                                                <input {...register('nic')} placeholder="Enter NIC" className="form-input placeholder:text-white-dark" />
                                                {errors.nic && <span className="error text-red-500">{errors.nic.message}</span>}
                                                <label>Guardian&apos;s NIC No</label>
                                                <input {...register('guardian_nic')} placeholder="Enter Guardian NIC" className="form-input placeholder:text-white-dark" />
                                                {errors.guardian_nic && <span className="error text-red-500">{errors.guardian_nic.message}</span>}
                                                <label>Contact Number</label>
                                                <input
                                                    {...register('contact_number', { valueAsNumber: true })}
                                                    type="tel"
                                                    placeholder="Enter Contact Number"
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                                {errors.contact_number && <span className="error text-red-500">{errors.contact_number.message}</span>}
                                                <div className="flex w-full items-center justify-center pt-2">
                                                    <button disabled={isSubmitting} type="submit" className="w-[130px] items-center justify-center rounded-md bg-green-600 p-1 font-semibold text-white">
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

                {/* view student modal */}
                <Transition appear show={viewStudentModal} as={Fragment}>
                    <Dialog as="div" open={viewStudentModal} onClose={() => setViewStudentModal(true)}>
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
                                            <div className="text-lg font-bold">User</div>
                                            <button type="button" onClick={() => setViewStudentModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input defaultValue={viewFormData.full_name || ''} readOnly className="form-input placeholder:text-white-dark" />
                                                </div>
                                                <label>Gender</label>
                                                <input defaultValue={viewFormData.gender || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Birthday</label>
                                                <input defaultValue={viewFormData.date_of_birth || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Grade</label>
                                                <input defaultValue={viewFormData.grade || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Class</label>
                                                <input defaultValue={viewFormData.class_name || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Medium</label>
                                                <input defaultValue={viewFormData.medium || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Student&apos;s NIC No</label>
                                                <input defaultValue={viewFormData.nic || ''} readOnly className="form-input placeholder:text-white-dark" />

                                                <label>Guardian&apos;s NIC No</label>
                                                <input defaultValue={viewFormData.guardian_nic || ''} readOnly className="form-input placeholder:text-white-dark" />

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

                {/* update student modal */}
                <Transition appear show={updateStudentModal} as={Fragment}>
                    <Dialog as="div" open={updateStudentModal} onClose={() => setUpdateStudentModal(true)}>
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
                                            <div className="text-lg font-bold">Add user</div>
                                            <button disabled={isSubmitting} type="button" onClick={() => setUpdateStudentModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="flex flex-col space-y-3 dark:text-white" onSubmit={handleUpdate}>
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        defaultValue={updateFormData.full_name || ''}
                                                        name="full_name"
                                                        onChange={handleInputChange}
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
                                                    {errors.gender && <span className="error text-red-500">{errors.gender.message}</span>}
                                                </Space>
                                                <label>Birthday</label>
                                                <input
                                                    type="date"
                                                    defaultValue={updateFormData.date_of_birth || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Date"
                                                    className="form-input placeholder:text-white-dark"
                                                />

                                                <label>Grade</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Grade"
                                                        defaultValue={updateFormData.grade || ''}
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
                                                        onChange={(value) => handleSelectChange('grade', value)}
                                                    />
                                                </Space>
                                                <label>Class</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Class"
                                                        defaultValue={updateFormData.class_name || ''}
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
                                                        onChange={(value) => handleSelectChange('class_name', value)}
                                                    />
                                                </Space>
                                                <label>Medium</label>
                                                <Space wrap>
                                                    <Select
                                                        style={{ width: 355 }}
                                                        placeholder="Select Medium"
                                                        defaultValue={updateFormData.medium || ''}
                                                        options={[
                                                            { value: 'Sinhala', label: 'Sinhala' },
                                                            { value: 'English', label: 'English' },
                                                            { value: 'Tamil', label: 'Tamil' },
                                                        ]}
                                                        onChange={(value) => handleSelectChange('medium', value)}
                                                    />
                                                </Space>
                                                <label>Student&apos;s NIC No</label>
                                                <input
                                                    defaultValue={updateFormData.nic || ''}
                                                    name="nic"
                                                    onChange={handleInputChange}
                                                    placeholder="Enter NIC"
                                                    className="form-input placeholder:text-white-dark"
                                                />

                                                <label>Guardian&apos;s NIC No</label>
                                                <input
                                                    defaultValue={updateFormData.guardian_nic || ''}
                                                    name="guardian_nic"
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Guardian NIC"
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                                <label>Contact Number</label>
                                                <input
                                                    defaultValue={updateFormData.contact_number || ''}
                                                    name="contact_number"
                                                    onChange={handleInputChange}
                                                    type="tel"
                                                    placeholder="Enter Contact Number"
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                                <div className="flex w-full items-center justify-center pt-2">
                                                    <button disabled={isSubmitting} type="submit" className="w-[130px] items-center justify-center rounded-md bg-green-600 p-1 font-semibold text-white">
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

export default StudentRegistrationPage;
