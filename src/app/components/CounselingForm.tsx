import React, { useEffect, useState } from "react";
import "./AdvisorForm.css"; // Import CSS for animation

interface Student {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    _links: Record<string, { href: string }>;
}

interface Advisor {
  name: string;
  email: string;
  phone: string;
  program: string;
  _links: Record<string, { href: string }>;
}

interface Counseling {
    student: string;
    advisor: string;
    date: string;
}

const CounselingForm = () => {
const [students, setStudents] = useState<Student[]>([]);
const [advisors, setAdvisors] = useState<Advisor[]>([]);

const [submitted, setSubmitted] = useState(false);
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/students");
        const data = await response.json();
        setStudents(data._embedded.students);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);


  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch("http://localhost:8080/advisors");
        const data = await response.json();
        setAdvisors(data._embedded.advisors);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdvisors();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    
    const counseling: Counseling = ({
        student: e.target.student.value,
        advisor: e.target.advisor.value,
        date: e.target.date.value,
    });
    

    try {
      const response = await fetch("http://localhost:8080/counselings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(counseling),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        //Clear the form
        e.target.reset();

        //Disable the submit button
        e.target.disabled = true;

        setSubmitted(true); // Set the submitted state to true
        setTimeout(() => {
          setSubmitted(false); // Reset the submitted state after 3 seconds
          //Redirect to the list of counselings
          window.location.href = "/counseling/list";          
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Extract the student id from the href
const getStudentId = (student: string) => {
    const studentHrefParts = student.split("/");
    const studentId = studentHrefParts[studentHrefParts.length - 1];
    return studentId;
};
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select name="student">
          <option value="0">Seleccione un Estudiante</option>
          {students.map((student) => (
            <option key={getStudentId(student._links.student.href)} value={student._links.student.href}>
              {student.name}
            </option>
          ))}
        </select>
        <select name="advisor">
          <option value="0">Seleccione un Consejero</option>
          {advisors.map((advisor) => (
            <option key={advisor._links.advisor.href} value={advisor._links.advisor.href}>
              {advisor.name}
            </option>
          ))}
        </select>
        <input type="date" name="date" placeholder="Fecha" />
        <button type="submit">Guardar</button>
      </form>
      {submitted && <div className="success-message">Record inserted successfully!</div>}
    </div>
  );
};

export default CounselingForm;
