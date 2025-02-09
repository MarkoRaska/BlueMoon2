import React, { useState, useRef, useEffect } from "react";
import TextEditor from "../TextEditor/TextEditor";
import "./NotePad.css"; // Assuming you have a CSS file for styling

interface NotePadProps {
  student: string;
  content: string;
  onContentChange: (content: string) => void;
}

const NotePad = ({ content, onContentChange }: NotePadProps) => {
  const [height, setHeight] = useState(20); // Initial height with buffer
  const [previousHeight, setPreviousHeight] = useState(200); // Default expanded height
  const containerRef = useRef<HTMLDivElement>(null);

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
      style={{ height: `${height}px` }}
      ref={containerRef}
    >
      <div className="notepad-handle" onMouseDown={handleMouseDown}>
        <span className="notepad-icon">⇕</span>
      </div>
      <div className="notepad-content">
        <TextEditor
          feedback={content}
          onFeedbackChange={(newContent) => onContentChange(newContent)}
          isNotePad={true} // Specify that this is a NotePad text field
        />
      </div>
    </div>
  );
};

export default NotePad;
