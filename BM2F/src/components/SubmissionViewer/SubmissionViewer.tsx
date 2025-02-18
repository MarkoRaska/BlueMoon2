import { useEffect, useState } from "react";
import Feedback from "../Feedback";
import NotePad from "../NotePad";
// import History from "../History"; // Remove History import
import { useSubmissions } from "../../context/SubmissionContext";
import "./SubmissionViewer.css";
import { Button } from "antd";

interface SubmissionViewerProps {
  submissionId: string | null;
  notePadContent: string;
  onNotePadChange: (student: string, content: string) => void;
  isSubmissionListOpen: boolean;
  onNavigate: (submissionId: string) => void;
}

const SubmissionViewer = ({
  submissionId,
  notePadContent,
  onNotePadChange,
  isSubmissionListOpen,
  onNavigate,
}: SubmissionViewerProps) => {
  const { submissions, updateSubmission, toggleSubmissionStatus } =
    useSubmissions();
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("Submission");

  const submission = submissions.find(
    (submission) => submission.id === submissionId
  );

  useEffect(() => {
    setFeedback(submission ? submission.feedback : "");
    setNotes(submission ? submission.notes : "");
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

  const handlePrevious = () => {
    const currentIndex = submissions.findIndex(
      (sub) => sub.id === submissionId
    );
    if (currentIndex > 0) {
      onNavigate(submissions[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = submissions.findIndex(
      (sub) => sub.id === submissionId
    );
    if (currentIndex < submissions.length - 1) {
      onNavigate(submissions[currentIndex + 1].id);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleToggleStatus = () => {
    if (submission) {
      toggleSubmissionStatus(submission.id);
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
        backgroundColor: "#242424",
        color: "white",
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
          backgroundColor: "#242424",
          zIndex: 1000,
          border: "3px solid",
          borderImage: "linear-gradient(to right, #0091ff, #00ccff) 1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "60px",
            backgroundColor: "#242424",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1002, // Ensure it stays above other components
          }}
        >
          <button
            onClick={handlePrevious}
            style={{
              position: "absolute",
              left: "10px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "white",
            }}
          >
            &larr;
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%", // Ensure it spans the full width
              padding: "0 30%", // Add padding to move buttons inward
            }}
          >
            <p
              style={{
                fontSize: "20px",
                margin: "0",
                cursor: "pointer",
                color: "white",
                textAlign: "center", // Center text within each half
              }}
              onClick={() => handleTabClick("Submission")}
            >
              Submission
            </p>
            <p
              style={{
                fontSize: "20px",
                margin: "0",
                cursor: "pointer",
                color: "white",
                textAlign: "center", // Center text within each half
              }}
              onClick={() => handleTabClick("Feedback")}
            >
              Feedback
            </p>
          </div>
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "white",
            }}
          >
            &rarr;
          </button>
          <Button
            onClick={handleToggleStatus}
            style={{
              position: "absolute",
              right: "10px",
              top: "70px",
              backgroundColor: submission?.status === "CO" ? "white" : "green",
              color: submission?.status === "CO" ? "black" : "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              zIndex: 1001, // Ensure it stays above other components
              marginTop: "5px",
            }}
          >
            {submission?.status === "CO" ? "Uncomplete" : "Complete"}
          </Button>
        </div>
        <div
          style={{ flexGrow: 1, backgroundColor: "#3d3d3d", color: "white" }}
        >
          {activeTab === "Submission" && (
            <div>
              <h2 style={{ color: "white" }}>
                Submission for {submission.student.first_name}{" "}
                {submission.student.last_name}
              </h2>
              <p style={{ color: "white" }}>{submission.content}</p>
            </div>
          )}
          {activeTab === "Feedback" && (
            <Feedback
              feedback={feedback}
              onFeedbackChange={handleFeedbackChange}
              student={`${submission.student.first_name} ${submission.student.last_name}`}
              credit={`${submission.credit.number} ${submission.credit.name}`} // Update credit format
              submissionId={submission.id}
              cycle={`${submission.cycle.season} ${submission.cycle.year}`} // Correct cycle prop
            />
          )}
        </div>
        <NotePad
          student={`${submission.student.first_name} ${submission.student.last_name}`}
          content={notes}
          onContentChange={(content) =>
            onNotePadChange(
              `${submission.student.first_name} ${submission.student.last_name}`,
              content
            )
          }
          submissionId={submission.id}
        />
      </div>
    </div>
  );
};

export default SubmissionViewer;
