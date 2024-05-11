import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const useGrade = () => {
    const [GradeData, setGradeData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/class-teacher/dropdowns/grade');
            setGradeData([response.data]);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    
    return { GradeData };
  
}

export default useGrade