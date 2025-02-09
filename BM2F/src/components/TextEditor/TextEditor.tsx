import React, { useState, useEffect, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

const { hasCommandModifier } = KeyBindingUtil;

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  isNotePad?: boolean; // Optional prop to specify if it is a NotePad text field
}

const TextEditor = ({
  value,
  onChange,
  isNotePad = false,
}: TextEditorProps) => {
  const editorRef = useRef<Editor>(null); // Add a ref for the editor
  const [editorState, setEditorState] = useState(
    value
      ? EditorState.createWithContent(ContentState.createFromText(value))
      : EditorState.createEmpty()
  );

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

  const handleKeyCommand = (command: string, state: EditorState) => {
    if (command === "tab") {
      const newState = RichUtils.onTab(new KeyboardEvent("keydown"), state, 4);
      if (newState !== state) {
        handleEditorChange(newState);
        return "handled";
      }
    }
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (e.key === "b" && hasCommandModifier(e)) {
      return "bold";
    }
    if (e.key === "i" && hasCommandModifier(e)) {
      return "italic";
    }
    if (e.key === "Tab" && e.shiftKey) {
      return "outdent";
    }
    if (e.key === "Tab") {
      return "tab";
    }
    return getDefaultKeyBinding(e);
  };

  const handleBeforeInput = (chars: string, state: EditorState) => {
    const currentContent = state.getCurrentContent();
    const selection = state.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = block.getText();

    if (chars === " " && blockText.endsWith("-")) {
      const newContent = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: blockText.length - 1,
          focusOffset: blockText.length,
        }),
        "",
        state.getCurrentInlineStyle()
      );
      const newState = EditorState.push(state, newContent, "insert-characters");
      handleEditorChange(
        RichUtils.toggleBlockType(newState, "unordered-list-item")
      );
      return "handled";
    }

    return "not-handled";
  };

  return (
    <div
      style={{
        border: isNotePad ? "none" : "1px solid #ccc", // Remove border if it is a NotePad
        minHeight: "200px",
        padding: "10px",
        marginTop: isNotePad ? "0" : "70px", // Remove margin if it is a NotePad
        height: isNotePad ? "100%" : "calc(100% - 60px)", // Adjust height based on isNotePad prop
      }}
    >
      <Editor
        ref={editorRef} // Attach the ref to the Editor component
        editorState={editorState}
        onChange={handleEditorChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
};

export default TextEditor;
