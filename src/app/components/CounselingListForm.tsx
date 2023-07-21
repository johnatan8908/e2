import { useEffect, useState } from 'react';

interface Counseling {
    date: string | null;
    advisor: Advisor;
    student: Student;
  }
  
  interface Advisor {
    name: string;
    // Add more properties specific to the advisor if needed
  }
  
  interface Student {
    name: string;
    // Add more properties specific to the student if needed
  }

const CounselingTable = () => {
  const [counselings, setCounselings] = useState<Counseling[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/counselings');
        const data = await response.json();

        const counselingData = [];
        for (const counseling of data._embedded.counselings) {
          const advisorResponse = await fetch(counseling._links.advisor.href);
          if (!advisorResponse.ok) {
            continue
          }
          
          
          const advisorData = await advisorResponse.json();

          console.log(advisorData);

          const studentResponse = await fetch(counseling._links.student.href);
          const studentData = await studentResponse.json();
          

          counselingData.push({
            advisor: advisorData,
            student: studentData,
            date: counseling.date,
          });
        }

        setCounselings(counselingData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Advisor Name</th>
          <th>Student Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {counselings.map((counseling, index) => (
          <tr key={index}>
            <td>{counseling.advisor.name}</td>
            <td>{counseling.student.name}</td>
            <td>{counseling.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CounselingTable;
