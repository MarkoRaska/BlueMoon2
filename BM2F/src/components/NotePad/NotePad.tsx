import React, { useState, useRef, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { debounce } from "../../utils/debounce";
import { useSubmissions } from "../../context/SubmissionContext";
import { Input } from "antd";
import History from "../History"; // Import History component
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
  const [height, setHeight] = useState(200);
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
    const startHeight = containerRef.current?.offsetHeight || 200;

    const onMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight + (startY - e.clientY);
      const maxHeight = window.innerHeight - 135;
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
        outline: "none", // Remove outline
        width: "100%", // Ensure it spans the full width
        margin: 0, // Remove margin
        padding: 0, // Remove padding
        display: "flex", // Ensure flex display
        flexDirection: "row", // Set flex direction to row
      }}
      ref={containerRef}
    >
      <div
        className="notepad-handle"
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: "black", outline: "none", borderTop: "none" }}
      >
        <span
          className="notepad-icon"
          style={{
            color: "white",
            fontSize: "1.5em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "2px",
              backgroundColor: "white",
              margin: "1px 0",
            }}
          ></div>
          <div
            style={{
              width: "30px",
              height: "2px",
              backgroundColor: "white",
              margin: "1px 0",
            }}
          ></div>
          <div
            style={{
              width: "30px",
              height: "2px",
              backgroundColor: "white",
              margin: "1px 0",
            }}
          ></div>
        </span>
      </div>
      <div
        className="notepad-content"
        style={{ height: "calc(100% - 30px)", flex: 1 }} // Adjust flex property
      >
        <Input.TextArea
          value={notesState}
          onChange={(e) => handleNotesChange(e.target.value)}
          style={{
            backgroundColor: "#3d3d3d",
            color: "white",
            marginTop: "2px",
            border: "4px",
            boxShadow: "none",
            resize: "none",
            textAlign: "left",
            padding: "7px",
            fontSize: "15px",
            outline: "3px solid #242424",
            borderRadius: "0",
            marginLeft: "3px",
            height: "calc(100% + 30px)",
            overflow: "auto", // Allow scrolling
            scrollbarWidth: "none", // Hide scrollbar in Firefox
            msOverflowStyle: "none", // Hide scrollbar in IE and Edge
          }}
        />
        <style>
          {`
            .ant-input-textarea::-webkit-scrollbar {
              display: none; // Hide scrollbar in WebKit browsers
            }
          `}
        </style>
      </div>
      <div style={{ width: "2px", backgroundColor: "#3d3d3d" }} />{" "}
      {/* Divider */}
      <History
        history={notesState}
        onHistoryChange={handleNotesChange}
        student={student}
        submissionId={submissionId}
        style={{ flex: 1, height: "calc(100% - 30px)", marginTop: "30px" }} // Adjust flex, height, and margin properties
      />
    </div>
  );
};

export default NotePad;
