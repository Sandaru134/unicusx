'use client';
import { class_name, grade_level } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Select, Space, Table, Tag } from 'antd';
import { Option } from 'antd/es/mentions';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import Image from 'next/image';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsXLg } from 'react-icons/bs';
import { FaDownload } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import ReactDOM from 'react-dom';
import useGrade from '@/utils/useGrade';
import useClass from '@/utils/useClass';

const SignPage = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [year, setYear] = useState<any>([]);
    const [marks, setMarks] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [report, setReport] = useState<boolean>(false);

    const { GradeData } = useGrade();
    const { ClassData } = useClass();

    const [formData, setFormData] = useState({
        year: '',
        grade_level: '',
        term_name: '',
        class_name: '',
    });

    const handleFormChange = (name: any, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
        handleFormChange(name, value);
    };

    const payload = {
        ...formData,
        grade_level: parseInt(formData.grade_level),
    };

    const getYear = async () => {
        try {
            const response = await axios.get('/api/class-teacher/year');
            response.status === 200;
            setYear(response.data);
        } catch (error) {
            toast.error('Failed to get year');
        }
    };

    useEffect(() => {
        getYear();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setRecordsData([]);
        if (!payload.class_name || !payload.grade_level || !payload.term_name || !payload.year) {
            toast.error('Please select all fields');
        } else {
            try {
                const response = await axios.post('/api/class-teacher/sign/', payload);
                if (response.status === 200) {
                    setResponseData(response.data);
                } else {
                    throw new Error('Failed get item');
                }
            } catch (error: any) {
                toast.error("Can't get data", error);
            }
        }
    };

    useEffect(() => {
        setRecordsData(responseData);
    }, [responseData]);

    // update status
    const handleButtonClick = async (record: any) => {
        try {
            const response = await axios.patch(`/api/class-teacher/sign/${record}`);
            if (response.status === 200) {
                axios
                    .post('/api/class-teacher/sign/', payload)
                    .then((response) => {
                        setResponseData(response.data);
                        toast.success('Sign Updated');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleAction = async (record: any) => {
        try {
            const response = await axios.get(`/api/student/${record}`);
            if (response.status === 200) {
                setMarks([response.data]);
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setReport(true);
        }
    };

    const downloadAsPDF = () => {
        const html2pdf = require('html2pdf.js/dist/html2pdf.js');
        const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: 'report.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 4, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
        };
        html2pdf().from(modalContentRef.current).set(opt).save();
    };

    // search by input box
    const handleSearch = (value: string) => {
        setSearch(value);
        const filteredData = responseData.filter((item: any) => item.student.full_name.toLowerCase().includes(value.toLowerCase()) || item.student.index.toLowerCase().includes(value.toLowerCase()));
        setRecordsData(filteredData);
    };

    const CurrentDate = () => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });

        return <h3 className="text-sm">{currentDate}</h3>;
    };
    return (
        <div className="mx-auto w-full">
            <div className="mb-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={handleSubmit} className="flex flex-row justify-between">
                    <Space wrap className="justify-between gap-12 pl-3">
                        <Select placeholder="Select Year" style={{ width: 300 }} onChange={(value) => handleSelectChange('year', value)}>
                            {year.map((year: any, index: any) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Select Term"
                            style={{ width: 300 }}
                            options={[
                                { value: 'First', label: 'First' },
                                { value: 'Second', label: 'Second' },
                                { value: 'Third', label: 'Third' },
                            ]}
                            onChange={(value) => handleSelectChange('term_name', value)}
                        />
                        <Select style={{ width: 300 }} placeholder="Select Grade" onChange={(value) => handleSelectChange('grade_level', value)}>
                            {GradeData.map((data: any, index: any) => (
                                <Option key={data} value={data.class?.grade_level}>
                                    {data.class?.grade_level || ''}
                                </Option>
                            ))}
                        </Select>

                        <Select style={{ width: 300 }} placeholder="Select Class" onChange={(value) => handleSelectChange('class_name', value)}>
                            {ClassData.map((data: any, index: any) => (
                                <Option key={data} value={data.class?.class_name}>
                                    {data.class?.class_name || ''}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <button type="submit" className="mr-3 w-[130px] items-center rounded-md bg-blue-600 p-2 font-semibold text-white">
                        Filter
                    </button>
                </form>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto mb-6 flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white pt-6">
                    <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={recordsData}>
                    <Column title="STUDENT" dataIndex={['student', 'full_name']} key="full_name" className="font-semibold" align="start" width={300} />
                    <Column title="US ID" dataIndex={['student', 'index']} key="index" className="font-semibold" width={300} />
                    <Column
                        title="REPORT"
                        width={300}
                        dataIndex="completed"
                        key="completed"
                        className="font-semibold"
                        render={(text, record: any) => (
                            <div>
                                {record.completed === true && (
                                    <button disabled className="items-center rounded bg-orange-100 px-2 text-[#FD7A05]">
                                        Completed
                                    </button>
                                )}
                                {record.completed === false && (
                                    <button disabled className="items-center rounded bg-red-100 px-2 text-[#FF0000]">
                                        Not Yet
                                    </button>
                                )}
                            </div>
                        )}
                    />
                    <Column
                        title="CLASS TEACHER"
                        width={300}
                        key="class_teacher_signed"
                        className="font-semibold"
                        render={(record) => (
                            <button
                                disabled={record.completed === false || record.class_teacher_signed === true}
                                onClick={() => handleButtonClick(record.id)}
                                className={`items-center rounded px-4 ${record.class_teacher_signed ? 'bg-green-100 text-green-500' : 'bg-[#979797] text-stone-100'} hover:bg-opacity-75`}
                            >
                                {record.class_teacher_signed ? 'Signed' : 'Sign'}
                            </button>
                        )}
                    />
                    <Column
                        title="PRINCIPAL"
                        width={330}
                        dataIndex="principal_signed"
                        key="principal_signed"
                        className="font-semibold"
                        render={(text, record: any) => (
                            <button disabled className={`items-center rounded px-4 ${record.principal_signed ? 'bg-blue-100 text-blue-700' : 'bg-[#979797] text-stone-100'} hover:bg-opacity-75`}>
                                {record.principal_signed ? 'Signed' : 'Sign'}
                            </button>
                        )}
                    />
                    <Column
                        title="ACTIONS"
                        key="Action"
                        align="end"
                        className="font-semibold"
                        render={(record: any) => (
                            <button className="text-2xl" disabled={record.principal_signed === false} onClick={() => handleAction(record.id)}>
                                <IoEyeOutline width={300} height={150} />
                            </button>
                        )}
                    />
                </Table>
            </div>

            <Transition appear show={report} as={Fragment}>
                <Dialog as="div" open={report} onClose={() => setReport(true)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="panel my-8 w-[300vh] max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-lg font-bold">Final Report</div>
                                        <div className="flex flex-row items-center justify-end gap-5">
                                            <button type="button" onClick={downloadAsPDF}>
                                                <FaDownload height={15} width={15} />
                                            </button>
                                            <button type="button" onClick={() => setReport(false)} className="text-white-dark hover:text-dark">
                                                <BsXLg />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative flex flex-col px-4" ref={modalContentRef}>
                                        <div className="mt-2.5 h-1.5 bg-blue-400 shadow-xl"></div>
                                        <div className="mb-8">
                                            <h1 className="mb-2 mt-3 text-center text-[23px] font-bold">{marks[0]?.[0].institute.institute_name || ''}</h1>
                                            <h2 className="text-center text-[20px] font-bold">Progress Report</h2>
                                        </div>
                                        <div className="mb-5 flex flex-row justify-between font-semibold">
                                            <div className="flex flex-col">
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="items-start font-sans text-black">
                                                        <span className="text-2em font-bold">Name : </span>
                                                        <span className="text-2em font-normal">{marks[0]?.[0].student.full_name || ''}</span>
                                                    </h1>
                                                </div>
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="items-start font-sans text-black">
                                                        <span className="text-2em font-bold">Grade : </span>
                                                        <span className="text-2em font-normal">
                                                            {marks[0]?.[0].student.classes.grade_level || ''} {marks[0]?.[0].student.classes.class_name || ''}
                                                        </span>
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="text-2em items-start font-sans font-bold text-black">
                                                        {' '}
                                                        US ID : <span className="text-2em font-normal">{marks[0]?.[0].student.index || ''}</span>
                                                    </h1>
                                                </div>
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="text-2em items-start font-sans font-bold text-black">
                                                        {' '}
                                                        Term &nbsp;:{' '}
                                                        <span className="text-2em font-normal">
                                                            {new Date(marks[0]?.[0].terms.start).getFullYear()}, {marks[0]?.[0].terms.term_name || ''}
                                                        </span>
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-5 h-[3px] bg-gray-400 shadow-lg"></div>
                                        <div className="relative flex flex-row justify-between font-bold">
                                            <div className="flex items-start justify-start">
                                                <h1>SUBJECT</h1>
                                            </div>
                                            <div className="flex flex-row justify-between space-x-10">
                                                <h1>MARKS</h1>
                                                <h1>CHANGE</h1>
                                                <h1>PASS</h1>
                                            </div>
                                        </div>
                                        <div className="flex w-full flex-row justify-between">
                                            <div className="mt-2 flex w-full flex-col">
                                                {marks[0]?.map((mark: any, index: any) => (
                                                    <h1 className="mt-2 font-bold" key={index}>
                                                        {mark.subject.name.split('-')[0] || ''}
                                                    </h1>
                                                ))}
                                            </div>

                                            <div className="flex flex-row justify-between gap-x-[70px]">
                                                <div className="mt-2 flex flex-col items-start justify-start">
                                                    {marks[0]?.map((mark: any, index: any) => (
                                                        <h1 className={`mt-2 ${mark.change !== 0 ? 'mr-3' : 'mr-5'}`} key={index}>
                                                            {mark.mark % 1 === 0 ? `${mark.mark}.00` : mark.mark}
                                                        </h1>
                                                    ))}
                                                </div>

                                                <div className="mt-2 flex flex-col text-center">
                                                    {marks[0]?.map((mark: any, index: any) => (
                                                        <h1
                                                            className={`mr-[-28px] mt-2 pr-3.5 text-right`}
                                                            key={index}
                                                            style={{
                                                                color: mark.change === 0 || mark.pass === 'Ab' ? 'black' : mark.change < 0 ? 'red' : 'green',
                                                            }}
                                                        >
                                                            {mark.change > 0 ? `+${mark.change}` : mark.change || '00'}
                                                        </h1>
                                                    ))}
                                                </div>
                                                <div className="mt-2 flex flex-col items-center">
                                                    {marks[0]?.map((mark: any, index: any) => (
                                                        <h1 className={`mt-2 ${mark.pass === 'Ab' ? '' : 'ml-2'} `} key={index}>
                                                            {mark.pass === 'Ab' ? 'ab' : mark.pass || ''}
                                                        </h1>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-[1px] bg-gray-400 shadow-lg"></div>
                                        <div className="mt-1 flex flex-row justify-between">
                                            <h1 className="font-bold">Total </h1>
                                            <h1>{marks[0]?.[0].total_marks || ''}</h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">Average</h1>
                                            <h1>{marks[0]?.[0].average || ''}</h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">Highest total marks in the class</h1>
                                            <h1>{marks[0]?.[0].highest_total_mark || ''}</h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">Total students in the class</h1>
                                            <h1>{marks[0]?.[0].total_students || ''}</h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">Rank in the class</h1>
                                            <h1>{marks[0]?.[0].rank || ''}</h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">Pass or Fail</h1>
                                            <h1></h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">What to say</h1>
                                            <h1></h1>
                                        </div>
                                        <div className="mt-2 flex flex-row justify-between">
                                            <h1 className="font-bold">Date of commencement of next term</h1>
                                            <h1>{marks[0]?.[0].next_term_start_date || 'N/A'}</h1>
                                        </div>
                                        <div className="mb-2 mt-8 flex flex-wrap justify-between gap-8">
                                            <div className="flex flex-grow flex-col items-center justify-start">
                                                <h1>{marks[0]?.[0].teacher.full_name || 'N/A'}</h1>
                                                <p>.....................................................</p>
                                                <h2 className="text-2em font-bold">Class Teacher</h2>
                                                <div className="ml-2 flex flex-row items-center gap-2">
                                                    <h3 className="ml-4 text-sm">
                                                        {marks[0]?.[0].teacher_signed_date
                                                            ? new Date(marks[0][0].teacher_signed_date).toLocaleDateString('en-US', {
                                                                  year: 'numeric',
                                                                  month: 'numeric',
                                                                  day: 'numeric',
                                                              })
                                                            : 'N/A'}
                                                    </h3>
                                                    <div className="mt-3 inline-block align-baseline">
                                                        <img src="/assets/images/tick.svg" width={16} height={10} alt="tick" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-grow flex-col items-center justify-center">
                                                <h1>{marks[0]?.[0].principal.full_name || 'N/A'}</h1>
                                                <p>.....................................................</p>
                                                <h2 className="text-2em font-bold">Principal</h2>
                                                <div className="ml-2 flex flex-row items-center gap-2">
                                                    <h3 className="ml-4 text-sm">
                                                        {marks[0]?.[0].principal_signed_date
                                                            ? new Date(marks[0][0].teacher_signed_date).toLocaleDateString('en-US', {
                                                                  year: 'numeric',
                                                                  month: 'numeric',
                                                                  day: 'numeric',
                                                              })
                                                            : 'N/A'}
                                                    </h3>
                                                    <div className="mt-3 inline-block align-baseline">
                                                        <img src="/assets/images/tick.svg" width={16} height={10} alt="tick" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-grow flex-col items-center justify-center">
                                                <h1>Unicus X</h1>
                                                <p>.....................................................</p>
                                                <h2 className="text-2em font-bold">Report Generator</h2>
                                                <div className="ml-6 flex flex-row items-center gap-2 ">
                                                    <CurrentDate />
                                                    <div className="mt-3 inline-block align-baseline">
                                                        <img src="/assets/images/tick.svg" width={16} height={10} alt="tick" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-4 h-1.5 bg-blue-400 shadow-xl"></div>
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

export default SignPage;
