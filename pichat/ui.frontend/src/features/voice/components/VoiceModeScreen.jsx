import { useState, useEffect, useRef } from 'preact/hooks';
import '../styles/voice-mode.css';

/**
 * Voice Mode Screen Component - Continuous Listening Mode
 * Continuously streams audio to server which performs VAD and responds
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close the screen
 * @param {Function} props.onClosePopup - Callback to close the entire popup
 * @param {Array} props.messages - Messages array from ChatProvider
 * @param {Function} props.setMessages - Function to update messages
 */
export function VoiceModeScreen({ onClose, onClosePopup, messages, setMessages }) {
  const [status, setStatus] = useState('connecting'); // connecting, ready, user_speaking, user_paused, llm_speaking
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0); // 0-1 range (client-side)

  // Debug mode - enable with VITE_VOICE_DEBUG=true
  const debugMode = import.meta.env.VITE_VOICE_DEBUG === 'true';

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const volumeIntervalRef = useRef(null);
  const volumeRef = useRef(0); // Store current volume for use in closures
  const audioQueueRef = useRef([]);
  const audioChunksRef = useRef([]);
  const isPlayingRef = useRef(false);
  const isCollectingRef = useRef(false);
  const currentAudioRef = useRef(null); // Store current Audio element for stopping

  // Play complete audio when ready
  const playAudio = async () => {
    if (audioChunksRef.current.length === 0 || isPlayingRef.current) {
      return;
    }

    isPlayingRef.current = true;

    try {
      // Combine all chunks into a single array
      const allChunks = [];
      for (const base64Chunk of audioChunksRef.current) {
        const binaryString = atob(base64Chunk);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        allChunks.push(bytes);
      }

      // Combine all chunks into a single blob
      const audioBlob = new Blob(allChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        isPlayingRef.current = false;
        audioChunksRef.current = [];
        currentAudioRef.current = null;
        // Return to ready when audio is done
        setStatus('ready');
      };

      audio.onerror = (err) => {
        console.error('[VoiceMode] Audio playback error:', err);
        isPlayingRef.current = false;
        audioChunksRef.current = [];
        currentAudioRef.current = null;
        setStatus('ready');
      };

      await audio.play();
    } catch (err) {
      console.error('[VoiceMode] Failed to play audio:', err);
      isPlayingRef.current = false;
      audioChunksRef.current = [];
      setStatus('ready');
    }
  };

  // Initialize WebSocket connection and audio streaming
  useEffect(() => {
    let ws = null;
    let mediaRecorder = null;
    let audioStream = null;

    const initializeVoiceMode = async () => {
      try {
        // Get microphone access
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = audioStream;

        // Set up Web Audio API for volume monitoring
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);

        // Start volume monitoring
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        volumeIntervalRef.current = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);

          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          const normalizedVolume = average / 255; // 0-1 range

          volumeRef.current = normalizedVolume; // Store in ref for closures
          setVolume(normalizedVolume);

          // Debug: Log volume to console
          if (debugMode) {
            console.log(`[VoiceMode] Volume: ${Math.round(normalizedVolume * 100)}%`);
          }
        }, 50); // Update every 50ms

        // Connect to WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = 3000; // Mock server port
        ws = new WebSocket(`${protocol}//${host}:${port}/api/voice/realtime`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('[VoiceMode] Connected to realtime server');
          setStatus('ready');

          // Start recording and streaming audio
          startAudioStreaming(audioStream, ws);
        };

        ws.onmessage = async (event) => {
          const message = JSON.parse(event.data);
          console.log('[VoiceMode] Received:', message.type);

          switch (message.type) {
            case 'session.created':
              console.log('[VoiceMode] Session created:', message.session);
              break;

            case 'input_audio_buffer.speech_started':
              console.log('[VoiceMode] Speech detected');

              // Interrupt: Stop playing audio if user starts speaking
              if (isPlayingRef.current && currentAudioRef.current) {
                console.log('[VoiceMode] User speaking - stopping playback');
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
                isPlayingRef.current = false;
                audioChunksRef.current = [];
              }

              setStatus('user_speaking');
              break;

            case 'input_audio_buffer.speech_stopped':
              console.log('[VoiceMode] Pause detected - server will respond');
              setStatus('user_paused');
              break;

            case 'response.audio.started':
              console.log('[VoiceMode] AI starting to speak');
              setStatus('llm_speaking');
              isCollectingRef.current = true;
              audioChunksRef.current = [];
              break;

            case 'response.audio.delta':
              // Collect audio chunks
              if (message.delta && isCollectingRef.current) {
                audioChunksRef.current.push(message.delta);
              }
              break;

            case 'response.audio.done':
              console.log('[VoiceMode] AI finished speaking - playing audio');
              isCollectingRef.current = false;
              // Play the complete audio
              playAudio();
              break;

            case 'response.done':
              console.log('[VoiceMode] Response complete');
              setTimeout(() => {
                if (!isPlayingRef.current) {
                  setStatus('ready');
                }
              }, 500);
              break;

            case 'response.cancelled':
              console.log('[VoiceMode] Response cancelled due to user interrupt');
              // Stop collecting audio
              isCollectingRef.current = false;
              audioChunksRef.current = [];
              // Stop playing audio if currently playing
              if (isPlayingRef.current && currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
                isPlayingRef.current = false;
              }
              // Return to ready state
              setStatus('ready');
              break;

            case 'conversation.item.created':
              console.log('[VoiceMode] Conversation item created:', message.item);
              // Add message to the main chat
              if (message.item && message.item.content && message.item.content.length > 0 && setMessages) {
                const content = message.item.content[0];
                const text = content.type === 'input_text' ? content.text : content.text || '';

                const newMessage = {
                  id: message.item.id || Date.now().toString(),
                  sender: message.item.role === 'user' ? 'user' : 'ai',
                  name: message.item.role === 'user' ? 'You' : 'Assistant',
                  avatar: message.item.role === 'user' ? 'U' : undefined,
                  content: text,
                  timestamp: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, newMessage]);
              }
              break;

            default:
              console.log('[VoiceMode] Unknown message type:', message.type);
          }
        };

        ws.onerror = (error) => {
          console.error('[VoiceMode] WebSocket error:', error);
          setStatus('idle');
        };

        ws.onclose = () => {
          console.log('[VoiceMode] WebSocket closed');
          setStatus('idle');
        };
      } catch (err) {
        console.error('[VoiceMode] Failed to initialize:', err);
        setStatus('idle');
      }
    };

    // Start audio streaming to server
    const startAudioStreaming = (stream, websocket) => {
      if (!stream || !websocket) return;

      // Create MediaRecorder to capture audio
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // Send audio chunks to server as they're available
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && websocket.readyState === WebSocket.OPEN) {
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            const message = {
              type: 'input_audio_buffer.append',
              audio: base64,
              volume: volumeRef.current // Use ref to get current volume
            };

            websocket.send(JSON.stringify(message));
          };
          reader.readAsDataURL(event.data);
        }
      };

      // Start recording with 100ms chunks
      mediaRecorder.start(100);
      console.log('[VoiceMode] Started audio streaming');
    };

    // Initialize on mount
    initializeVoiceMode();

    // Cleanup on unmount
    return () => {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (ws) {
        ws.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Toggle mute/unmute
  const toggleMute = () => {
    if (audioStreamRef.current) {
      const audioTracks = audioStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // End the voice session
  const endSession = () => {
    onClose();
  };

  // Get orb class based on status
  const getOrbClass = () => {
    if (status === 'llm_speaking') return 'pichat-voice-orb speaking';
    return 'pichat-voice-orb';
  };

  // Calculate orb scale based on volume (1.0 to 1.6 range)
  const getOrbScale = () => {
    if (status === 'llm_speaking') {
      // For LLM speaking, use a subtle pulse animation
      return 1;
    }
    // For user input, scale based on volume
    const baseScale = 1;
    const volumeScale = volume * 0.6; // 0-0.6 range based on volume for more noticeable feedback
    return baseScale + volumeScale;
  };

  return (
    <div class="pichat-screen pichat-voice-screen">
      {/* Screen Header */}
      <div class="pichat-screen-header">
        <button class="pichat-icon-button pichat-icon-back" onClick={onClose} aria-label="Go back" title="Go back" />
        <h3 class="pichat-screen-title">Voice Mode</h3>
        {onClosePopup && (
          <button
            class="pichat-icon-button pichat-icon-close"
            onClick={onClosePopup}
            aria-label="Close chat"
            title="Close"
          />
        )}
      </div>

      {/* Voice Mode Content */}
      <div class="pichat-screen-content pichat-voice-container">
        {/* Main content area with orb */}
        <div class="pichat-voice-main">
          {/* Voice Orb Visualization */}
          <div
            class={getOrbClass()}
            style={{ transform: `scale(${getOrbScale()})` }}
          ></div>

          {/* Minimal UI - No controls in auto mode */}
        </div>

        {/* Control Buttons */}
        <div class="pichat-voice-controls">
          <button
            class={`pichat-voice-button pichat-voice-mute ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </button>

          <button
            class="pichat-voice-button pichat-voice-end"
            onClick={endSession}
            aria-label="End call"
            title="End call"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}