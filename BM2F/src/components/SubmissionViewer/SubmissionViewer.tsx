import { useEffect, useState } from "react";
import Feedback from "../Feedback";
import NotePad from "../NotePad";
import { useSubmissions } from "../../context/SubmissionContext"; // Import useSubmissions hook
import "./SubmissionViewer.css";

interface SubmissionViewerProps {
  submissionId: string | null; // Change to submissionId
  notePadContent: string;
  onNotePadChange: (student: string, content: string) => void;
  isSubmissionListOpen: boolean; // Add prop to check if submission list is open
}

const SubmissionViewer = ({
  submissionId,
  notePadContent,
  onNotePadChange,
  isSubmissionListOpen,
}: SubmissionViewerProps) => {
  const { submissions, updateSubmission } = useSubmissions(); // Get submissions and updateSubmission from context
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");

  const submission = submissions.find(
    (submission) => submission.id === submissionId
  );

  useEffect(() => {
    console.log("SubmissionViewer received submission:", submission?.id); // Simplified logging
    setFeedback(submission ? submission.feedback : "");
    setNotes(submission ? submission.notes : ""); // Set notes state
  }, [submissionId]);

  const handleFeedbackChange = (feedback: string) => {
    setFeedback(feedback);
    if (submission) {
      updateSubmission({ ...submission, feedback });
    }
  };

  const handleNotesChange = (notes: string) => {
    setNotes(notes);
    if (submission) {
      updateSubmission({ ...submission, notes });
    }
  };

  if (!submission) {
    return <div>Select a submission to view details</div>;
  }

  return (
    <div
      className="submission-viewer-container"
      style={{
        position: "relative",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        height: "100%",
        width: "100%",
        border: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          boxSizing: "border-box",
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
          border: "3px solid black",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "60px",
            backgroundColor: "#f0f0f0",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative", // Use relative positioning
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "25%", // Center in the first half
              transform: "translateX(-50%)",
            }}
          >
            <p style={{ fontSize: "20px", margin: "0" }}>Submission</p>
          </div>
          <div
            style={{
              position: "absolute",
              right: "25%", // Center in the second half
              transform: "translateX(50%)",
            }}
          >
            <p style={{ fontSize: "20px", margin: "0" }}>Feedback</p>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}>
          <Feedback
            feedback={feedback}
            onFeedbackChange={handleFeedbackChange}
            student={`${submission.student.first_name} ${submission.student.last_name}`}
            credit={submission.credit.number}
            submissionId={submission.id} // Ensure submissionId is passed correctly
          />
        </div>
        <NotePad
          student={`${submission.student.first_name} ${submission.student.last_name}`}
          content={notes} // Pass notes state to NotePad
          onContentChange={(content) =>
            onNotePadChange(
              `${submission.student.first_name} ${submission.student.last_name}`,
              content
            )
          }
          submissionId={submission.id} // Ensure submissionId is passed correctly
        />
      </div>
    </div>
  );
};

export default SubmissionViewer;
