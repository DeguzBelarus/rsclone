import React, { useEffect, useRef, useState } from 'react';
import { Editor, EditorState } from 'draft-js';

import styles from './RichEditor.module.scss';
import './RichEditor.scss';
import { useTheme } from '@mui/material';
import combineClasses from 'lib/combineClasses';

interface RichEditorProps {
  label?: string;
  onChange?: (value: string) => void;
}

export const RichEditor = ({ label }: RichEditorProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef: React.LegacyRef<Editor> = useRef(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { palette } = useTheme();
  const [editorFocused, setEditorFocused] = useState(false);

  const handleChange = (state: EditorState) => {
    setEditorState(state);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.setProperty('--color', palette.text.disabled);
      wrapper.style.setProperty('--hover-color', palette.text.primary);
      wrapper.style.setProperty('--focused-color', palette.primary.main);
    }
  }, [palette, wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      className={combineClasses(styles.wrapper, [styles.focused, editorFocused])}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={handleChange}
        onFocus={() => setEditorFocused(true)}
        onBlur={() => setEditorFocused(false)}
      />
      <div className={styles.label} onClick={() => editorRef.current?.focus()}>
        {label}
      </div>
      <div className={styles.bottomLine}></div>
    </div>
  );
};
