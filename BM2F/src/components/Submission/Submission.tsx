import React, { useEffect, useState } from "react";
import {
  FaQuestionCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisH,
} from "react-icons/fa";
import "./Submission.css";

interface SubmissionProps {
  id: string;
  credit: string;
  student: { first_name: string; last_name: string };
  decision: "UN" | "TB" | "EA" | "NE";
  state: string;
  onClick: () => void;
}

const decisionIcons = {
  UN: <FaQuestionCircle color="grey" size={24} />,
  TB: <FaEllipsisH color="darkgoldenrod" size={24} />,
  EA: <FaCheckCircle color="green" size={24} />,
  NE: <FaTimesCircle color="red" size={24} />,
};

const stateColors = {
  Unreviewed: "#ffffff",
  "In Progress": "#fffacd",
  Complete: "#d0ffd0",
};

const Submission = ({
  id,
  credit,
  student,
  decision,
  state,
  onClick,
}: SubmissionProps) => {
  const [currentDecision, setCurrentDecision] = useState(decision);
  const fullName = `${student.first_name} ${student.last_name}`;

  useEffect(() => {
    setCurrentDecision(decision);
  }, [decision]);

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

  return (
    <div
      onClick={onClick}
      className="submission-container"
      style={{
        display: "flex",
        border: "3px solid black",
        padding: "10px",
        width: "250px",
        height: "50px",
        borderRadius: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: stateColors[state],
        cursor: "pointer",
      }}
    >
      <p style={{ fontSize: "20px", marginRight: "20px" }}>{credit}</p>
      <p className="submission-name" style={{ flex: 1 }}>
        {fullName}
      </p>
      <div style={{ fontSize: "24px" }}>
        {decisionIcons[currentDecision] || (
          <FaQuestionCircle color="grey" size={24} />
        )}
      </div>
    </div>
  );
};

export default Submission;
