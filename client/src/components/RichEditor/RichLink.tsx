import React from 'react';
import { EditorState, ContentState, ContentBlock, CompositeDecorator, Entity } from 'draft-js';
import LinkIcon from '@mui/icons-material/Link';

import styles from './RichEditor.module.scss';

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
    <a href={url} className={styles.link}>
      {children}
      <LinkIcon className={styles.icon} fontSize="small" />
    </a>
  );
};

const linkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: RichLink,
  },
]);

export interface RichLinkInfo {
  url?: string;
  entityKey?: string;
  entity?: Entity;
}

export const LinkEditorState = {
  createEmpty(): EditorState {
    return EditorState.createEmpty(linkDecorator);
  },

  create(content: ContentState): EditorState {
    return EditorState.createWithContent(content, linkDecorator);
  },

  getLinkInfo(editorState: EditorState): RichLinkInfo {
    const getLinkEntity = (content: ContentState, block: ContentBlock, offset: number) => {
      const key = block.getEntityAt(offset);
      if (key) {
        const entity = content.getEntity(key);
        if (entity && entity.getType() === 'LINK') return { entity, key };
      }
      return {};
    };
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startBlock = content.getBlockForKey(selection.getStartKey());
    const startOffset = selection.getStartOffset();
    const endBlock = content.getBlockForKey(selection.getEndKey());
    const endOffset = selection.getEndOffset();

    const linkStartEntity = getLinkEntity(content, startBlock, startOffset);
    const linkEndEntity = getLinkEntity(content, endBlock, endOffset);
    const linkEntity = linkStartEntity.entity ? linkStartEntity : linkEndEntity;

    if (linkEntity.entity) {
      const { url } = linkEntity.entity.getData();
      if (url) return { url, entity: linkEntity.entity, entityKey: linkEntity.key };
    }

    if (!selection.isCollapsed() && startBlock === endBlock) {
      return { url: startBlock.getText().slice(startOffset, endOffset) };
    }

    return {};
  },
};
