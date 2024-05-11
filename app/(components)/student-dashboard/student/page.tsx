'use client';
import React, { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BsXLg } from 'react-icons/bs';
import { FaDownload } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';

const StudentPage = () => {
    const [responseData, setResponseData] = useState<any[]>([]);
    const [marks, setMarks] = useState<any[]>([]);
    const [report, setReport] = useState<boolean>(false);
    const modalContentRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        grade_level: '',
        term_name: '',
    });
    const handleFormChange = (name: any, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
        handleFormChange(name, value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(!formData.grade_level || !formData.term_name) {
            toast.error('Please select grade and term');
            return;
        }  
        const UpdateFormData = {
            ...formData,
            grade_level: parseInt(formData.grade_level),
        };
        setResponseData([]);
        try {
            const response = await axios.post('/api/student/', UpdateFormData);
            if (response.status === 200) {
                setResponseData([response.data]);
            } else {
                throw new Error('Failed get item');
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const handleButtonClick = async (record: any) => {
        try {
            const response = await axios.get(`/api/student/${record}`);
            if (response.status === 200) {
                setMarks([response.data]);
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
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
            <div className="mb-3 mt-3 h-[150px] w-full rounded-md bg-white shadow-lg">
                <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1>
                <form onSubmit={handleSubmit} className="flex flex-row justify-between ">
                    <Space wrap className="justify-between gap-12 pl-3 md:gap-8">
                        <Select
                            placeholder="Select Grade"
                            style={{ width: 300 }}
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
                            onChange={(value) => handleSelectChange('grade_level', value)}
                        />
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
                    </Space>
                    <button type="submit" className="mr-3 w-[130px] items-center rounded-md bg-blue-600 p-2 font-semibold text-white max-sm:h-[40px] md:w-[130px]">
                        Filter
                    </button>
                </form>
            </div>
            <div className="mt-1 rounded-xl bg-white shadow-lg">
                <div className="mx-auto flex h-[50px] flex-row items-center justify-end gap-8 self-end rounded-md bg-white">
                    {/* <input className="form-input mr-[20px] h-[40px] w-[200px]" placeholder="Search..." value={search} onChange={(e) => handleSearch(e.target.value)} /> */}
                </div>
                <Table className="bg-white md:ml-5 md:mr-5" dataSource={responseData}>
                    <Column title="STUDENT" dataIndex={['student', 'full_name']} key="id" className="justify-start self-start font-semibold" width={300} />
                    <Column title="US ID" dataIndex={['student', 'index']} key="institute_id" className="justify-start self-start font-semibold" width={300} />
                    <Column title="INSTITUTE" dataIndex={['institute', 'institute_name']} key="student_id" className="justify-start self-start font-semibold" width={300} />
                    <Column
                        title="ACTIONS"
                        key="Action"
                        align="end"
                        className="justify-start self-start font-semibold"
                        render={(record: any) => (
                            <button className="text-2xl" disabled={record.principal_signed === false} onClick={() => handleButtonClick(record.id)}>
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
                                            <h2 className="font-bold text-center text-[20px]">Progress Report</h2>
                                        </div>
                                        <div className="flex flex-row justify-between mb-5 font-semibold">
                                            <div className="flex flex-col">
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="items-start font-sans text-black">
                                                        <span className="font-bold text-2em">Name : </span>
                                                        <span className="font-normal text-2em">{marks[0]?.[0].student.full_name || ''}</span>
                                                    </h1>
                                                </div>
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="items-start font-sans text-black">
                                                        <span className="font-bold text-2em">Grade : </span>
                                                        <span className="font-normal text-2em">
                                                            {marks[0]?.[0].student.classes.grade_level || ''} {marks[0]?.[0].student.classes.class_name || ''}
                                                        </span>
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="items-start font-sans font-bold text-black text-2em">
                                                        {' '}
                                                        US ID : <span className="font-normal text-2em">{marks[0]?.[0].student.index || ''}</span>
                                                    </h1>
                                                </div>
                                                <div className="flex flex-row gap-1">
                                                    <h1 className="items-start font-sans font-bold text-black text-2em">
                                                        {' '}
                                                        Term &nbsp;:{' '}
                                                        <span className="font-normal text-2em">
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
                                        <div className="flex flex-row justify-between w-full">
                                            <div className="flex flex-col w-full mt-2">
                                                {marks[0]?.map((mark: any, index: any) => (
                                                    <h1 className="mt-2 font-bold" key={index}>
                                                        {mark.subject.name.split('-')[0] || ''}
                                                    </h1>
                                                ))}
                                            </div>

                                            <div className="flex flex-row justify-between gap-x-[70px]">
                                                <div className="flex flex-col items-start justify-start mt-2">
                                                    {marks[0]?.map((mark: any, index: any) => (
                                                        <h1 className={`mt-2 ${mark.change !== 0 ? 'mr-3' : 'mr-5'}`} key={index}>
                                                            {mark?.mark || '00'}
                                                        </h1>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col mt-2 text-center">
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
                                                <div className="flex flex-col items-center mt-2">
                                                    {marks[0]?.map((mark: any, index: any) => (
                                                        <h1 className={`mt-2 ${mark.pass === 'Ab' ? '' : 'ml-2'} `} key={index}>
                                                            {mark.pass === 'Ab' ? 'AB' : mark.pass || ''}
                                                        </h1>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-[1px] bg-gray-400 shadow-lg"></div>
                                        <div className="flex flex-row justify-between mt-1">
                                            <h1 className="font-bold">Total </h1>
                                            <h1>{marks[0]?.[0].total_marks || ''}</h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">Average</h1>
                                            <h1>{marks[0]?.[0].average || ''}</h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">Highest total marks in the class</h1>
                                            <h1>{marks[0]?.[0].highest_total_mark || ''}</h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">Total students in the class</h1>
                                            <h1>{marks[0]?.[0].total_students || ''}</h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">Rank in the class</h1>
                                            <h1>{marks[0]?.[0].rank || ''}</h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">Pass or Fail</h1>
                                            <h1></h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">What to say</h1>
                                            <h1></h1>
                                        </div>
                                        <div className="flex flex-row justify-between mt-2">
                                            <h1 className="font-bold">Date of commencement of next term</h1>
                                            <h1>{marks[0]?.[0].next_term_start_date || 'N/A'}</h1>
                                        </div>
                                        <div className="flex flex-wrap justify-between gap-8 mt-8 mb-2">
                                            <div className="flex flex-col items-center justify-start flex-grow">
                                                <h1>{marks[0]?.[0].teacher.full_name || 'N/A'}</h1>
                                                <p>.....................................................</p>
                                                <h2 className="font-bold text-2em">Class Teacher</h2>
                                                <div className="flex flex-row items-center gap-2 ml-2">
                                                    <h3 className="ml-4 text-sm">
                                                        {marks[0]?.[0].teacher_signed_date
                                                        ? new Date(marks[0][0].teacher_signed_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        })
                                                        : 'N/A'}
                                                    </h3>
                                                    <div className="inline-block mt-3 align-baseline">
                                                        <img src="/assets/images/tick.svg" width={16} height={10} alt="tick" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center flex-grow">
                                                <h1>{marks[0]?.[0].principal.full_name || 'N/A'}</h1>
                                                <p>.....................................................</p>
                                                <h2 className="font-bold text-2em">Principal</h2>
                                                <div className="flex flex-row items-center gap-2 ml-2">
                                                    <h3 className="ml-4 text-sm">
                                                        {marks[0]?.[0].principal_signed_date
                                                        ? new Date(marks[0][0].teacher_signed_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        })
                                                        : 'N/A'}
                                                    </h3>
                                                    <div className="inline-block mt-3 align-baseline">
                                                        <img src="/assets/images/tick.svg" width={16} height={10} alt="tick" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center flex-grow">
                                                <h1>Unicus X</h1>
                                                <p>.....................................................</p>
                                                <h2 className="font-bold text-2em">Report Generator</h2>
                                                <div className="flex flex-row items-center gap-2 ml-6 ">
                                                    <CurrentDate />
                                                    <div className="inline-block mt-3 align-baseline">
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

export default StudentPage;
