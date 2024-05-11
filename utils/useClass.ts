import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useClass = () => {
    const [ClassData, setClassData] = useState<any[]>([]);
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/class-teacher/dropdowns/class-name');
            setClassData([response.data]);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { ClassData };
};

export default useClass;
