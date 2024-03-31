'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import IconStar from '@/components/icon/icon-star';
import ReactApexChart from 'react-apexcharts';

const ComponentsDatatablesAdvanced = () => {
    // const [page, setPage] = useState(1);
    // const PAGE_SIZES = [10, 20, 30, 50, 100];
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    // const [recordsData, setRecordsData] = useState(initialRecords);

    // const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    //     columnAccessor: 'id',
    //     direction: 'asc',
    // });

    // const [isMounted, setIsMounted] = useState(false);
    // useEffect(() => {
    //     setIsMounted(true);
    // }, []);

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData([...initialRecords.slice(from, to)]);
    // }, [page, pageSize, initialRecords]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    //     setPage(1);
    // }, [sortStatus]);

    // const randomColor = () => {
    //     const color = ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3'];
    //     const random = Math.floor(Math.random() * color.length);
    //     return color[random];
    // };

    // const randomStatusColor = () => {
    //     const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    //     const random = Math.floor(Math.random() * color.length);
    //     return color[random];
    // };

    // const randomStatus = () => {
    //     const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
    //     const random = Math.floor(Math.random() * status.length);
    //     return status[random];
    // };
    // const getRandomNumber = (min: number, max: number) => {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // };

    // const getCountry = () => {
    //     const random = Math.floor(Math.random() * countryList.length);
    //     return countryList[random];
    // };

    // const chart_options = () => {
    //     let option = {
    //         chart: { sparkline: { enabled: true } },
    //         stroke: { curve: 'smooth', width: 2 },
    //         markers: { size: [4, 7], strokeWidth: 0 },
    //         colors: [randomColor()],
    //         grid: { padding: { top: 5, bottom: 5 } },
    //         tooltip: {
    //             x: { show: false },
    //             y: {
    //                 title: {
    //                     formatter: () => {
    //                         return '';
    //                     },
    //                 },
    //             },
    //         },
    //     };
    //     return option;
    // };

    return (
        <div className="panel mt-6">
            {/* <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Advanced</h5>
            <div className="datatables">
                {isMounted && (
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'id',
                                title: 'ID',
                                sortable: true,
                                render: ({ id }) => <strong className="text-info">#{id}</strong>,
                            },
                            {
                                accessor: 'firstName',
                                title: 'User',
                                sortable: true,
                                render: ({ firstName, lastName }) => (
                                    <div className="flex items-center gap-2">
                                        <img src={`/assets/images/profile-${getRandomNumber(1, 34)}.jpeg`} className="h-9 w-9 max-w-none rounded-full" alt="user-profile" />
                                        <div className="font-semibold">{firstName + ' ' + lastName}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'country',
                                title: 'Country',
                                render: () => (
                                    <div className="flex items-center gap-2">
                                        <img width="24" src={`/assets/images/flags/${getCountry().code}.svg`} className="max-w-none" alt="flag" />
                                        <div>{getCountry().name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'email',
                                title: 'Email',
                                sortable: true,
                                render: ({ email }) => (
                                    <a href={`mailto:${email}`} className="text-primary hover:underline">
                                        {email}
                                    </a>
                                ),
                            },
                            {
                                accessor: 'age',
                                title: 'Progress',
                                render: () => (
                                    <div className="flex h-2.5 w-4/5 min-w-[100px] rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                        <div
                                            className={`h-2.5 rounded-full rounded-bl-full text-center text-xs text-white bg-${randomStatusColor()}`}
                                            style={{ width: `${getRandomNumber(15, 100)}%` }}
                                        ></div>
                                    </div>
                                ),
                            },
                            { accessor: 'phone', title: 'Phone', sortable: true },
                            {
                                accessor: 'rating',
                                title: 'Rate',
                                titleClassName: '!text-center',
                                render: ({ id }) => (
                                    <div className="flex items-center justify-center text-warning">
                                        {Array.from(Array(getRandomNumber(1, 5)).keys()).map((i) => {
                                            return <IconStar key={i + id} className=" fill-warning" />;
                                        })}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'series',
                                title: 'Progress',
                                render: ({ id }) => (
                                    <ReactApexChart
                                        key={id}
                                        type="line"
                                        series={[{ data: [21, 9, 36, 12, 44, 25, 59] }]}
                                        // @ts-ignore
                                        options={chart_options()}
                                        height={30}
                                        width={150}
                                    />
                                ),
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                render: () => <span className={`badge badge-outline-${randomStatusColor()} `}>{randomStatus()}</span>,
                            },
                        ]}
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
                )}
            </div> */}
        </div>
    );
};

export default ComponentsDatatablesAdvanced;
