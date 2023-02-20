import React, { useEffect, useRef, useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftStyleMap,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js';

import styles from './RichEditor.module.scss';
import './RichEditor.scss';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import combineClasses from 'lib/combineClasses';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import TitleIcon from '@mui/icons-material/Title';
import BrushIcon from '@mui/icons-material/Brush';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { lng } from 'hooks/useLanguage/types';
import useLanguage from 'hooks/useLanguage';

import { decompressFromUTF16 } from 'async-lz-string';

interface EditorButtonProps {
  style: string;
  icon: React.ReactNode;
  title: string;
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const EditorButton = ({ style, icon, title, editorState, onStateChange }: EditorButtonProps) => {
  const [isStyle, setIsStyle] = useState(false);

  const toggleStyle = () => {
    const state = EditorState.forceSelection(editorState, editorState.getSelection());
    onStateChange(RichUtils.toggleInlineStyle(state, style));
  };

  useEffect(() => {
    const inlineStyle = editorState.getCurrentInlineStyle();
    setIsStyle(inlineStyle.has(style));
  }, [editorState]);

  return (
    <Tooltip title={title}>
      <IconButton size="small" color={isStyle ? 'primary' : 'default'} onClick={toggleStyle}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

const editorButtons = [
  { style: 'BOLD', icon: <FormatBoldIcon />, title: lng.formatBold },
  { style: 'ITALIC', icon: <FormatItalicIcon />, title: lng.formatItalic },
  { style: 'UNDERLINE', icon: <FormatUnderlinedIcon />, title: lng.formatUnderline },
  { style: 'DIVIDER' },
  { style: 'HEADING', icon: <TitleIcon />, title: lng.formatTitle },
  { style: 'HIGHLIGHT', icon: <BrushIcon />, title: lng.formatHighlight },
  { style: 'DIVIDER' },
  { style: 'LINK', icon: <AddLinkIcon />, title: lng.formatAddLink },
];

interface RichEditorProps {
  label?: string;
  initialValue?: string;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  onChange?: (value: string, raw: string) => void;
}

export const RichEditor = ({
  label,
  initialValue,
  error,
  helperText,
  readOnly,
  onChange,
}: RichEditorProps) => {
  const { palette } = useTheme();
  const language = useLanguage();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorFocused, setEditorFocused] = useState(false);
  const editorRef: React.LegacyRef<Editor> = useRef(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isEmpty = editorState.getCurrentContent().hasText();

  const styleMap: DraftStyleMap = {
    HEADING: {
      fontWeight: 'bold',
      fontSize: '1.5em',
    },
    HIGHLIGHT: {
      color: 'black',
      backgroundColor: 'yellow',
    },
    UNDERLINE: {
      borderBottom: `3px solid ${palette.success.light}`,
    },
  };

  const handleChange = async (state: EditorState) => {
    setEditorState(state);
    if (onChange) {
      const raw = convertToRaw(editorState.getCurrentContent());
      const value = raw.blocks
        .map((block) => (!block.text.trim() && '\n') || block.text)
        .join('\n');
      onChange(value, JSON.stringify(raw));
    }
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.setProperty('--color', palette.text.disabled);
      wrapper.style.setProperty('--hover-color', palette.text.primary);
      wrapper.style.setProperty('--focused-color', palette.primary.main);
      wrapper.style.setProperty('--error-color', palette.error.main);
    }
  }, [palette, wrapperRef]);

  useEffect(() => {
    const changeValue = async () => {
      if (!initialValue) return;
      try {
        const state = JSON.parse(await decompressFromUTF16(initialValue));
        setEditorState(EditorState.createWithContent(convertFromRaw(state)));
      } catch (error) {
        const contentState = ContentState.createFromText(initialValue);
        setEditorState(EditorState.createWithContent(contentState));
      }
    };
    changeValue();
  }, [initialValue]);

  return (
    <div
      ref={wrapperRef}
      className={combineClasses(
        styles.wrapper,
        [styles.focused, editorFocused],
        [styles.error, error],
        [styles.empty, isEmpty],
        [styles.readonly, readOnly],
        ['readonly-wrapper', readOnly]
      )}
    >
      {!readOnly && (
        <div className={styles.controls}>
          {editorButtons.map(({ style, icon, title }, index) =>
            style === 'DIVIDER' ? (
              <span
                key={index}
                className={styles.divider}
                style={{ backgroundColor: palette.divider }}
              ></span>
            ) : (
              <EditorButton
                key={style}
                style={style}
                icon={icon}
                title={language(title || lng.formatBold)}
                editorState={editorState}
                onStateChange={setEditorState}
              />
            )
          )}
        </div>
      )}
      <Editor
        ref={editorRef}
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        readOnly={readOnly}
        onFocus={() => setEditorFocused(true)}
        onBlur={() => setEditorFocused(false)}
      />
      {!readOnly && (
        <>
          <div className={styles.label} onClick={() => editorRef.current?.focus()}>
            {label}
          </div>
          <div className={styles.bottomLine}></div>
          <div className={styles.helperText}>
            <pre>{helperText}</pre>
          </div>
        </>
      )}
    </div>
  );
};
