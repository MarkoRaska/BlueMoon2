import React, { useState, useRef, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { debounce } from "../../utils/debounce";
import { useSubmissions } from "../../context/SubmissionContext";
import { Input } from "antd";
import "./NotePad.css";

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
  const [height, setHeight] = useState(20);
  const [previousHeight, setPreviousHeight] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const [notesState, setNotesState] = useState(content);
  const { updateSubmission } = useSubmissions();

  useEffect(() => {
    setNotesState(content);
  }, [content]);

  useEffect(() => {
    setNotesState(content);
  }, [submissionId, content]);

  const saveNotes = async (newNotes: string) => {
    try {
      const response = await axiosInstance.post("/api/save_notes/", {
        submissionId,
        notes: newNotes,
      });
      updateSubmission({
        ...response.data,
        id: submissionId,
        notes: newNotes,
      });
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
    e.preventDefault();
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
      );
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
        setHeight(20);
        window.dispatchEvent(
          new CustomEvent("notepadHeightChange", { detail: 20 })
        );
      } else {
        setHeight(previousHeight);
        window.dispatchEvent(
          new CustomEvent("notepadHeightChange", { detail: previousHeight })
        );
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
      style={{
        height: `${height}px`,
        position: "absolute",
        bottom: 0,
        backgroundColor: "#3d3d3d",
        color: "white",
      }}
      ref={containerRef}
    >
      <div className="notepad-handle" onMouseDown={handleMouseDown}>
        <span className="notepad-icon" style={{ color: "white" }}>
          ⇕
        </span>
      </div>
      <div className="notepad-content">
        <Input.TextArea
          value={notesState}
          onChange={(e) => handleNotesChange(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 10 }}
          style={{ backgroundColor: "#3d3d3d", color: "white" }}
        />
      </div>
    </div>
  );
};

export default NotePad;
