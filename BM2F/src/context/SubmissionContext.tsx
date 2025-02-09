import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

interface Submission {
  id: string;
  credit: { number: number; name: string };
  student: { first_name: string; last_name: string };
  current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
  state: "Unreviewed" | "In Progress" | "Complete";
  rationale: string;
  feedback: string; // Add feedback field
}

interface SubmissionContextProps {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  updateSubmission: (updatedSubmission: Submission) => void; // Add updateSubmission method
}

const SubmissionContext = createContext<SubmissionContextProps | undefined>(
  undefined
);

export const useSubmissions = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error("useSubmissions must be used within a SubmissionProvider");
  }
  return context;
};

export const SubmissionProvider: React.FC = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/readers/assigned_submissions/"
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
    };

    fetchSubmissions();
  }, []);

  const updateSubmission = (updatedSubmission: Submission) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) =>
        submission.id === updatedSubmission.id ? updatedSubmission : submission
      )
    );
  };

  return (
    <SubmissionContext.Provider
      value={{ submissions, setSubmissions, updateSubmission }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
