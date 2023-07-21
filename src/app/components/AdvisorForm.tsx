import React, { useEffect, useState } from "react";
import "./AdvisorForm.css"; // Import CSS for animation

interface Program {
  name: string;
  code: number;
  _links: Record<string, { href: string }>;
}

interface Advisor {
  name: string;
  email: string;
  phone: string;
  program: string;
}

const AdvisorForm = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [advisor, setAdvisor] = useState<Advisor>({
    name: "",
    email: "",
    phone: "",
    program: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:8080/programs");
        const data = await response.json();
        setPrograms(data._embedded.programs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setAdvisor({
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      program: e.target.program.value,
    });

    console.log(advisor);

    try {
      const response = await fetch("http://localhost:8080/advisors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(advisor),
      });

      const data = await response.json();
      console.log(data);

      e.target.reset(); // Clear the form
      setSubmitted(true); // Set the submitted state to true
      setTimeout(() => setSubmitted(false), 3000); // Reset the submitted state after 3 seconds
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre" />
        <input type="email" name="email" placeholder="Correo" />
        <input type="text" name="phone" placeholder="Teléfono" />
        <select name="program">
          <option value="0">Seleccione un programa</option>
          {programs.map((program) => (
            <option key={program.code} value={program._links.program.href}>
              {program.name}
            </option>
          ))}
        </select>
        <button type="submit">Guardar</button>
      </form>
      {submitted && <div className="success-message">Record inserted successfully!</div>}
    </div>
  );
};

export default AdvisorForm;
