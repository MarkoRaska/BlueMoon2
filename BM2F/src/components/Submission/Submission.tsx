import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSubmissions } from "../../context/SubmissionContext";
import "./Submission.css";

interface SubmissionProps {
  id: string;
  credit: string;
  student: { first_name: string; last_name: string };
  decision: "TB" | "EA" | "NE";
  status: string;
  onClick: () => void;
}

const decisionIcons = {
  TB: <FaQuestionCircle color="darkgoldenrod" size={24} />,
  EA: <FaCheckCircle color="green" size={24} />,
  NE: <FaTimesCircle color="red" size={24} />,
};

const statusColors = {
  UN: "#ffffff", // Unreviewed
  RE: "#fffacd", // In Progress
  CO: "#d0ffd0", // Complete
};

const statusBorders = {
  UN: "3px solid white", // Unreviewed
  RE: "3px solid yellow", // In Progress
  CO: "3px solid #32CD32", // Complete
};

const statusTextColors = {
  UN: "white", // Unreviewed
  RE: "yellow", // In Progress
  CO: "#32CD32", // Complete
};

const Submission = ({
  id,
  credit,
  student,
  decision,
  status,
  onClick,
}: SubmissionProps) => {
  const { submissions } = useSubmissions();
  const [currentDecision, setCurrentDecision] = useState(decision);
  const [currentStatus, setCurrentStatus] = useState(status);
  const fullName = `${student.first_name} ${student.last_name}`;

  useEffect(() => {
    const submission = submissions.find((sub) => sub.id === id);
    if (submission) {
      setCurrentDecision(submission.decision);
      setCurrentStatus(submission.status);
    }
  }, [id, submissions]);

  useEffect(() => {
    const handleDecisionChange = (e: CustomEvent) => {
      if (e.detail.submissionId === id) {
        setCurrentDecision(e.detail.newDecision);
      }
    };

    window.addEventListener(
      "decisionChange",
      handleDecisionChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "decisionChange",
        handleDecisionChange as EventListener
      );
    };
  }, [id]);

  useEffect(() => {
    const handleStatusChange = (e: CustomEvent) => {
      if (e.detail.submissionId === id) {
        setCurrentStatus(e.detail.newStatus);
      }
    };

    window.addEventListener(
      "statusChange",
      handleStatusChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "statusChange",
        handleStatusChange as EventListener
      );
    };
  }, [id]);

  useEffect(() => {
    console.log(`Student: ${fullName}, Status: ${currentStatus}`);
  }, [fullName, currentStatus]);

  return (
    <div
      onClick={onClick}
      className="submission-container"
      style={{
        display: "flex",
        border: statusBorders[currentStatus],
        padding: "10px",
        width: "250px",
        height: "50px",
        borderRadius: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#242424",
        cursor: "pointer",
        color: statusTextColors[currentStatus],
      }}
    >
      <p
        style={{
          fontSize: "20px",
          marginRight: "20px",
          color: statusTextColors[currentStatus],
        }}
      >
        {credit}
      </p>
      <p
        className="submission-name"
        style={{ flex: 1, color: statusTextColors[currentStatus] }}
      >
        {fullName}
      </p>
      <div style={{ fontSize: "24px" }}>{decisionIcons[currentDecision]}</div>
    </div>
  );
};

export default Submission;
