import React from "react";

interface HistoryProps {
  history: string;
  onHistoryChange: (history: string) => void;
  student: string;
  submissionId: string;
  style?: React.CSSProperties; // Add style prop
}

const History: React.FC<HistoryProps> = ({ student, style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "#3d3d3d",
        color: "white",
        outline: "3px solid #242424",
        height: "calc(100% - 25px)", // Adjust height to span from bottom of SubmissionViewer to bottom of NotePad handle
        padding: "10px", // Ensure content does not overlap with handle
        marginTop: "22px", // Remove margin
        marginRight: "2px", // Add margin to the right to ensure border is visible
        flex: 1, // Use flex to ensure it spans the remaining width
      }}
    >
      <h2>History for {student}</h2>
    </div>
  );
};

export default History;
