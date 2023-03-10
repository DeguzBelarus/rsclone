import React, { useEffect, useMemo, useRef, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { Button } from '@mui/material';
import {
  NotStarted as StartIcon,
  StopCircle as StopIcon,
  HourglassFull as LoadingIcon,
} from '@mui/icons-material';
import joinStrings from 'lib/joinStrings';
import { Spinner } from 'components/Spinner/Spinner';

interface RecorderProps {
  video?: boolean;
  active?: boolean;

  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onRecordingEnd?: (blob: Blob, fileName: string) => void;
}

export const Recorder = ({
  video,
  active,
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

  const defaultFileName = useMemo(() => language(lng.recording), [language]);

  const handleStartButtonClick = () => {
    if (!recorder) return;
    if (recorder.state === 'recording') {
      setStop(true);
      setElapsed(undefined);
      recorder.stop();
    } else {
      setElapsed(0);
      setStop(false);
      recorder.start();
    }
    setIsRecording(recorder.state === 'recording');
  };

  useEffect(() => {
    const id = setTimeout(
      () => setElapsed((current) => (current === undefined ? 0 : current + 1)),
      1000
    );

    if (elapsed === undefined) clearTimeout(id);

    return () => clearTimeout(id);
  }, [elapsed]);

  useEffect(() => {
    const startStream = async () => {
      const mediaEl = video ? videoRef.current : audioRef.current;
      if (!mediaEl) return;
      if (onLoadingStart) onLoadingStart();
      setIsLoading(true);
      const fn = `${defaultFileName}.${video ? 'mp4' : 'ogg'}`;
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
      setError(undefined);
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
    if (active) startStream();

    return () => stopStream();
  }, [video, active, videoRef, audioRef, onLoadingStart, onLoadingEnd, defaultFileName]);

  useEffect(() => {
    if (!blob || !stop || !onRecordingEnd) return;
    onRecordingEnd(blob, fileName);
  }, [blob, fileName, stop, onRecordingEnd]);

  return (
    <>
      <div style={{ display: error ? undefined : 'none' }}>{error}</div>
      <div style={{ display: active && !error ? undefined : 'none', position: 'relative' }}>
        {isLoading && (
          <div style={{ position: 'absolute', right: 0 }}>
            <Spinner size={32} />
          </div>
        )}
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
          <span>{formatElapsedTime(elapsed)}</span>
        </div>
        <video
          muted
          width="100%"
          ref={videoRef}
          style={{ display: !video ? 'none' : undefined, maxHeight: 'max(35vh, 200px)' }}
        />
        <audio
          muted
          style={{ width: '100%', display: video ? 'none' : undefined }}
          ref={audioRef}
        />
      </div>
    </>
  );
};

function formatElapsedTime(time?: number): string | undefined {
  if (!time) return;
  const seconds = String(time % 60).padStart(2, '0');
  const minutes = String(Math.floor(time / 60) % 60).padStart(2, '0');
  const hours = String(Math.floor(time / 3600) % 24).padStart(2, '0');
  return joinStrings(':', hours, minutes, seconds);
}
