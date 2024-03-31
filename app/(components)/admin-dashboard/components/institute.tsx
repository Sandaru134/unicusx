'use client';

import IconEye from '@/components/icon/icon-eye';
import { IRootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Fragment, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import InstituteRegistration from './instituteRegistration';

const people = [{ name: 'Wade Cooper' }, { name: 'Arlene Mccoy' }, { name: 'Devon Webb' }, { name: 'Tom Cook' }, { name: 'Tanya Fox' }, { name: 'Hellen Schmidt' }];

const InstitutePage = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [selected, setSelected] = useState({ name: 'Select Institute' });
    const [instituteType, setInstituteType] = useState({ name: 'Select Institute type' });

    console.log(selected);

    return (
        <MantineProvider>
            <div className="pt-5">
                <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                    {/* Total Users card */}
                    <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Users</div>
                            <div className="dropdown"></div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 1500 </div>
                            <div className="badge bg-white/30">+ 2.35% </div>
                        </div>
                        <div className="mt-5 flex items-center font-semibold">
                            <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Last Week 500
                        </div>
                    </div>

                    {/* Principles card */}
                    <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Principles</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 10 </div>
                            <div className="badge bg-white/30">- 2.35% </div>
                        </div>
                        <div className="mt-5 flex items-center font-semibold">
                            <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Last Week 3
                        </div>
                    </div>
                    {/* Teachers */}
                    <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Teachers</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 50</div>
                            <div className="badge bg-white/30">+ 1.35% </div>
                        </div>
                        <div className="mt-5 flex items-center font-semibold">
                            <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Last Week 11
                        </div>
                    </div>

                    {/* Total students */}
                    <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Students</div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 1800</div>
                            <div className="badge bg-white/30">+ 0.35% </div>
                        </div>
                        <div className="mt-5 flex items-center font-semibold">
                            <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Last Week 200
                        </div>
                    </div>
                </div>

                {/* drop downs */}
                {/* <div className="mx-auto">
                    <div className="h-[150px] w-full rounded-md bg-white">
                        <h1 className="p-3 text-start text-2xl font-semibold text-gray-500">Search Filter</h1> */}

                        {/* institute dropdown */}
                        {/* <div className="flex flex-row gap-10">
                            <div className="border-1 w-72 border-gray-500 p-3">
                                <Listbox value={selected} onChange={setSelected}>
                                    <div className="relative mt-1 z-50">
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg border-[1px] border-gray-500 bg-white  py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span className="block truncate">{selected ? selected.name : 'Select Institute'}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                {people.map((person, personIdx) => (
                                                    <Listbox.Option
                                                        key={personIdx}
                                                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'}`}
                                                        value={person}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{person.name}</span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            <div className="border-1 w-72 border-gray-500 p-3">
                                <Listbox value={instituteType} onChange={setInstituteType}>
                                    <div className="relative mt-1 z-50">
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg border-[1px] border-gray-500 bg-white  py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span className="block truncate">{instituteType ? instituteType.name : 'Select Institute'}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                {people.map((person, personIdx) => (
                                                    <Listbox.Option
                                                        key={personIdx}
                                                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'}`}
                                                        value={person}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{person.name}</span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div> */}
                    {/* </div>
                </div> */}

                {/* Table  */}
                <div className='mt-2'>
                    <InstituteRegistration />
                </div>
            </div>
        </MantineProvider>
    );
};

export default InstitutePage;
