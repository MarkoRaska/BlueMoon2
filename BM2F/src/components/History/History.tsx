import React from "react";

interface HistoryProps {
  history: string;
  onHistoryChange: (history: string) => void;
  student: string;
  submissionId: string;
}

const History: React.FC<HistoryProps> = ({
  history,
  onHistoryChange,
  student,
  submissionId,
}) => {
  return (
    <div>
      <h2>History for {student}</h2>
      <textarea
        value={history}
        onChange={(e) => onHistoryChange(e.target.value)}
      />
    </div>
  );
};

export default History;
