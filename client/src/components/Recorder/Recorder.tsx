import React, { useEffect, useRef, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { Button } from '@mui/material';
import {
  NotStarted as StartIcon,
  StopCircle as StopIcon,
  HourglassFull as LoadingIcon,
} from '@mui/icons-material';
import joinStrings from 'lib/joinStrings';

interface RecorderProps {
  video?: boolean;
  recording?: boolean;

  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onRecordingEnd?: (blob: Blob, fileName: string) => void;
}

export const Recorder = ({
  video,
  recording,
  onLoadingStart,
  onLoadingEnd,
  onRecordingEnd,
}: RecorderProps) => {
  const language = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string>();
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [, setMediaStream] = useState<MediaStream>();
  const [blob, setBlob] = useState<Blob>();
  const [fileName, setFileName] = useState('');
  const [elapsed, setElapsed] = useState<number>();
  const [stop, setStop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleStartButtonClick = () => {
    if (!recorder) return;
    if (recorder.state === 'recording') {
      setStop(true);
      setElapsed(undefined);
      recorder.stop();
    } else {
      setStop(false);
      recorder.start();
      setElapsed(0);
    }
    setIsRecording(recorder.state === 'recording');
  };

  useEffect(() => {
    const id = setInterval(
      () => setElapsed((current) => (current === undefined ? 0 : current + 1)),
      1000
    );

    if (elapsed === undefined) clearInterval(id);

    return () => clearInterval(id);
  }, [elapsed]);

  useEffect(() => {
    const startStream = async () => {
      const mediaEl = video ? videoRef.current : audioRef.current;
      if (!mediaEl) return;
      if (onLoadingStart) onLoadingStart();
      setIsLoading(true);
      const fn = `Recording.${video ? 'mp4' : 'ogg'}`;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: video });
        setMediaStream(stream);
        mediaEl.srcObject = stream;
        mediaEl.onloadedmetadata = () => mediaEl.play();

        const mediaRecorder = new MediaRecorder(stream);
        let chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
          setFileName(fn);
          setBlob(new Blob(chunks, { type: video ? 'video/mp4' : 'audio/ogg' }));
          chunks = [];
        };

        setRecorder(mediaRecorder);
        setError(undefined);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setIsLoading(false);
        if (onLoadingEnd) onLoadingEnd();
      }
    };

    const stopStream = () => {
      if (videoRef.current) videoRef.current.src = '';
      if (audioRef.current) audioRef.current.src = '';
      setBlob(undefined);
      setFileName('');
      setElapsed(undefined);
      setIsRecording(false);
      setRecorder((current) => {
        if (current && current.state === 'recording') current.stop();
        return undefined;
      });
      setMediaStream((current) => {
        if (current) {
          current.getTracks().forEach((track) => track.stop());
        }
        return undefined;
      });
    };

    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Not supported');
      return;
    }
    if (recording) startStream();

    return () => stopStream();
  }, [video, recording, videoRef, audioRef, onLoadingStart, onLoadingEnd]);

  useEffect(() => {
    if (!blob || !stop || !onRecordingEnd) return;
    onRecordingEnd(blob, fileName);
  }, [blob, fileName, stop, onRecordingEnd]);

  return error ? (
    <div>{error}</div>
  ) : (
    <div style={{ display: !recording ? 'none' : undefined }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem 1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <Button
          color={isRecording ? 'warning' : 'success'}
          disabled={isLoading}
          startIcon={isLoading ? <LoadingIcon /> : isRecording ? <StopIcon /> : <StartIcon />}
          onClick={handleStartButtonClick}
        >
          {language(
            isLoading
              ? lng.recordingAccessing
              : isRecording
              ? lng.recordingStop
              : lng.recordingStart
          )}
        </Button>
        {isRecording && <span>{formatElapsedTime(elapsed)}</span>}
      </div>
      <video
        muted
        width="100%"
        ref={videoRef}
        style={{ display: !video ? 'none' : undefined, maxHeight: 'max(35vh, 200px)' }}
      />
      <audio muted style={{ width: '100%', display: video ? 'none' : undefined }} ref={audioRef} />
    </div>
  );
};

function formatElapsedTime(time?: number): string | undefined {
  if (!time) return;
  const seconds = String(time % 60).padStart(2, '0');
  const minutes = String(Math.round(time / 60) % 60).padStart(2, '0');
  const hours = String(Math.round(time / 3600) % 24).padStart(2, '0');
  return joinStrings(':', hours, minutes, seconds);
}
