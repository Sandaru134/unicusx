'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Button, Dropdown, Menu, Select, Space, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import React, { Fragment, useEffect, useState } from 'react';
import { BsEye, BsPencil, BsThreeDotsVertical, BsXLg } from 'react-icons/bs';
import SubjectTeacher from './components/subjectTeacher';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAllTeachers, fetchSubjectForTeacher } from '@/utils';
import UpdateSubjectTeacher from './components/updateSubjectTeacher';
import ViewSubjectTeacher from './components/viewSubjectTeacher';
import StatisticsPage from '../../components/statistics';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Option } from 'antd/es/mentions';
import useYear from '@/utils/useYear';

interface SelectedValues {
    grade: any;
    class: any;
    medium: any;
    subject: any;
}

const TeacherRegitrationPage = () => {
    const [AddTeacherModal, setAddTeacherModal] = useState<boolean>(false);
    const [updateTeacherModal, setUpdateTeacherModal] = useState<boolean>(false);
    const [viewTeachersModal, setViewTeachersModal] = useState<boolean>(false);

    const [year, setYear] = useState('');
    const [user, setUser] = useState('');
    const [teacherClass, setTeacherClass] = useState('');
    const [grader, setGrader] = useState('');
    const [search, setSearch] = useState('');

    const { data } = useYear();

    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [nic, setNic] = useState('');
    const [grade, setGrade] = useState('');
    const [password, setPassword] = useState('');
    const [sClass, setSclass] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [selectedValuesFromChild, setSelectedValuesFromChild] = useState<SelectedValues[]>([]);
    const [selectedValues, setSelectedValues] = useState<SelectedValues[]>([]);
    const [fetchSubjectData, setFetchSubjectData] = useState<any>([]);
    const [teachers, setTeachers] = useState<any>([]);
    const [recordsData, setRecordsData] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState<any>('');

    const [updateFormData, setUpdateFormData] = useState<any>({
        full_name: '',
        gender: '',
        class_name: '',
        grade: '',
        nic: '',
        contact_number: '',
    });
    const [formData, setFormData] = useState<any>({
        full_name: '',
        gender: '',
        class_name: '',
        grade: '',
        nic: '',
        contact_number: '',
    });

    const fetchToUpdate = async (record: any) => {
        setSelectedTeacher(record);
        setUpdateFormData({
            name: record.full_name,
            gender: record.gender,
            nic: record.nic,
            contact: record.contact_number,
            grade: record.class?.grade_level || '',
            class: record.class?.class_name || '',
        });
        setUpdateTeacherModal(true);
    };

    const handleView = (record: any) => {
        setSelectedTeacher(record);
        setFormData({
            name: record.full_name,
            gender: record.gender,
            nic: record.nic,
            contact: record.contact_number,
            grade: record.class?.grade_level || '',
            class: record.class?.class_name || '',
        });
        setViewTeachersModal(true);
    };

    const handleEditFormChange = (name: any, value: any) => {
        setUpdateFormData({ ...updateFormData, [name]: value });
    };

    // for input fields
    const handleInputChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        // Parse numeric inputs to integers
        const numericValue = name === 'contactNumber' ? parseInt(value) : value;
        handleEditFormChange(name, numericValue);
    };

    // For Select components
    const handleSelectChange = (name: string, value: string) => {
        // Parse numeric inputs to integers
        const numericValue = name === 'grade' ? parseInt(value) : value;
        handleEditFormChange(name, numericValue);
    };

    const handleValuesFromChild = (values: SelectedValues[]) => {
        setSelectedValuesFromChild(values);
    };

    const fetchData = async () => {
        const data = await fetchSubjectForTeacher();
        setFetchSubjectData(data);
    };

    const fetchTeachers = async () => {
        const data = await fetchAllTeachers();
        setTeachers(data);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // dropdown filer and search box

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    useEffect(() => {
        fetchData();
        fetchTeachers();
    }, [teachers]);

    useEffect(() => {
        setRecordsData(teachers);
    }, [teachers]);

    const parsedContactNumber = parseInt(contactNumber);
    const parsedGrade = parseInt(grade);

    const postData: any = {
        nic: nic,
        password: password,
        full_name: name,
        gender: gender,
        grade: parsedGrade,
        class_name: sClass,
        subjects_teacher: selectedValuesFromChild,
        contact_number: parsedContactNumber,
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
            onClick: (record: any) => fetchToUpdate(record),
        },
    ];

    const clearFields = () => {
        setYear('');
        setUser('');
        setGrader('');
        setTeacherClass('');
        setName('');
        setNic('');
        setPassword('');
        setSclass('');
        setContactNumber('');
        setSelectedValuesFromChild([]);
        setSelectedValues([]);
    };

    // create teacher
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const requiredFields = ['nic', 'password', 'full_name', 'gender', 'subjects_teacher', 'contact_number'];
        const allRequiredValuesExist = requiredFields.every((field) => {
            return postData[field] !== undefined && postData[field] !== null && postData[field] !== '';
        });

        if (!allRequiredValuesExist || postData.subjects_teacher.length === 0) {
            toast.error('Please fill in all required fields!');
            return;
        } else {
            // Check if contact number has exactly 10 digits
            const contactNumber = postData['contact_number'];
            if (!/^\d{9}$/.test(contactNumber)) {
                toast.error('Contact number must have exactly 10 digits!');
                return;
            }

            try {
                // Convert contactNumber to integer
                const response = await axios.post('/api/institute-admin/teacher', postData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.status === 201) {
                    setAddTeacherModal(false);
                    clearFields();
                    fetchTeachers();
                    toast.success('Successfully teacher created!');
                } else {
                    throw new Error('Failed to create!');
                }
            } catch (error) {
                toast.error('Failed to create!');
            }
        }
    };

    //  update user
    const handleUpdate = async (e: any) => {
        e.preventDefault();
        try {
            const payload = {
                ...updateFormData,
                subjects_teacher: selectedValues,
            };

            const response = await axios.patch(`/api/institute-admin/teacher/${selectedTeacher.teacher_id}`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                setUpdateTeacherModal(false);
                fetchTeachers();
                toast.success('Successfully updated teacher!');
            } else {
                throw new Error('Failed to update teacher!');
            }
        } catch (error) {
            toast.error('Failed to update teacher!');
        }
    };

    console.log(recordsData);

    useEffect(() => {
        const filterData = () => {
            return teachers.filter((item: any) => {
                // Filter based on year
                const yearMatch = !year || year === 'all' ? true : item.createdAt.includes(year);

                // Filter based on user (subject_teacher or class_teacher)
                const userMatch = !user || user === 'all' ? true : item[user];

                // Filter based on grade
                const gradeMatch =
                    !grader || grader === 'all' ? true : item.class?.grade_level.toString() === grader || item.teacher_subjects?.some((subject: { class: { grade_level: { toString: () => string; }; }; }) => subject.class.grade_level.toString() === grader);

                // Filter based on class
                const classMatch =
                    !teacherClass || teacherClass === 'all' ? true : item.class?.class_name === teacherClass || item.teacher_subjects?.some((subject: { class: { class_name: string; }; }) => subject.class.class_name === teacherClass);

                return yearMatch && userMatch && gradeMatch && classMatch;
            });
        };

        const searchFilteredData = filterData().filter((item: any) => {
            const searchMatch = item.full_name.toLowerCase().includes(search.toLowerCase()) || item.index.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        setRecordsData(searchFilteredData);
    }, [teachers, year, user, grader, teacherClass, search]);

    return (
        <div className="mx-auto w-full">
            <div className="py-4">
                <StatisticsPage />
            </div>

            {/* search filter */}
            <div className="mb-3 mt-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <Space wrap className="flex flex-row items-center justify-between pl-5 pr-5">
                    <Select defaultValue="Year" style={{ width: 300 }} onChange={(value) => setYear(value)}>
                        {data.map((year: any, index: any) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        defaultValue="User"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'subject_teacher', label: 'Subject Teacher' },
                            { value: 'class_teacher', label: 'Class Teacher' },
                        ]}
                        onChange={(value) => setUser(value)}
                    />
                    <Select
                        defaultValue="Grade"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
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
                        onChange={(value) => setGrader(value)}
                    />
                    <Select
                        defaultValue="Class"
                        style={{ width: 300 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'A', label: 'A' },
                            { value: 'B', label: 'B' },
                            { value: 'C', label: 'C' },
                            { value: 'D', label: 'D' },
                            { value: 'E', label: 'E' },
                            { value: 'F', label: 'F' },
                            { value: 'G', label: 'G' },
                            { value: 'H', label: 'H' },
                        ]}
                        onChange={(value) => setTeacherClass(value)}
                    />
                </Space>
            </div>

            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                    <button className="btn mr-5 bg-blue-600 text-white" onClick={() => setAddTeacherModal(true)}>
                        Add new teacher
                    </button>
                </div>
                <Table className="justify-between bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="USER" dataIndex="full_name" key="full_name" className="justify-start self-start font-semibold" width={300} />
                    <Column title="US ID" dataIndex="index" key="index" className="justify-start self-start font-semibold" width={300} />
                    <Column
                        title="TYPE"
                        dataIndex="type"
                        key="type"
                        className="justify-start self-start font-semibold"
                        render={(text, record: any) => (
                            <div>
                                {record.class_teacher && <Tag color="pink">Class Teacher</Tag>}
                                {record.subject_teacher && <Tag color="orange">Subject Teacher</Tag>}
                            </div>
                        )}
                        width={300}
                    />
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
                {/* add teacher modal */}
                <Transition appear show={AddTeacherModal} as={Fragment}>
                    <Dialog as="div" open={AddTeacherModal} onClose={() => setAddTeacherModal(true)}>
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
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAddTeacherModal(false);
                                                    clearFields();
                                                }}
                                                className="text-white-dark hover:text-dark"
                                            >
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-3 dark:text-white" onSubmit={handleSubmit}>
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input placeholder="Enter Name" className="form-input placeholder:text-white-dark" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                                <label>Gender</label>
                                                <Space wrap>
                                                    <Select
                                                        defaultValue="Gender"
                                                        style={{ width: 355 }}
                                                        onChange={(value) => setGender(value)}
                                                        options={[
                                                            { value: 'Male', label: 'Male' },
                                                            { value: 'Female', label: 'Female' },
                                                            { value: 'Other', label: 'Other' },
                                                        ]}
                                                    />
                                                </Space>
                                                <label>Class Teacher</label>
                                                <Space wrap>
                                                    <Select
                                                        defaultValue="Select Grade"
                                                        style={{ width: 355 }}
                                                        onChange={(value) => setGrade(value)}
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
                                                        defaultValue="Select Class"
                                                        style={{ width: 355 }}
                                                        options={[
                                                            { value: 'A', label: 'A' },
                                                            { value: 'B', label: 'B' },
                                                            { value: 'C', label: 'C' },
                                                            { value: 'D', label: 'D' },
                                                            { value: 'E', label: 'E' },
                                                            { value: 'F', label: 'F' },
                                                            { value: 'G', label: 'G' },
                                                        ]}
                                                        onChange={(value) => setSclass(value)}
                                                    />
                                                </Space>

                                                <label>Subject Teacher</label>
                                                <SubjectTeacher onValuesChange={handleValuesFromChild} />
                                                <label>NIC Number</label>
                                                <div className="relative text-white-dark">
                                                    <input placeholder="Enter NIC" className="form-input placeholder:text-white-dark" value={nic} onChange={(e) => setNic(e.target.value)} />
                                                </div>
                                                <label>Contact Number</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        maxLength={11}
                                                        placeholder="Enter Contact Number"
                                                        type="number"
                                                        className="form-input placeholder:text-white-dark"
                                                        value={contactNumber}
                                                        onChange={(e) => setContactNumber(e.target.value)}
                                                    />
                                                </div>
                                                <label>Password</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        name="password"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter Password"
                                                        className="form-input pr-10 placeholder:text-white-dark"
                                                    />
                                                    <button type="button" className="password-toggle absolute right-2 top-1/2 -translate-y-1/2 transform" onClick={handleTogglePassword}>
                                                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                                    </button>
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
                {/* update modal */}
                <Transition appear show={updateTeacherModal} as={Fragment}>
                    <Dialog as="div" open={updateTeacherModal} onClose={() => setUpdateTeacherModal(true)}>
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
                                            <button type="button" onClick={() => setUpdateTeacherModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-3 dark:text-white" onSubmit={handleUpdate}>
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        required
                                                        placeholder="Enter Name"
                                                        name="name"
                                                        onChange={handleInputChange}
                                                        defaultValue={updateFormData.name || ''}
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                </div>
                                                <label>Gender</label>
                                                <Space wrap>
                                                    <Select
                                                        placeholder="Select Gender"
                                                        onChange={(value) => handleSelectChange('gender', value)}
                                                        style={{ width: 355 }}
                                                        defaultValue={updateFormData.gender || ''}
                                                        options={[
                                                            { value: 'Male', label: 'Male' },
                                                            { value: 'Female', label: 'Female' },
                                                            { value: 'Other', label: 'Other' },
                                                        ]}
                                                    />
                                                </Space>
                                                <label>Class Teacher</label>
                                                <Space wrap>
                                                    <Select
                                                        defaultValue={updateFormData.grade || 'Select Grade'}
                                                        style={{ width: 355 }}
                                                        onChange={(value) => handleSelectChange('grade', value)}
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
                                                        defaultValue={updateFormData.class || 'Select Class'}
                                                        style={{ width: 355 }}
                                                        options={[
                                                            { value: 'A', label: 'A' },
                                                            { value: 'B', label: 'B' },
                                                            { value: 'C', label: 'C' },
                                                            { value: 'D', label: 'D' },
                                                            { value: 'E', label: 'E' },
                                                            { value: 'F', label: 'F' },
                                                            { value: 'G', label: 'G' },
                                                        ]}
                                                        onChange={(value) => handleSelectChange('class_name', value)}
                                                    />
                                                </Space>

                                                <label>Subject Teacher</label>
                                                <UpdateSubjectTeacher selectedRecord={selectedTeacher} selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
                                                <label>NIC Number</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        required
                                                        placeholder="Enter NIC"
                                                        name="nic"
                                                        onChange={handleInputChange}
                                                        defaultValue={updateFormData.nic || ''}
                                                        className="form-input placeholder:text-white-dark"
                                                    />
                                                </div>
                                                <label>Contact Number</label>
                                                <div className="relative text-white-dark">
                                                    <input
                                                        required
                                                        name="contactNumber"
                                                        placeholder="Enter Contact Number"
                                                        onChange={handleInputChange}
                                                        defaultValue={updateFormData.contact || ''}
                                                        type="number"
                                                        className="form-input placeholder:text-white-dark"
                                                    />
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
                {/* view teacher modal */}
                <Transition appear show={viewTeachersModal} as={Fragment}>
                    <Dialog as="div" open={viewTeachersModal} onClose={() => setViewTeachersModal(true)}>
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
                                            <button type="button" onClick={() => setViewTeachersModal(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-3 dark:text-white">
                                                <label>Name</label>
                                                <div className="relative text-white-dark">
                                                    <input placeholder="Enter Name" readOnly name="name" defaultValue={formData.name || ''} className="form-input placeholder:text-white-dark" />
                                                </div>
                                                <label>Gender</label>

                                                <input readOnly className="form-input placeholder:text-white-dark" defaultValue={formData.gender || ''} />

                                                <label>Class Teacher</label>

                                                <input readOnly defaultValue={formData.grade || 'N/A'} className="form-input placeholder:text-white-dark" />
                                                <input readOnly defaultValue={formData.class || 'N/A'} className="form-input placeholder:text-white-dark" />

                                                <label>Subject Teacher</label>
                                                <ViewSubjectTeacher selectedRecord={selectedTeacher} selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
                                                <label>NIC Number</label>
                                                <div className="relative text-white-dark">
                                                    <input readOnly placeholder="Enter NIC" name="nic" defaultValue={formData.nic || ''} className="form-input placeholder:text-white-dark" />
                                                </div>
                                                <label>Contact Number</label>
                                                <div className="relative text-white-dark">
                                                    <input readOnly defaultValue={formData.contact || ''} className="form-input placeholder:text-white-dark" />
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

export default TeacherRegitrationPage;
