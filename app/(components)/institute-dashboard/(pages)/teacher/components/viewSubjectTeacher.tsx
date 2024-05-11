import { fetchActiveSubject } from '@/utils';
import { useEffect, useState } from 'react';

interface UpdateSubjectTeacherProps {
    selectedRecord: any;
    selectedValues: SelectedValues[];
    setSelectedValues: any;
}

interface SelectedValues {
    grade: any;
    class: any;
    medium: any;
    subject: any;
}

const values = ['sinhala', 'tamil', 'english'];

const ViewSubjectTeacher: React.FC<UpdateSubjectTeacherProps> = ({ selectedRecord, selectedValues, setSelectedValues }) => {
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
            setSelectedValues(
                selectedRecord.teacher_subjects.map((teacherSubject: any) => ({
                    grade: teacherSubject?.class?.grade_level || null,
                    class: teacherSubject?.class?.class_name || null,
                    medium: teacherSubject?.medium || null,
                    subject: teacherSubject?.subject?.name || null,
                }))
            );
        }
    }, [selectedRecord]);

    const renderDropdowns = () => {
        const dropdowns = [];
        const numTeacherSubjects = selectedRecord?.teacher_subjects.length || 0;

        for (let i = 0; i < numTeacherSubjects + dropdownCount; i++) {
            const teacherSubject = selectedRecord?.teacher_subjects[i];

            dropdowns.push(
                <div key={i} style={{ marginBottom: 20 }}>
                    <input defaultValue={teacherSubject?.class?.grade_level || 'Select Grade'} readOnly className="form-input placeholder:text-white-dark mt-1 mb-1" />
                    <input defaultValue={teacherSubject?.class?.class_name || 'Select Class'} readOnly className="form-input placeholder:text-white-dark mb-1" />
                    <input readOnly className="form-input placeholder:text-white-dark" defaultValue={teacherSubject?.subject?.name || 'Select Subject'} />
                    <input defaultValue={teacherSubject?.medium || 'Select Medium'} readOnly className="form-input placeholder:text-white-dark mt-1 mb-1" />
                </div>
            );
        }
        return dropdowns;
    };

    return (
        <div style={{ marginTop: 5 }}>
            {renderDropdowns()}
        </div>
    );
};

export default ViewSubjectTeacher;
