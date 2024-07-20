
import React, { useRef, useEffect, useState } from 'react';
import { Header, PrimaryButton } from '../../Components/';
import { reactInterviewQuestions } from '../../Utils/commonJSON';
import Webcam from 'react-webcam';
import Colors from '../../Utils/Colors';
import axios from 'axios';
import { uploadWorkerUrl } from '../../Utils/Services';
import { useLocation } from 'react-router-dom';

// Define the shape of the question object
interface Question {
  id: number;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface LocationState {
  state: {
    questions: Question[];
  };
}

const Screening: React.FC = () => {
  const location = useLocation() as LocationState;
  const { questions } = location.state;

  const timeForEachQueston = 120; // 120s
  const [timeLeft, setTimeLeft] = useState(timeForEachQueston);
  const [interviewQn, setInterviewQn] = useState<Question[]>(questions.length ? questions : []);
  const [qnIndex, setQnIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [duration, setDuration] = useState(0);

  const audioRecorder = useRef<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setvideoStream] = useState<MediaStream | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [permission, setPermission] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }

    if (timeLeft === 0) {
      submitAndMoveToNextQn();
    }
  }, [timeLeft]);

  useEffect(() => {
    try {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      }).then((mediaStream) => {
        setPermission(true);
        setAudioStream(mediaStream);
        startAudioRecording(mediaStream);
      });

      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }).then((mediaStream) => {
        setPermission(true);
        setvideoStream(mediaStream);
        startVideoRecording(mediaStream);
      });
    } catch (err) {
      alert((err as Error).message);
    }

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current?.stop();
      }
      if(audioRecorder.current) {
        audioRecorder.current?.stop();
      }
    }
  }, []);

  useEffect(() => {
    if (!isRecording && audioChunks.length > 0) {
      handleAudioUpload();
      handleVideoUpload();
    }
  }, [audioChunks, isRecording]);

  const startVideoRecording = (stream: MediaStream) => {
    setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/mp4',
      });
      mediaRecorderRef.current.addEventListener('dataavailable', handleVideoDataAvailable);
      mediaRecorderRef.current.start();

  };

  const handleVideoDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const startAudioRecording = async (stream: MediaStream) => {
    setIsRecording(true);
    audioRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    audioRecorder.current.addEventListener('dataavailable', handleAudioDataAvailable);
    audioRecorder.current.start();
  };

  const handleAudioDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setAudioChunks((prev) => prev.concat(data));
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      mediaRecorderRef.current.onstop = function () {
      };
    }
  };

  const stopAudioRecording = () => {
    setIsRecording(false);
    if (audioRecorder.current) {
      audioRecorder.current.stop();
      audioRecorder.current.onstop = function () {
        // handleAudioUpload();
      };
    }
  };

  const handleAudioUpload = async () => {
    if (audioChunks.length) {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      setAudioChunks([]);
      startAudioRecording(audioStream!);
      try {
        const formData = new FormData();
        formData.append('audio', blob, 'recorded_audio.webm');
        formData.append('fileType', 'audio');
        formData.append('duration', duration.toString());
        formData.append('questionId', currentQuestion!.id.toString());
        formData.append('question', currentQuestion!.question);

        try {
          const response = await axios.post(`${uploadWorkerUrl}/uploadAndTranscribe`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Audio uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading audio:', error);
        }
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }
  };

  const handleVideoUpload = async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      setRecordedChunks([]);
      startVideoRecording(videoStream!);
      try {
        const formData = new FormData();
        formData.append('video', blob, 'recorded_video.mp4');
        formData.append('fileType', 'video');
        formData.append('questionId', currentQuestion!.id.toString());

        try {
          const response = await axios.post(`${uploadWorkerUrl}/videoUpload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Video uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading video:', error);
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleDownload = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded-video.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} left`;
    } else {
      return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} left`;
    }
  };

  const submitAndMoveToNextQn = () => {
    if (qnIndex < interviewQn.length) {
      stopVideoRecording();
      stopAudioRecording();
      setCurrentQuestion(interviewQn[qnIndex]);
      if (qnIndex !== interviewQn.length - 1) {
        setQnIndex(qnIndex + 1);
      }
      setDuration(timeForEachQueston - timeLeft);
      setTimeLeft(timeForEachQueston);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <Header />

      {audio ? (
        <div className="audio-player">
          <audio src={audio} controls></audio>
          <>
            <a download href={audio}>
              Download Recording
            </a>
          </>
        </div>
      ) : null}

      <div className='flex flex-row h-full'>
        {/* Question Section */}
        <div className='flex flex-col items-start' style={{ padding: '20px 40px', width: '40%' }}>
          <div className='flex flex-col flex-1'>
            <div style={{ fontSize: 18, color: "#BBBBBB", width: '100%', textAlign: 'start', fontWeight: 'bold' }}>
              {`Question ${qnIndex + 1} of ${interviewQn.length}`}
            </div>
            <div style={{ backgroundColor: '#F7F7F7', padding: 16, borderRadius: 12, height: 160 }}>
              <h1 className='text-2xl font-bold text-left'>{interviewQn[qnIndex]?.question}</h1>
            </div>
            <div style={{ fontSize: 18, color: interviewQn[qnIndex]?.difficulty === "Easy" ? "#68D366" : interviewQn[qnIndex]?.difficulty === "Medium" ? Colors.primary : "red", width: '100%', textAlign: 'end', fontWeight: '500', paddingTop: 16 }}>
              {`Difficulty: ${interviewQn[qnIndex]?.difficulty}`}
            </div>
          </div>
          <div style={{ backgroundColor: '#F7F7F7', padding: 16, marginBottom: 16, borderRadius: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/timer.svg" height={20} width={20} alt='logo' />
            <div style={{ textAlign: 'left', fontSize: 18, color: "#BBBBBB", marginLeft: 8 }}>
              {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}
            </div>
          </div>
          <PrimaryButton title={"Submit Answer"} style={{ marginBottom: 50 }} handleClick={submitAndMoveToNextQn} />
        </div>

        {/* Video Recording Section */}
        <div className='flex justify-center br-16 relative' style={{ width: '60%', padding: "40px 30px" }}>
          <Webcam muted={true} mirrored={true} audio={true} ref={webcamRef} style={{ borderRadius: 16 }} />
          <div className='absolute top-16 right-16 z-1 text-white bg-primary-orange' style={{ backgroundColor: '#D9D9D9', borderRadius: 100, fontWeight: '500', padding: 8 }}>
            <span style={{ color: "#FA6464" }}>•</span> Recording
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screening;