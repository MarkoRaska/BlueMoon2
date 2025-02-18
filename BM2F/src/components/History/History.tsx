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
      }}
    >
      <h2>History for {student}</h2>
    </div>
  );
};

export default History;
