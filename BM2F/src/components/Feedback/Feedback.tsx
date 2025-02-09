import React, { useEffect, useState, useCallback } from "react";
import TextEditor from "../TextEditor";
import axiosInstance from "../../utils/axiosInstance"; // Import axiosInstance for API calls
import { debounce } from "../../utils/debounce"; // Import debounce function
import { useSubmissions } from "../../context/SubmissionContext"; // Import useSubmissions hook
import "./Feedback.css";

interface FeedbackProps {
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  student: string;
  credit: number;
  submissionId: string; // Add submissionId prop
}

const Feedback = ({
  feedback,
  onFeedbackChange,
  student,
  credit,
  submissionId, // Add submissionId prop
}: FeedbackProps) => {
  const [, setLeftOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const { updateSubmission } = useSubmissions(); // Get updateSubmission method from context

  useEffect(() => {
    const updateOffsets = () => {
      const submissionsList = document.querySelector(".submissions-list");
      const notepadHandle = document.querySelector(".notepad-handle");
      if (submissionsList && notepadHandle) {
        const submissionsRect = submissionsList.getBoundingClientRect();
        setLeftOffset(submissionsRect.right); // Exclude border width
      }
    };

    const handleNotepadHeightChange = (e: CustomEvent) => {
      setBottomOffset(e.detail); // Update bottom offset based on notepad height
    };

    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    window.addEventListener(
      "notepadHeightChange",
      handleNotepadHeightChange as EventListener
    ); // Listen for custom event
    return () => {
      window.removeEventListener("resize", updateOffsets);
      window.removeEventListener(
        "notepadHeightChange",
        handleNotepadHeightChange as EventListener
      ); // Clean up event listener
    };
  }, []);

  const saveFeedback = async (newFeedback: string) => {
    console.log("Saving feedback:", newFeedback); // Debugging log
    try {
      const response = await axiosInstance.post("/api/save_feedback/", {
        submissionId,
        feedback: newFeedback,
      });
      console.log("Feedback saved response:", response.data); // Debugging log
      updateSubmission({ ...response.data, feedback: newFeedback }); // Update context with new feedback
    } catch (error) {
      console.error("Failed to save feedback", error);
    }
  };

  const debouncedSaveFeedback = useCallback(debounce(saveFeedback, 500), []);

  const handleFeedbackChange = (newFeedback: string) => {
    onFeedbackChange(newFeedback);
    debouncedSaveFeedback(newFeedback);
  };

  return (
    <div
      className="feedback-container"
      style={{
        border: "none", // Ensure there are no borders causing the issue
        padding: "10px",
        boxSizing: "border-box",
        backgroundColor: "white",
        zIndex: 1000,
        overflowY: "auto", // Make the frame scrollable if content doesn't fit
        bottom: `${bottomOffset}px`, // Dynamically set bottom offset
      }}
    >
      <h2>
        Feedback for {student} (Credit: {credit})
      </h2>
      <TextEditor value={feedback} onChange={handleFeedbackChange} />
    </div>
  );
};

export default Feedback;
