import React, { useState, useRef, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { debounce } from "../../utils/debounce";
import { useSubmissions } from "../../context/SubmissionContext";
import { Input } from "antd"; // Import Input component from antd
import History from "../History"; // Import History component

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
        zIndex: 1001,
        overflow: "hidden",
      }}
      ref={containerRef}
    >
      <div
        className="notepad-handle"
        onMouseDown={handleMouseDown}
        style={{
          height: "20px", // Slightly larger handle
          backgroundColor: "#000000",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          width: "100%",
          zIndex: 1002, // Ensure handle has a higher z-index
        }}
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
        style={{
          height: "calc(100% - 20px)", // Adjusted for larger handle
          paddingTop: "20px", // Ensure content does not overlap with handle
          flex: "0 0 50%", // Ensure it spans half the width
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Input.TextArea
          value={notesState}
          onChange={(e) => handleNotesChange(e.target.value)}
          style={{
            height: "calc(100% + 15px)", // Adjust height to fit within container
            width: "calc(100% - 6px)", // Adjust width to fit within container
            backgroundColor: "#3d3d3d",
            color: "white",
            border: "none",
            resize: "none",
            outline: "3px solid #242424",
            boxShadow: "none", // Remove box shadow
            borderRadius: "0px", // Ensure 90-degree corners
            marginBottom: "-20px",
            overflow: "hidden", // Hide scrollbar
            whiteSpace: "pre-wrap", // Allow text to wrap
            overflowY: "scroll", // Enable scrolling
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
        style={{
          flex: "0 0 50%",
          height: "calc(100% - 30px)",
          marginTop: "30px",
        }} // Adjust flex, height, and margin properties
      />
    </div>
  );
};

export default NotePad;
