'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';

const ComponentsDatatablesColumnChooser = () => {
    // const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    // // show/hide
    // const [page, setPage] = useState(1);
    // const PAGE_SIZES = [10, 20, 30, 50, 100];
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    // const [recordsData, setRecordsData] = useState(initialRecords);

    // const [search, setSearch] = useState('');
    // const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    //     columnAccessor: 'id',
    //     direction: 'asc',
    // });

    // const [hideCols, setHideCols] = useState<any>(['age', 'dob', 'isActive']);

    // const formatDate = (date: any) => {
    //     if (date) {
    //         const dt = new Date(date);
    //         const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
    //         const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    //         return day + '/' + month + '/' + dt.getFullYear();
    //     }
    //     return '';
    // };

    // const showHideColumns = (col: any, value: any) => {
    //     if (hideCols.includes(col)) {
    //         setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
    //     } else {
    //         setHideCols([...hideCols, col]);
    //     }
    // };

    // const cols = [
    //     { accessor: 'id', title: 'ID' },
    //     { accessor: 'firstName', title: 'First Name' },
    //     { accessor: 'lastName', title: 'Last Name' },
    //     { accessor: 'email', title: 'Email' },
    //     { accessor: 'phone', title: 'Phone' },
    //     { accessor: 'company', title: 'Company' },
    //     { accessor: 'address.street', title: 'Address' },
    //     { accessor: 'age', title: 'Age' },
    //     { accessor: 'dob', title: 'Birthdate' },
    //     { accessor: 'isActive', title: 'Active' },
    // ];

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData([...initialRecords.slice(from, to)]);
    // }, [page, pageSize, initialRecords]);

    // useEffect(() => {
    //     setInitialRecords(() => {
    //         return rowData.filter((item) => {
    //             return (
    //                 item.id.toString().includes(search.toLowerCase()) ||
    //                 item.firstName.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.lastName.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.company.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.email.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.age.toString().toLowerCase().includes(search.toLowerCase()) ||
    //                 item.dob.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.phone.toLowerCase().includes(search.toLowerCase())
    //             );
    //         });
    //     });
    // }, [search]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    //     setPage(1);
    // }, [sortStatus]);

    return (
        <div className="panel mt-6">
            {/* <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Show/Hide Columns</h5>
                <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="dropdown">
                            <Dropdown
                                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                button={
                                    <>
                                        <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                        <IconCaretDown className="h-5 w-5" />
                                    </>
                                }
                            >
                                <ul className="!min-w-[140px]">
                                    {cols.map((col, i) => {
                                        return (
                                            <li
                                                key={i}
                                                className="flex flex-col"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <div className="flex items-center px-4 py-1">
                                                    <label className="mb-0 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={!hideCols.includes(col.accessor)}
                                                            className="form-checkbox"
                                                            defaultValue={col.accessor}
                                                            onChange={(event: any) => {
                                                                setHideCols(event.target.value);
                                                                showHideColumns(col.accessor, event.target.checked);
                                                            }}
                                                        />
                                                        <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                    </label>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="text-right">
                        <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'id',
                            title: 'ID',
                            sortable: true,
                            hidden: hideCols.includes('id'),
                        },
                        {
                            accessor: 'firstName',
                            title: 'First Name',
                            sortable: true,
                            hidden: hideCols.includes('firstName'),
                        },
                        {
                            accessor: 'lastName',
                            title: 'Last Name',
                            sortable: true,
                            hidden: hideCols.includes('lastName'),
                        },
                        {
                            accessor: 'email',
                            title: 'Email',
                            sortable: true,
                            hidden: hideCols.includes('email'),
                        },
                        {
                            accessor: 'phone',
                            title: 'Phone',
                            sortable: true,
                            hidden: hideCols.includes('phone'),
                        },
                        {
                            accessor: 'company',
                            title: 'Company',
                            sortable: true,
                            hidden: hideCols.includes('company'),
                        },
                        {
                            accessor: 'address.street',
                            title: 'Address',
                            sortable: true,
                            hidden: hideCols.includes('address.street'),
                        },
                        {
                            accessor: 'age',
                            title: 'Age',
                            sortable: true,
                            hidden: hideCols.includes('age'),
                        },
                        {
                            accessor: 'dob',
                            title: 'Birthdate',
                            sortable: true,
                            hidden: hideCols.includes('dob'),
                            render: ({ dob }) => <div>{formatDate(dob)}</div>,
                        },
                        {
                            accessor: 'isActive',
                            title: 'Active',
                            sortable: true,
                            hidden: hideCols.includes('isActive'),
                            render: ({ isActive }) => <div className={`${isActive ? 'text-success' : 'text-danger'} capitalize`}>{isActive.toString()}</div>,
                        },
                    ]}
                    highlightOnHover
                    totalRecords={initialRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
            </div> */}
        </div>
    );
};

export default ComponentsDatatablesColumnChooser;
