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
  current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
  state: "Unreviewed" | "In Progress" | "Complete";
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
    (submission) => submission.state === "Complete"
  );

  return (
    <div
      onClick={toggleList}
      style={{
        border: "3px solid black",
        padding: "10px 20px",
        borderRadius: "10px",
        margin: "10px",
        display: "inline-block",
        position: "relative",
        width: "300px",
        height: isOpen ? "auto" : "60px",
        boxSizing: "border-box",
        cursor: "pointer",
        flexShrink: 0,
        backgroundColor: allComplete ? "#b0ffb0" : "white", // darker green for complete
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          fontSize: "25px",
          fontWeight: "bold",
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
        }}
      >
        {isOpen ? "▲" : "▼"}
      </div>
      {isOpen && (
        <div style={{ marginTop: "40px" }}>
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
                credit={submission.credit.number.toString()}
                student={submission.student}
                current_decision={submission.current_decision}
                state={submission.state}
                onClick={() => onSubmissionClick(submission.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreditGrouping;
