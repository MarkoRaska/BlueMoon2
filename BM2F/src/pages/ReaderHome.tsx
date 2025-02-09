import { useState } from "react";
import SubmissionsList from "../components/SubmissionsList";
import SubmissionViewer from "../components/SubmissionViewer";
import Navbar from "../components/Navbar";
import { useSubmissions } from "../context/SubmissionContext";

const ReaderHome = () => {
  const { submissions } = useSubmissions();
  console.log("ReaderHome received submissions:", submissions); // Add logging

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [notePadContents, setNotePadContents] = useState<
    Record<string, string>
  >({});
  const [isSubmissionListOpen, setIsSubmissionListOpen] = useState(true);

  const handleSubmissionClick = (submissionId: string) => {
    console.log("Submission clicked:", submissionId); // Debugging
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

  const selectedSubmissionData = submissions.find(
    (submission) => submission.id === selectedSubmissionId
  );

  if (selectedSubmissionData) {
    console.log("Selected submission data:", selectedSubmissionData); // Debugging
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar onIconClick={handleIconClick} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        {isSubmissionListOpen && (
          <div style={{ maxHeight: "calc(100vh - 70px)", flexShrink: 0 }}>
            <SubmissionsList
              submissions={submissions}
              onSubmissionClick={handleSubmissionClick}
            />
          </div>
        )}
        <div style={{ flexGrow: 1, height: "calc(100vh - 70px)" }}>
          {selectedSubmissionData ? (
            <SubmissionViewer
              submission={selectedSubmissionData}
              notePadContent={
                notePadContents[
                  `${selectedSubmissionData.student.first_name} ${selectedSubmissionData.student.last_name}`
                ] || ""
              }
              onNotePadChange={handleNotePadChange}
              isSubmissionListOpen={isSubmissionListOpen}
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
