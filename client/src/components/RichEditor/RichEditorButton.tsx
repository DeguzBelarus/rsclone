import React, { useEffect, useState } from 'react';
import { EditorState } from 'draft-js';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface RichEditorButtonProps {
  style: string;
  block?: boolean;
  icon?: React.ComponentType;
  title: string;
  editorState: EditorState;
  toggleStyle: (style: string, block?: boolean) => void;
  isDisabled?: () => boolean;
  onClick?: () => void;
}

export const RichEditorButton = ({
  style,
  block,
  icon: Icon,
  title,
  editorState,
  toggleStyle,
  isDisabled,
  onClick,
}: RichEditorButtonProps) => {
  const [isStyle, setIsStyle] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const selection = editorState.getSelection();
    if (block) {
      const currentKey = selection.getStartKey();
      const currentBlock = editorState.getCurrentContent().getBlockForKey(currentKey);
      setIsStyle(currentBlock.getType() === style);
    } else {
      const inlineStyle = editorState.getCurrentInlineStyle();
      setIsStyle(inlineStyle.has(style));
    }
    setDisabled(isDisabled ? isDisabled() : false);
  }, [editorState, style, block, isDisabled]);

  return (
    <Tooltip title={title} placement="top">
      <span>
        <IconButton
          size="small"
          color={isStyle ? 'primary' : 'default'}
          disabled={disabled}
          onClick={() => (onClick ? onClick() : toggleStyle(style, block))}
        >
          {Icon && <Icon />}
        </IconButton>
      </span>
    </Tooltip>
  );
};
