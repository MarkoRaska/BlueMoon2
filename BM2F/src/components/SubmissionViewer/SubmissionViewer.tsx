import { useEffect, useState } from "react";
import Feedback from "../Feedback";
import NotePad from "../NotePad";
import History from "../History";
import { useSubmissions } from "../../context/SubmissionContext";
import "./SubmissionViewer.css";

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
  const { submissions, updateSubmission } = useSubmissions();
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
            position: "relative",
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
            }}
          >
            &larr;
          </button>
          <div
            style={{
              position: "absolute",
              left: "25%",
              transform: "translateX(-50%)",
            }}
          >
            <p
              style={{ fontSize: "20px", margin: "0", cursor: "pointer" }}
              onClick={() => handleTabClick("Submission")}
            >
              Submission
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <p
              style={{ fontSize: "20px", margin: "0", cursor: "pointer" }}
              onClick={() => handleTabClick("Feedback")}
            >
              Feedback
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              left: "75%",
              transform: "translateX(-50%)",
            }}
          >
            <p
              style={{ fontSize: "20px", margin: "0", cursor: "pointer" }}
              onClick={() => handleTabClick("History")}
            >
              History
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
            }}
          >
            &rarr;
          </button>
        </div>
        <div style={{ flexGrow: 1 }}>
          {activeTab === "Submission" && (
            <div>
              <h2>
                Submission for {submission.student.first_name}{" "}
                {submission.student.last_name}
              </h2>
              <p>{submission.content}</p>
            </div>
          )}
          {activeTab === "Feedback" && (
            <Feedback
              feedback={feedback}
              onFeedbackChange={handleFeedbackChange}
              student={`${submission.student.first_name} ${submission.student.last_name}`}
              credit={submission.credit.number}
              submissionId={submission.id}
            />
          )}
          {activeTab === "History" && (
            <History
              history={notes}
              onHistoryChange={handleNotesChange}
              student={`${submission.student.first_name} ${submission.student.last_name}`}
              submissionId={submission.id}
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
