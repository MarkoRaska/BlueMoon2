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
    <div>
      <h2>Rationale for {student}</h2>
      <textarea
        value={rationale}
        onChange={(e) => onRationaleChange(e.target.value)}
      />
    </div>
  );
};

export default Rationale;
