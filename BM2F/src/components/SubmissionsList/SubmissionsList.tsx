import CreditGrouping from "../CreditGrouping";
import MultiProgress from "react-multi-progress";
import "./SubmissionsList.css";

interface SubmissionsListProps {
  submissions: {
    credit: { number: number };
    student: { first_name: string; last_name: string };
    current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
    status: "UN" | "RE" | "CO";
  }[];
  onSubmissionClick: (student: string) => void;
}

const SubmissionsList = ({
  submissions,
  onSubmissionClick,
}: SubmissionsListProps) => {
  const groupedSubmissions = submissions.reduce((acc, submission) => {
    const creditNumber = submission.credit.number;
    if (!acc[creditNumber]) {
      acc[creditNumber] = [];
    }
    acc[creditNumber].push(submission);
    return acc;
  }, {} as Record<number, SubmissionsListProps["submissions"]>);

  const sortedGroupings = Object.entries(groupedSubmissions).sort(
    ([creditA], [creditB]) => {
      return Number(creditA) - Number(creditB);
    }
  );

  const totalSubmissions = submissions.length;
  const completeCount = submissions.filter((sub) => sub.status === "CO").length;
  const inProgressCount = submissions.filter(
    (sub) => sub.status === "RE"
  ).length;
  const unreviewedCount = submissions.filter(
    (sub) => sub.status === "UN"
  ).length;

  const completePercentage = (completeCount / totalSubmissions) * 100;
  const inProgressPercentage = (inProgressCount / totalSubmissions) * 100;
  const unreviewedPercentage = (unreviewedCount / totalSubmissions) * 100;

  const progressBarElements = [
    { value: completePercentage, color: "#32CD32" },
    { value: inProgressPercentage, color: "#FFD700" },
    { value: unreviewedPercentage, color: "#FFFFFF" },
  ];

  return (
    <div
      className="submissions-list"
      style={{
        border: "3px solid #0091ff",
        padding: "0",
        margin: "0",
        height: "100%",
        flexGrow: 1,
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        position: "relative",
        boxSizing: "border-box",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        backgroundColor: "#3d3d3d",
        color: "white",
      }}
    >
      <div
        className="sticky-header"
        style={{
          width: "100%",
          backgroundColor: "#242424",
          textAlign: "left",
          padding: "10px 10px",
          borderBottom: "1px solid white",
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          boxSizing: "border-box",
          height: "90px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
          paddingBottom: "10px",
          marginBottom: "5px",
        }}
      >
        <div style={{ color: "white" }}>Submissions List</div>
        <MultiProgress
          className="multi-progress-bar"
          elements={progressBarElements}
          height={20}
        />
      </div>
      <style>
        {`
          .submissions-list::-webkit-scrollbar {
            display: none;  
          }
        `}
      </style>
      {sortedGroupings.map(([credit, submissions]) => (
        <CreditGrouping
          key={credit}
          credit={submissions[0].credit}
          submissions={submissions.sort((a, b) => {
            return a.student.last_name.localeCompare(b.student.last_name);
          })}
          onSubmissionClick={onSubmissionClick}
        />
      ))}
    </div>
  );
};

export default SubmissionsList;
