import React, { useEffect, useRef, useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentState,
  getDefaultKeyBinding,
  Modifier,
  SelectionState,
  ContentBlock,
} from 'draft-js';
import { decompressFromUTF16 } from 'async-lz-string';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { EmojiButton } from 'components/EmojiButton/EmojiButton';
import combineClasses from 'lib/combineClasses';
import { lng } from 'hooks/useLanguage/types';
import useLanguage from 'hooks/useLanguage';

import { editorActions } from './RichEditor.consts';
import styles from './RichEditor.module.scss';
import './RichEditor.scss';

interface EditorButtonProps {
  style: string;
  block?: boolean;
  icon?: React.ComponentType;
  title: string;
  editorState: EditorState;
  toggleStyle: (style: string, block?: boolean) => void;
}

const EditorButton = ({
  style,
  block,
  icon: Icon,
  title,
  editorState,
  toggleStyle,
}: EditorButtonProps) => {
  const [isStyle, setIsStyle] = useState(false);

  useEffect(() => {
    if (block) {
      const currentSelection = editorState.getSelection();
      const currentKey = currentSelection.getStartKey();
      const currentBlock = editorState.getCurrentContent().getBlockForKey(currentKey);
      setIsStyle(currentBlock.getType() === style);
    } else {
      const inlineStyle = editorState.getCurrentInlineStyle();
      setIsStyle(inlineStyle.has(style));
    }
  }, [editorState, style, block]);

  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        color={isStyle ? 'primary' : 'default'}
        onClick={() => toggleStyle(style, block)}
      >
        {Icon && <Icon />}
      </IconButton>
    </Tooltip>
  );
};

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

  const customStyleMap = {
    HIGHLIGHT: {
      color: 'black',
      backgroundColor: 'yellow',
    },
    UNDERLINE: {
      boxShadow: `inset 0 -0.15em ${palette.success.light}`,
    },
  };

  const toggleStyle = (style: string, block = false) => {
    const state = EditorState.forceSelection(editorState, editorState.getSelection());
    setEditorState(
      block ? RichUtils.toggleBlockType(state, style) : RichUtils.toggleInlineStyle(state, style)
    );
  };

  const handleChange = async (state: EditorState) => {
    setEditorState(state);
    if (onChange) {
      const raw = convertToRaw(state.getCurrentContent());
      const value = raw.blocks
        .map((block) => (!block.text.trim() && '\n') || block.text)
        .join('\n');
      onChange(value, JSON.stringify(raw));
    }
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const currentStyle = editorActions.find(({ style }) => style === command);
    if (currentStyle) {
      toggleStyle(command, currentStyle.block);
      return 'handled';
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleKeyBindings = (event: React.KeyboardEvent<object>): string | null => {
    if (event.ctrlKey) {
      const currentShortcut = `Ctrl+${event.key.toUpperCase()}`;
      const currentStyle = editorActions.find(({ shortcut }) => shortcut === currentShortcut);
      if (currentStyle) return currentStyle.style;
    }
    return getDefaultKeyBinding(event);
  };

  const handleBlockStyle = (block: ContentBlock): string => {
    const type = block.getType();
    const blockStyles: { [key: string]: string } = {
      'code-block': styles.code,
      unstyled: styles.paragraph,
    };
    return blockStyles[type] || '';
  };

  const handleEmojiAdded = (emoji: string) => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const anchorKey = selection.getAnchorKey();
    const currentBlockKey = content.getBlockForKey(anchorKey).getKey();
    const anchorOffset = selection.getAnchorOffset();
    const state = EditorState.createWithContent(Modifier.replaceText(content, selection, emoji));
    const updatedSelection = SelectionState.createEmpty(currentBlockKey).merge({
      anchorOffset,
      focusOffset: anchorOffset + emoji.length,
    });
    setEditorState(EditorState.forceSelection(state, updatedSelection));
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.setProperty('--color', palette.text.secondary);
      wrapper.style.setProperty('--hover-color', palette.text.primary);
      wrapper.style.setProperty('--focused-color', palette.primary.main);
      wrapper.style.setProperty('--error-color', palette.error.main);
      wrapper.style.setProperty('--code-color', palette.action.hover);
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
          {editorActions.map(({ style, block, icon, title, shortcut }, index) =>
            style === 'EMOJI' ? (
              <EmojiButton key={style} small onEmojiAdded={handleEmojiAdded} />
            ) : style === 'DIVIDER' ? (
              <span
                key={index}
                className={styles.divider}
                style={{ backgroundColor: palette.divider }}
              ></span>
            ) : (
              <EditorButton
                key={style}
                style={style}
                block={block}
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
        editorState={editorState}
        customStyleMap={customStyleMap}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={handleKeyBindings}
        blockStyleFn={handleBlockStyle}
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
