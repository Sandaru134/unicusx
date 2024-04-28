import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useYear = () => {
    const [data, setdata] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/institute-admin/year');
            setdata(response.data);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    console.log("this is year", data);
    

    return { data };
};

export default useYear;
