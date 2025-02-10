import React, { useState, useRef, useEffect, useCallback } from "react";
import TextEditor from "../TextEditor";
import axiosInstance from "../../utils/axiosInstance"; // Import axiosInstance for API calls
import { debounce } from "../../utils/debounce"; // Import debounce function
import { useSubmissions } from "../../context/SubmissionContext"; // Import useSubmissions hook
import "./NotePad.css"; // Assuming you have a CSS file for styling

interface NotePadProps {
  student: string;
  content: string;
  onContentChange: (content: string) => void;
  submissionId: string;
}

const NotePad = ({
  content,
  onContentChange,
  student,
  submissionId,
}: NotePadProps) => {
  const [height, setHeight] = useState(20); // Start fully closed
  const [previousHeight, setPreviousHeight] = useState(200); // Default expanded height
  const containerRef = useRef<HTMLDivElement>(null);
  const [notesState, setNotesState] = useState(content);
  const { updateSubmission } = useSubmissions(); // Get updateSubmission method from context

  useEffect(() => {
    setNotesState(content); // Update notes state when receiving new content
  }, [content]);

  useEffect(() => {
    setNotesState(content); // Ensure notes state is updated when submissionId changes
  }, [submissionId, content]);

  const saveNotes = async (newNotes: string) => {
    console.log("Saving notes for submission ID:", submissionId); // Debugging log
    console.log("Notes content:", newNotes); // Debugging log
    try {
      const response = await axiosInstance.post("/api/save_notes/", {
        submissionId, // Ensure submissionId is used correctly
        notes: newNotes,
      });
      console.log("Notes saved response:", response.data); // Debugging log
      updateSubmission({
        ...response.data,
        id: submissionId,
        notes: newNotes,
      }); // Update context with new notes
      console.log("Context updated with new notes:", newNotes); // Debugging log
    } catch (error) {
      console.error("Failed to save notes", error);
    }
  };

  const debouncedSaveNotes = useCallback(debounce(saveNotes, 500), [
    submissionId,
  ]);

  const handleNotesChange = (newNotes: string) => {
    setNotesState(newNotes);
    onContentChange(newNotes);
    debouncedSaveNotes(newNotes);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    const startY = e.clientY;
    const startHeight = containerRef.current?.offsetHeight || 20;

    const onMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight - (e.clientY - startY);
      const maxHeight = window.innerHeight - 125;
      const minHeight = 20;
      const finalHeight = Math.max(Math.min(newHeight, maxHeight), minHeight);
      setHeight(finalHeight);
      window.dispatchEvent(
        new CustomEvent("notepadHeightChange", { detail: finalHeight })
      ); // Emit custom event
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key === "n") {
      if (height > 20) {
        setPreviousHeight(height);
        setHeight(20); // Collapse to minimum height with buffer
        window.dispatchEvent(
          new CustomEvent("notepadHeightChange", { detail: 20 })
        ); // Emit custom event
      } else {
        setHeight(previousHeight); // Expand to previous height
        window.dispatchEvent(
          new CustomEvent("notepadHeightChange", { detail: previousHeight })
        ); // Emit custom event
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [height, previousHeight]);

  return (
    <div
      className="notepad-container"
      style={{ height: `${height}px`, position: "absolute", bottom: 0 }}
      ref={containerRef}
    >
      <div className="notepad-handle" onMouseDown={handleMouseDown}>
        <span className="notepad-icon">⇕</span>
      </div>
      <div className="notepad-content">
        <TextEditor
          value={notesState}
          onChange={handleNotesChange}
          isNotePad={true} // Specify that this is a NotePad text field
        />
      </div>
    </div>
  );
};

export default NotePad;
