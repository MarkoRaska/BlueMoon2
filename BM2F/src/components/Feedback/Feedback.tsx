import React, { useEffect, useState, useCallback } from "react";
import { Input, Select, Button } from "antd";
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
  cycle: string; // Add this line
}

const Feedback = ({
  feedback,
  onFeedbackChange,
  student,
  credit,
  submissionId,
  cycle, // Add this line
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

  const decisionText = (decision: string) => {
    switch (decision) {
      case "TB":
        return "To be determined";
      case "EA":
        return "Credit Earned";
      case "NE":
        return "Credit Not Yet Earned";
      default:
        return decision;
    }
  };

  const submission = submissions.find((sub) => sub.id === submissionId);

  return (
    <div
      className="feedback-container"
      style={{
        border: "none",
        padding: "10px",
        boxSizing: "border-box",
        backgroundColor: "#3d3d3d",
        color: "white",
        zIndex: 1000,
        overflowY: "auto",
        bottom: `${bottomOffset}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "70px", // Adjust for navbar height
      }}
    >
      <div
        style={{
          width: "8.5in",
          height: "11in",
          backgroundColor: "#242424",
          color: "white",
          padding: "0.8in",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ color: "white" }}>{student}</h2>
            <h3 style={{ color: "white" }}>{cycle}</h3>{" "}
            {/* Update cycle format */}
            <h3 style={{ color: "white" }}>{credit}</h3>{" "}
            {/* Update credit format */}
          </div>
        </div>
        {submission?.status === "CO" ? (
          <>
            <h1
              style={{
                color:
                  decision === "EA"
                    ? "green"
                    : decision === "NE"
                    ? "red"
                    : "yellow",
                marginTop: "4px",
              }}
            >
              {decisionText(decision)}
            </h1>
            <h2
              style={{
                color: "lightgrey",
                fontSize: "20px",
                marginTop: "24px",
              }}
            >
              Feedback
            </h2>{" "}
            {/* Add whitespace */}
            <Input.TextArea
              value={feedbackState}
              readOnly // Make the text editor read-only
              style={{
                backgroundColor: "#242424",
                color: "lightgrey",
                maxHeight: "calc(100% - 150px)",
                minHeight: "calc(100% - 150px)",
                marginTop: "12px",
                border: "none",
                boxShadow: "none",
                resize: "none",
                textAlign: "left",
                padding: 0,
                fontSize: "15px",
              }}
            />
          </>
        ) : (
          <>
            <Select
              value={decision}
              onChange={(value) => saveDecision(value)}
              style={{
                width: "auto", // Adjust width to fit the text
                marginBottom: 0, // Adjust bottom margin to hug the text
                backgroundColor: "#242424",
                color: "white",
                fontSize: "16px", // Match font size
                fontFamily: "inherit", // Match font family
                border: "none", // Remove outline
                boxShadow: "none", // Remove outline
                textAlign: "left", // Align text to the left
                paddingLeft: 0, // Remove left padding
              }}
              dropdownStyle={{ backgroundColor: "#242424" }}
              optionLabelProp="label"
              dropdownRender={(menu) => (
                <div style={{ backgroundColor: "#242424" }}>{menu}</div>
              )}
              dropdownMatchSelectWidth={false}
              suffixIcon={null} // Remove the dropdown arrow
            >
              <Select.Option
                value="TB"
                style={{
                  color: "yellow",
                  backgroundColor: "#242424",
                  textAlign: "left",
                  paddingLeft: 0, // Remove left padding
                }}
                label={
                  <span style={{ color: "yellow" }}>To be determined</span>
                }
              >
                To be determined
              </Select.Option>
              <Select.Option
                value="EA"
                style={{
                  color: "green",
                  backgroundColor: "#242424",
                  textAlign: "left",
                  paddingLeft: 0, // Remove left padding
                }}
                label={<span style={{ color: "green" }}>Credit Earned</span>}
              >
                Credit Earned
              </Select.Option>
              <Select.Option
                value="NE"
                style={{
                  color: "red",
                  backgroundColor: "#242424",
                  textAlign: "left",
                  paddingLeft: 0, // Remove left padding
                }}
                label={
                  <span style={{ color: "red" }}>Credit Not Yet Earned</span>
                }
              >
                Credit Not Yet Earned
              </Select.Option>
            </Select>
            <h2
              style={{
                color: "lightgrey",
                fontSize: "20px",
                marginTop: "20px",
              }}
            >
              Feedback
            </h2>{" "}
            {/* Add whitespace */}
            <Input.TextArea
              value={feedbackState}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              style={{
                backgroundColor: "#242424",
                color: "lightgrey", // Change font color to light grey
                maxHeight: "calc(100% - 150px)",
                minHeight: "calc(100% - 150px)",
                marginTop: "12px",
                border: "none", // Remove border
                boxShadow: "none", // Remove border that fades in on focus
                resize: "none", // Remove the ability to adjust the textbox
                textAlign: "left", // Align text to the left
                padding: 0, // Remove padding
                fontSize: "15px", // Increase font size
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
