import { useState } from "react";
import Submission from "../Submission";

interface Credit {
  number: number;
  name: string;
}

interface Submission {
  id: string;
  credit: Credit;
  student: { first_name: string; last_name: string };
  decision: "TB" | "EA" | "NE";
  status: "Unreviewed" | "In Progress" | "Complete";
}

interface CreditGroupingProps {
  credit: Credit;
  submissions: Submission[];
  onSubmissionClick: (submissionId: string) => void;
}

const CreditGrouping = ({
  credit,
  submissions,
  onSubmissionClick,
}: CreditGroupingProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!credit) {
    return <div>Error: Credit information is missing.</div>;
  }

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const allComplete = submissions.every(
    (submission) => submission.status === "Complete"
  );

  return (
    <div
      onClick={toggleList}
      style={{
        border: "3px solid black",
        padding: "10px 13px",
        borderRadius: "10px",
        margin: "5px", // Reduced margin from 10px to 5px
        display: "inline-block",
        position: "relative",
        width: "fit-content",
        height: isOpen ? "auto" : "60px",
        boxSizing: "border-box",
        cursor: "pointer",
        flexShrink: 0,
        backgroundColor: allComplete ? "#b0ffb0" : "#242424",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          fontSize: "25px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {credit.number}
      </div>
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "10px",
          fontSize: "20px",
          color: "white",
        }}
      >
        {isOpen ? "▲" : "▼"}
      </div>
      {isOpen ? (
        <div style={{ marginTop: "40px", color: "white" }}>
          {submissions.map((submission, index) => (
            <div
              key={submission.id}
              style={{ marginBottom: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                onSubmissionClick(submission.id);
              }}
            >
              <Submission
                id={submission.id}
                credit={submission.credit.number.toString()}
                student={submission.student}
                decision={submission.decision}
                status={submission.status}
                onClick={() => onSubmissionClick(submission.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ visibility: "hidden", height: "0" }}>
          <Submission
            id="placeholder"
            credit={credit.number.toString()}
            student={{ first_name: "", last_name: "" }}
            decision="TB"
            status="Unreviewed"
            onClick={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default CreditGrouping;
