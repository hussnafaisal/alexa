import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import commands from './utils/commands';
import styles from './Assistant.module.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Assistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const isRecognizing = useRef(false);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecognizing.current = true;
      setListening(true);
    };
    recognition.onend = () => {
      isRecognizing.current = false;
      setListening(false);
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log('Heard:', text);
      setTranscript(text);
      handleCommand(text);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognitionRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    synthRef.current.speak(utter);
  };

  const handleCommand = (text) => {
    const { reply, action } = commands(text);
    setResponse(reply);
    if (action) action();
    if (reply) speak(reply);
  };

  const startListening = () => {
    if (!recognitionRef.current) return alert('Speech Recognition not supported');
    if (isRecognizing.current) return; // Prevent double start
    setTranscript('');
    setResponse('');
    try {
      recognitionRef.current.start();
    } catch (e) {
      // If already started, just ignore
      console.warn('Recognition already started');
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mini Voice Assistant</h1>
      <div className={styles.section}>
        <div className={styles.label}>You said:</div>
        <div className={`${styles.text} ${styles.user}`}>{transcript}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Assistant:</div>
        <div className={`${styles.text} ${styles.response}`}>{response}</div>
      </div>
      <button
        className={
          listening
            ? `${styles.micBtn} ${styles.micBtnListening}`
            : styles.micBtn
        }
        onClick={listening ? stopListening : startListening}
        aria-label={listening ? 'Stop listening' : 'Start listening'}
      >
        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <div className={styles.status}>{listening ? 'Listening...' : 'Click the mic to speak'}</div>
    </div>
  );
};

export default Assistant; 