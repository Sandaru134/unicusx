import axios from 'axios';
import toast from 'react-hot-toast';

export const class_name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
export const grade_level = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

// institute data

export async function fetchInstitutes() {
    try {
        const response = await axios.get('/api/unicus-admin/institute');
        if (response.status === 200) {
            const data = response.data;
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        toast.error('Error fetching data');
    }
}

export const handleInstituteDelete = async (recordId: any) => {
    try {
      const response = await axios.delete(
        `/api/unicus-admin/institute/${recordId}`
      );
      if (response.status === 200) {
        toast.success("Item deleted successfully");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
    }
  };

  // subject data

  export async function fetchSubject() {
    try {
        const response = await axios.get('/api/unicus-admin/subject');
        if (response.status === 200) {
            const data = response.data;
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        toast.error('Error fetching data');
    }
}

export const handleSubjectDelete = async (record: any) => {
  try {
    const response = await axios.delete(
      `/api/unicus-admin/subject/${record}`
    );
    if (response.status === 200) {
      toast.success("Subject deleted successfully");
    } else {
      throw new Error("Failed to delete item");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete item");
  }
};

export async function fetchSubjectForTeacher() {
  try {
      const response = await axios.get('/api/institute-admin/subject');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

export async function fetchActiveSubject() {
  try {
      const response = await axios.get('/api/institute-admin/active-subject');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get all teachers data
export async function fetchAllTeachers() {
  try {
      const response = await axios.get('/api/institute-admin/teacher');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get all terms
export async function fetchAllTerms() {
  try {
      const response = await axios.get('/api/institute-admin/term');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get all students
export async function fetchAllStudents() {
  try {
      const response = await axios.get('/api/institute-admin/student');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get all pricipals
export async function fetchAllPrincipals() {
  try {
      const response = await axios.get('/api/institute-admin/principal');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get subjects for each teacher
export async function fetchTeachersSubjects() {
  try {
      const response = await axios.get('/api/class-teacher/add-subjects');
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get all terms
export async function fetchAllTermsForTeacher() {
  try {
      const response = await axios.get('/api/class-teacher/enter-marks/term')
      if (response.status === 200) {
          const data = response.data;
          return data;
      } else {
          throw new Error('Something went wrong');
      }
  } catch (error) {
      toast.error('Error fetching data');
  }
}

// get all subjects for for add marks
export async function fetchAllSubjectsForAddMarks() {
    try {
        const response = await axios.get('/api/class-teacher/enter-marks/subject')
        if (response.status === 200) {
            const data = response.data;
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        toast.error('Error fetching data');
    }
  }

//   get all sings
export async function fetchAllSings() {
    try {
        const response = await axios.get('/api/class-teacher/sign')
        if (response.status === 200) {
            const data = response.data;
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        toast.error('Error fetching data');
    }
}




