import React from "react";

interface RationaleProps {
  rationale: string;
  onRationaleChange: (rationale: string) => void;
  student: string;
  submissionId: string;
}

const Rationale: React.FC<RationaleProps> = ({
  rationale,
  onRationaleChange,
  student,
  submissionId,
}) => {
  return (
    <div style={{ backgroundColor: "#3d3d3d", color: "white" }}>
      <h2>Rationale for {student}</h2>
      <textarea
        value={rationale}
        onChange={(e) => onRationaleChange(e.target.value)}
        style={{ backgroundColor: "#3d3d3d", color: "white" }}
      />
    </div>
  );
};

export default Rationale;
