import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

interface Submission {
  id: string;
  credit: { number: number; name: string };
  student: { first_name: string; last_name: string };
  current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
  status: "UN" | "RE" | "CO";
  rationale: string;
  feedback: string;
  notes: string;
  cycle: string; // Add this line
}

interface SubmissionContextProps {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  updateSubmission: (updatedSubmission: Submission) => void;
  toggleSubmissionStatus: (submissionId: string) => void;
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
      const token = localStorage.getItem("token");
      if (!token) {
        return; // Exit if no token is found
      }

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
    setSubmissions((prevSubmissions) => {
      const updatedSubmissions = prevSubmissions.map((submission) => {
        if (submission.id === updatedSubmission.id) {
          // Check feedback and update status accordingly
          const newStatus =
            updatedSubmission.feedback === undefined
              ? submission.status
              : submission.status === "UN" && updatedSubmission.feedback.trim()
              ? "RE"
              : submission.status === "RE" && !updatedSubmission.feedback.trim()
              ? "UN"
              : submission.status;
          return { ...submission, ...updatedSubmission, status: newStatus };
        }
        return submission;
      });
      return updatedSubmissions;
    });
  };

  const toggleSubmissionStatus = async (submissionId: string) => {
    try {
      const response = await axiosInstance.post(
        "/api/change_submission_status/",
        {
          submissionId,
        }
      );
      const newStatus = response.data.new_status;
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission.id === submissionId
            ? { ...submission, status: newStatus }
            : submission
        )
      );
    } catch (error) {
      console.error("Failed to change submission status", error);
    }
  };

  return (
    <SubmissionContext.Provider
      value={{
        submissions,
        setSubmissions,
        updateSubmission,
        toggleSubmissionStatus,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
