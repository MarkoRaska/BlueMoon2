import React, { useEffect, useState } from "react";
import TextEditor from "../TextEditor";
import "./Feedback.css";

interface FeedbackProps {
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  student: string;
  credit: number;
}

const Feedback = ({
  feedback,
  onFeedbackChange,
  student,
  credit,
}: FeedbackProps) => {
  const [, setLeftOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);

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
      <TextEditor value={feedback} onChange={onFeedbackChange} />
    </div>
  );
};

export default Feedback;
