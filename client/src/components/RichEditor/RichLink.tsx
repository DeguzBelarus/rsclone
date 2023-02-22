import React from 'react';
import { EditorState, ContentState, ContentBlock, CompositeDecorator } from 'draft-js';
import LinkIcon from '@mui/icons-material/Link';

import styles from './RichEditor.module.scss';
import { Tooltip } from '@mui/material';

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}

interface RichLinkProps {
  contentState: ContentState;
  entityKey: string;
  children?: React.ReactNode;
}

const RichLink = ({ contentState, entityKey, children }: RichLinkProps) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <Tooltip className={styles.linkTip} title={url}>
      <a href={url} className={styles.link}>
        {children}
        <LinkIcon className={styles.icon} fontSize="small" />
      </a>
    </Tooltip>
  );
};

const linkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: RichLink,
  },
]);

export const LinkEditorState = {
  createEmpty(): EditorState {
    return EditorState.createEmpty(linkDecorator);
  },

  create(content: ContentState): EditorState {
    return EditorState.createWithContent(content, linkDecorator);
  },

  getCurrentLinkAddress(editorState: EditorState): string {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = content.getBlockForKey(selection.getStartKey());
    let selectedEntityURL: string | null = null;
    const entityURLs: Array<string | null> = [];
    block.findEntityRanges(
      (character) => {
        try {
          const entityKey = character.getEntity();
          const entity = content.getEntity(entityKey);
          const entityData = entity.getData();
          const entityType = entity.getType();
          if (entityType === 'LINK') {
            selectedEntityURL = entityData?.url || null;
            return true;
          }
        } catch {
          return false;
        }
        return false;
      },
      (start: number, end: number) => {
        if (selectedEntityURL) entityURLs.push(selectedEntityURL);
      }
    );
    if (entityURLs[0]) return entityURLs[0];
    const windowSelection = window.getSelection();
    if (!selection.isCollapsed() && windowSelection) {
      return windowSelection.toString();
    }
    return '';
  },
};
