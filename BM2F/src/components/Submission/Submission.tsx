import React from "react";
import {
  FaQuestionCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisH,
} from "react-icons/fa";
import "./Submission.css"; // Import CSS for styling

interface SubmissionProps {
  credit: string;
  student: { first_name: string; last_name: string };
  current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
  state: string;
  onClick: () => void;
}

const decisionIcons = {
  Undecided: <FaQuestionCircle color="grey" size={24} />,
  TBD: <FaEllipsisH color="darkgoldenrod" size={24} />,
  Earned: <FaCheckCircle color="green" size={24} />,
  "Not Earned": <FaTimesCircle color="red" size={24} />,
};

const stateColors = {
  Unreviewed: "#ffffff", // white
  "In Progress": "#fffacd", // darker yellow
  Complete: "#d0ffd0", // darker green
};

const Submission = ({
  credit,
  student,
  current_decision,
  state,
  onClick,
}: SubmissionProps) => {
  const fullName = `${student.first_name} ${student.last_name}`;

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
        {decisionIcons[current_decision] || (
          <FaQuestionCircle color="grey" size={24} />
        )}
      </div>
    </div>
  );
};

export default Submission;
