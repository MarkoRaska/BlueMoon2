import React, { useEffect, useState, useCallback } from "react";
import TextEditor from "../TextEditor";
import axiosInstance from "../../utils/axiosInstance";
import { debounce } from "../../utils/debounce";
import { useSubmissions } from "../../context/SubmissionContext";
import "./Feedback.css";

interface FeedbackProps {
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  student: string;
  credit: number;
  submissionId: string;
}

const Feedback = ({
  feedback,
  onFeedbackChange,
  student,
  credit,
  submissionId,
}: FeedbackProps) => {
  const [, setLeftOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const { updateSubmission } = useSubmissions();

  useEffect(() => {
    const updateOffsets = () => {
      const submissionsList = document.querySelector(".submissions-list");
      const notepadHandle = document.querySelector(".notepad-handle");
      if (submissionsList && notepadHandle) {
        const submissionsRect = submissionsList.getBoundingClientRect();
        setLeftOffset(submissionsRect.right);
      }
    };

    const handleNotepadHeightChange = (e: CustomEvent) => {
      setBottomOffset(e.detail);
    };

    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    window.addEventListener(
      "notepadHeightChange",
      handleNotepadHeightChange as EventListener
    );
    return () => {
      window.removeEventListener("resize", updateOffsets);
      window.removeEventListener(
        "notepadHeightChange",
        handleNotepadHeightChange as EventListener
      );
    };
  }, []);

  const [feedbackState, setFeedbackState] = useState(feedback);

  useEffect(() => {
    setFeedbackState(feedback);
  }, [feedback]);

  useEffect(() => {
    setFeedbackState(feedback);
  }, [submissionId, feedback]);

  const saveFeedback = async (newFeedback: string) => {
    try {
      const response = await axiosInstance.post("/api/save_feedback/", {
        submissionId,
        feedback: newFeedback,
      });
      updateSubmission({
        ...response.data,
        id: submissionId,
        feedback: newFeedback,
      });
    } catch (error) {
      console.error("Failed to save feedback", error);
    }
  };

  const debouncedSaveFeedback = useCallback(debounce(saveFeedback, 500), [
    submissionId,
  ]);

  const handleFeedbackChange = (newFeedback: string) => {
    setFeedbackState(newFeedback);
    onFeedbackChange(newFeedback);
    debouncedSaveFeedback(newFeedback);
  };

  return (
    <div
      className="feedback-container"
      style={{
        border: "none",
        padding: "10px",
        boxSizing: "border-box",
        backgroundColor: "white",
        zIndex: 1000,
        overflowY: "auto",
        bottom: `${bottomOffset}px`,
      }}
    >
      <h2>
        Feedback for {student} (Credit: {credit})
      </h2>
      <TextEditor value={feedbackState} onChange={handleFeedbackChange} />
    </div>
  );
};

export default Feedback;
