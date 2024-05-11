import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useSubject = () => {
    const [subjectData, setSubjectData] = useState<any>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/class-teacher/dropdowns/subject');
            setSubjectData(response.data);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    
    return { subjectData };
};

export default useSubject;
