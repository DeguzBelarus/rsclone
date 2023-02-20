import React, { useEffect, useRef, useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftStyleMap,
  convertToRaw,
  convertFromRaw,
  ContentState,
  getDefaultKeyBinding,
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
  toggleStyle: (style: string) => void;
}

const EditorButton = ({ style, icon, title, editorState, toggleStyle }: EditorButtonProps) => {
  const [isStyle, setIsStyle] = useState(false);

  useEffect(() => {
    const inlineStyle = editorState.getCurrentInlineStyle();
    setIsStyle(inlineStyle.has(style));
  }, [editorState]);

  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        color={isStyle ? 'primary' : 'default'}
        onClick={() => toggleStyle(style)}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

const editorButtons = [
  { style: 'BOLD', icon: <FormatBoldIcon />, title: lng.formatBold, shortcut: 'Ctrl+B' },
  { style: 'ITALIC', icon: <FormatItalicIcon />, title: lng.formatItalic, shortcut: 'Ctrl+I' },
  {
    style: 'UNDERLINE',
    icon: <FormatUnderlinedIcon />,
    title: lng.formatUnderline,
    shortcut: 'Ctrl+U',
  },
  { style: 'DIVIDER' },
  { style: 'HEADING', icon: <TitleIcon />, title: lng.formatTitle, shortcut: 'Ctrl+H' },
  { style: 'HIGHLIGHT', icon: <BrushIcon />, title: lng.formatHighlight, shortcut: 'Ctrl+M' },
  { style: 'DIVIDER' },
  { style: 'LINK', icon: <AddLinkIcon />, title: lng.formatAddLink, shortcut: 'Ctrl+K' },
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

  const toggleStyle = (style: string) => {
    const state = EditorState.forceSelection(editorState, editorState.getSelection());
    setEditorState(RichUtils.toggleInlineStyle(state, style));
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
    if (['HEADING', 'HIGHLIGHT'].includes(command)) {
      toggleStyle(command);
      return 'handled';
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  function handleKeyBindings(event: React.KeyboardEvent<object>): string | null {
    if (event.ctrlKey) {
      if (event.key === 'h') return 'HEADING';
      if (event.key === 'm') return 'HIGHLIGHT';
      if (event.key === 'k') return 'LINK';
    }
    return getDefaultKeyBinding(event);
  }

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
          {editorButtons.map(({ style, icon, title, shortcut }, index) =>
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
                title={`${language(title || lng.formatBold)} (${shortcut})`}
                editorState={editorState}
                toggleStyle={toggleStyle}
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
        keyBindingFn={handleKeyBindings}
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
