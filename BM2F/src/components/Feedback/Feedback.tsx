import React, { useEffect, useState, useCallback } from "react";
import { Input, Select } from "antd";
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
  const { submissions, updateSubmission, toggleSubmissionStatus } =
    useSubmissions();
  const [decision, setDecision] = useState("TB");

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
    const submission = submissions.find((sub) => sub.id === submissionId);
    if (submission) {
      setDecision(submission.decision);
    }
  }, [submissionId, feedback, submissions]);

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

  const saveDecision = async (newDecision: string) => {
    try {
      await axiosInstance.post("/api/save_decision/", {
        submissionId,
        decision: newDecision,
      });
      setDecision(newDecision);
      updateSubmission({
        id: submissionId,
        decision: newDecision,
      });
    } catch (error) {
      console.error("Failed to save decision", error);
    }
  };

  const handleToggleStatus = () => {
    toggleSubmissionStatus(submissionId);
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
      <h2>{student}</h2>
      <h3>Credit: {credit}</h3>
      <Select
        value={decision}
        onChange={(value) => saveDecision(value)}
        style={{ width: 200, marginBottom: 10 }}
      >
        <Select.Option value="TB">TBD</Select.Option>
        <Select.Option value="EA">Earned</Select.Option>
        <Select.Option value="NE">Not Earned</Select.Option>
      </Select>
      <Input.TextArea
        value={feedbackState}
        onChange={(e) => handleFeedbackChange(e.target.value)}
        autoSize={{ minRows: 3, maxRows: 10 }}
      />
      <button onClick={handleToggleStatus}>Toggle Status</button>
    </div>
  );
};

export default Feedback;
