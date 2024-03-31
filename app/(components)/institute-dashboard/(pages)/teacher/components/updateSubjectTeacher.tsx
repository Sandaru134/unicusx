import { fetchActiveSubject } from '@/utils';
import { Select, Space } from 'antd';
import { Option } from 'antd/es/mentions';
import { useEffect, useState } from 'react';

interface UpdateSubjectTeacherProps {
    selectedRecord: any;
    selectedValues: SelectedValues[];
    setSelectedValues: any
}

interface SelectedValues {
    grade: any;
    class: any;
    medium: any;
    subject: any;
}

const values = ['sinhala', 'tamil', 'english'];

const UpdateSubjectTeacher: React.FC<UpdateSubjectTeacherProps> = ({ selectedRecord, selectedValues, setSelectedValues }) => {
    const [dropdownCount, setDropdownCount] = useState(0);
    // const [selectedValues, setSelectedValues] = useState<SelectedValues[]>([]);
    const [fetchSubjectData, setFetchSubjectData] = useState<any>([]);

    const fetchData = async () => {
        const data = await fetchActiveSubject();
        setFetchSubjectData(data);
    };
    
    useEffect(() => {
        fetchData();
        // Set initial selectedValues based on selectedRecord
        if (selectedRecord && selectedRecord.teacher_subjects) {
            setSelectedValues(selectedRecord.teacher_subjects.map((teacherSubject: any) => ({
                grade: teacherSubject?.class?.grade_level || null,
                class: teacherSubject?.class?.class_name || null,
                medium: teacherSubject?.medium || null,
                subject: teacherSubject?.subject_id || null
            })));
        }
    }, [selectedRecord]);

    const handleAddClick = (e: any) => {
        e.preventDefault();
        setDropdownCount((prevCount) => prevCount + 1);
    };

    const handleSelectChange = (value: any, index: any, type: keyof SelectedValues) => {
        setSelectedValues((prevValues: SelectedValues[]) => {
            const updatedValues: SelectedValues[] = [...prevValues];
            if (!updatedValues[index]) {
                updatedValues[index] = { grade: null, class: null, medium: null, subject: null };
            }
            // Convert grade to integer
            if (type === 'grade') {
                updatedValues[index][type] = parseInt(value); // Convert to integer
            } else {
                updatedValues[index][type] = value;
            }
            return updatedValues;
        });
    };

    const renderDropdowns = () => {
        const dropdowns = [];
        const numTeacherSubjects = selectedRecord?.teacher_subjects.length || 0;

        for (let i = 0; i < numTeacherSubjects + dropdownCount; i++) {
            const teacherSubject = selectedRecord?.teacher_subjects[i];

            dropdowns.push(
                <Space wrap key={i} style={{ marginBottom: 20 }}>
                    <Select
                        defaultValue={teacherSubject?.class?.grade_level || 'Select Grade'}
                        style={{ width: 355 }}
                        onChange={(value) => handleSelectChange(value, i, 'grade')}
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
                        defaultValue={teacherSubject?.class?.class_name || 'Select Class'}
                        style={{ width: 355 }}
                        options={[
                            { value: 'A', label: 'A' },
                            { value: 'B', label: 'B' },
                            { value: 'C', label: 'C' },
                            { value: 'D', label: 'D' },
                            { value: 'E', label: 'E' },
                            { value: 'F', label: 'F' },
                            { value: 'G', label: 'G' },
                            { value: 'H', label: 'H' },
                            { value: 'I', label: 'I' },
                            { value: 'J', label: 'J' },
                            { value: 'K', label: 'K' },
                            { value: 'L', label: 'L' },
                            { value: 'M', label: 'M' },
                            { value: 'N', label: 'N' },
                            { value: 'O', label: 'O' },
                            { value: 'P', label: 'P' },
                            { value: 'Q', label: 'Q' },
                            { value: 'R', label: 'R' },
                            { value: 'S', label: 'S' },
                            { value: 'T', label: 'T' },
                            { value: 'U', label: 'U' },
                            { value: 'V', label: 'V' },
                            { value: 'W', label: 'W' },
                            { value: 'X', label: 'X' },
                            { value: 'Y', label: 'Y' },
                            { value: 'Z', label: 'Z' },
                        ]}
                        onChange={(value) => handleSelectChange(value, i, 'class')}
                    />
                    <Select defaultValue={teacherSubject?.subject?.name || 'Select Subject'} style={{ width: 355 }} onChange={(value) => handleSelectChange(value, i, 'subject')}>
                        {fetchSubjectData.map((data: any, index: any) => (
                            <Option key={data.id} value={data.subject_id}>
                                {data.subject.name}
                            </Option>
                        ))}
                    </Select>

                    <Select defaultValue={teacherSubject?.medium || 'Select Medium'} style={{ width: 355 }} onChange={(value) => handleSelectChange(value, i, 'medium')}>
                        {values.map((value, index) => (
                            <Option key={String(index)} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </Space>
            );
        }
        return dropdowns;
    };

    return (
        <div style={{ marginTop: 5 }}>
            {renderDropdowns()}
            <div className="flex items-end justify-end">
                <button onClick={handleAddClick} className="h-[25px] w-[50px] rounded-md bg-blue-600 text-sm text-white">
                    Add
                </button>
            </div>
        </div>
    );
};

export default UpdateSubjectTeacher;
