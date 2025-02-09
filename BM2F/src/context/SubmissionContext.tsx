import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

interface Submission {
  id: string;
  credit: { number: number; name: string };
  student: { first_name: string; last_name: string };
  current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
  state: "Unreviewed" | "In Progress" | "Complete";
  rationale: string;
}

interface SubmissionContextProps {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
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

  return (
    <SubmissionContext.Provider value={{ submissions, setSubmissions }}>
      {children}
    </SubmissionContext.Provider>
  );
};
