import CreditGrouping from "../CreditGrouping";
import MultiProgress from "react-multi-progress"; // Import the MultiProgress component
import "./SubmissionsList.css"; // Import CSS for styling

interface SubmissionsListProps {
  submissions: {
    credit: number;
    student: string;
    current_decision: "Undecided" | "TBD" | "Earned" | "Not Earned";
    state: "Unreviewed" | "In Progress" | "Complete";
  }[];
  onSubmissionClick: (student: string) => void;
}

const SubmissionsList = ({
  submissions,
  onSubmissionClick,
}: SubmissionsListProps) => {
  console.log("SubmissionsList received submissions:", submissions); // Add logging

  const groupedSubmissions = submissions.reduce((acc, submission) => {
    const creditNumber = submission.credit.number; // Ensure the correct credit number is used
    if (!acc[creditNumber]) {
      acc[creditNumber] = [];
    }
    acc[creditNumber].push(submission);
    return acc;
  }, {} as Record<number, SubmissionsListProps["submissions"]>);

  console.log("Grouped submissions:", groupedSubmissions); // Add logging

  const sortedGroupings = Object.entries(groupedSubmissions).sort(
    ([creditA], [creditB]) => {
      return Number(creditA) - Number(creditB); // Sort by credit number
    }
  );

  console.log("Sorted groupings:", sortedGroupings); // Add logging

  const totalSubmissions = submissions.length;
  const completeCount = submissions.filter(
    (sub) => sub.state === "Complete"
  ).length;
  const inProgressCount = submissions.filter(
    (sub) => sub.state === "In Progress"
  ).length;
  const unreviewedCount = submissions.filter(
    (sub) => sub.state === "Unreviewed"
  ).length;

  const completePercentage = (completeCount / totalSubmissions) * 100;
  const inProgressPercentage = (inProgressCount / totalSubmissions) * 100;
  const unreviewedPercentage = (unreviewedCount / totalSubmissions) * 100;

  const progressBarElements = [
    { value: completePercentage, color: "#32CD32" }, // Vibrant light green
    { value: inProgressPercentage, color: "#FFD700" }, // Vibrant yellow
    { value: unreviewedPercentage, color: "white" },
  ];

  return (
    <div
      className="submissions-list"
      style={{
        border: "3px solid black",
        padding: "0", // Remove padding to ensure edges are flush
        margin: "0",
        height: "100%", // Ensure the component takes up the full height of its parent
        flexGrow: 1, // Allow the component to grow and fill the available space
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        position: "relative",
        boxSizing: "border-box",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        className="sticky-header"
        style={{
          width: "100%",
          backgroundColor: "lightgray",
          textAlign: "left", // Align text to the left
          padding: "10px 10px", // Adjust padding to move text to the top left
          borderBottom: "3px solid black",
          position: "sticky",
          top: 0, // Ensure it sticks to the top
          left: 0, // Ensure it sticks to the left
          right: 0, // Ensure it sticks to the right
          zIndex: 1,
          boxSizing: "border-box",
          height: "90px", // Increase height to accommodate progress bar
          flexShrink: 0, // Prevent the rectangle from shrinking
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>Submissions List</div>
        <MultiProgress
          className="multi-progress-bar" // Add class for styling
          elements={progressBarElements}
          height={20}
        />
      </div>
      <style>
        {`
          .submissions-list::-webkit-scrollbar {
            display: none; /* For Chrome, Safari, and Opera */
          }
        `}
      </style>
      {sortedGroupings.map(([credit, submissions]) => (
        <CreditGrouping
          key={credit}
          credit={submissions[0].credit} // Ensure the correct credit object is passed
          submissions={submissions.sort((a, b) => {
            return a.student.last_name.localeCompare(b.student.last_name); // Sort by student's last name
          })}
          onSubmissionClick={onSubmissionClick}
        />
      ))}
    </div>
  );
};

export default SubmissionsList;
