import React from 'react';
import { Badge, IconButton, Tooltip, useTheme } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { Videocam as VideoIcon, KeyboardVoice as AudioIcon } from '@mui/icons-material';

interface RecorderButtonProps {
  recording?: boolean;
  video?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const RecorderButton = ({ recording, video, disabled, onClick }: RecorderButtonProps) => {
  const language = useLanguage();
  const theme = useTheme();

  return (
    <Tooltip title={language(video ? lng.recordingVideo : lng.recordingAudio)}>
      <span>
        <IconButton component="label" color="primary" disabled={disabled} onClick={onClick}>
          <Badge
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: recording ? theme.palette.warning.main : theme.palette.grey[400],
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {video ? <VideoIcon /> : <AudioIcon />}
          </Badge>
        </IconButton>
      </span>
    </Tooltip>
  );
};
