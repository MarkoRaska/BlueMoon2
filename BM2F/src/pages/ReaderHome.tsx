import { useState, useEffect } from "react";
import SubmissionsList from "../components/SubmissionsList";
import SubmissionViewer from "../components/SubmissionViewer";
import Navbar from "../components/Navbar";
import { useSubmissions } from "../context/SubmissionContext";

const ReaderHome = () => {
  const { submissions } = useSubmissions();

  const [sortedSubmissions, setSortedSubmissions] = useState(submissions);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [notePadContents, setNotePadContents] = useState<
    Record<string, string>
  >({});
  const [isSubmissionListOpen, setIsSubmissionListOpen] = useState(true);

  useEffect(() => {
    const sorted = [...submissions].sort((a, b) => {
      if (a.credit.number !== b.credit.number) {
        return a.credit.number - b.credit.number;
      }
      return a.student.last_name.localeCompare(b.student.last_name);
    });
    setSortedSubmissions(sorted);
  }, [submissions]);

  const handleSubmissionClick = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
  };

  const handleNotePadChange = (student: string, content: string) => {
    setNotePadContents((prevContents) => ({
      ...prevContents,
      [student]: content,
    }));
  };

  const handleIconClick = () => {
    setIsSubmissionListOpen(!isSubmissionListOpen);
  };

  const handleNavigate = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
  };

  const selectedSubmissionData = sortedSubmissions.find(
    (submission) => submission.id === selectedSubmissionId
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#242424",
        color: "white",
      }}
    >
      <Navbar onIconClick={handleIconClick} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        {isSubmissionListOpen && (
          <div
            style={{
              maxHeight: "calc(100vh - 70px)",
              flexShrink: 0,
              backgroundColor: "#242424",
            }}
          >
            <SubmissionsList
              submissions={sortedSubmissions}
              onSubmissionClick={handleSubmissionClick}
            />
          </div>
        )}
        <div
          style={{
            flexGrow: 1,
            height: "calc(100vh - 70px)",
            backgroundColor: "#242424",
          }}
        >
          {selectedSubmissionData ? (
            <SubmissionViewer
              submissionId={selectedSubmissionId}
              notePadContent={
                notePadContents[
                  `${selectedSubmissionData.student.first_name} ${selectedSubmissionData.student.last_name}`
                ] || ""
              }
              onNotePadChange={handleNotePadChange}
              isSubmissionListOpen={isSubmissionListOpen}
              onNavigate={handleNavigate}
            />
          ) : (
            <div>Select a submission to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderHome;
