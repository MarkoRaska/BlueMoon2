import React, { useEffect, useState, useRef } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  isNotePad?: boolean;
}

const TextEditor = ({
  value,
  onChange,
  isNotePad = false,
}: TextEditorProps) => {
  const [editorState, setEditorState] = useState(() =>
    value
      ? EditorState.createWithContent(ContentState.createFromText(value))
      : EditorState.createEmpty()
  );

  const editorRef = useRef<Editor>(null);

  // Synchronize editor state with value prop
  useEffect(() => {
    const currentContent = editorState.getCurrentContent().getPlainText();
    if (currentContent !== value) {
      setEditorState(
        value
          ? EditorState.createWithContent(ContentState.createFromText(value))
          : EditorState.createEmpty()
      );
    }
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    onChange(state.getCurrentContent().getPlainText());
  };

  return (
    <div
      style={{
        border: isNotePad ? "none" : "1px solid #ccc",
        minHeight: "200px",
        padding: "10px",
        marginTop: isNotePad ? "0" : "70px",
        height: isNotePad ? "100%" : "calc(100% - 60px)",
      }}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default TextEditor;
