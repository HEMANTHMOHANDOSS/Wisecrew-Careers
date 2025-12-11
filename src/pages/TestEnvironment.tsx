
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Video, FileText, Clock, CheckCircle, Mic, AlertTriangle } from 'lucide-react';
import { GlassCard, Button, Badge, useToast, Modal } from '../components/GlassUI';
import { useData } from '../context/DataContext';

export const TestEnvironment: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>(); 
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { applications } = useData();
  const [timeLeft, setTimeLeft] = useState(type === 'coding' ? 2700 : type === 'mcq' ? 900 : 1800);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Question Data
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n  \n}');
  const [isLoadingQ, setIsLoadingQ] = useState(false);

  useEffect(() => {
    // Generate AI questions if not video
    const fetchQuestions = async () => {
        setIsLoadingQ(true);
        // Find config from application schedule
        const app = applications.find(a => a.referenceId === id);
        let config = { domain: 'General', difficulty: 'Medium', topic: 'Technology', count: 5 };
        
        if (app?.schedule) {
             const roundKey = type === 'mcq' ? 'round1' : 'round2';
             // @ts-ignore
             if (app.schedule[roundKey]?.config) {
                 // @ts-ignore
                 config = app.schedule[roundKey].config;
             }
        }

        if (type === 'interview') {
             setIsLoadingQ(false);
             return;
        }
        
        // Simulating mock data for demo if API fails
        if(type === 'mock') {
            setQuestions([
                { id: 1, q: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"] },
                { id: 2, q: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useMemo", "useContext"] }
            ]);
            setIsLoadingQ(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...config, 
                    type: type === 'mcq' ? 'mcq' : 'coding',
                    count: type === 'mcq' ? 10 : 2
                })
            });
            const data = await res.json();
            setQuestions(data);
        } catch (e) {
            console.error(e);
            // Fallback
            setQuestions([{ id: 1, q: "Backend connection failed. This is a fallback question.", options: ["A", "B", "C", "D"] }]);
        } finally {
            setIsLoadingQ(false);
        }
    };

    fetchQuestions();
  }, [type, id, applications]);

  useEffect(() => {
    if (isStarted && !isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isStarted) {
        handleSubmit();
    }
  }, [isStarted, isSubmitted, timeLeft]);

  const requestMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermissions(true);
      showToast('Camera and Mic connected', 'success');
    } catch (err) {
      showToast('Permission denied. Please enable camera access.', 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    showToast('Test Submitted Successfully!', 'success');
    // Here we would POST results to backend
    setTimeout(() => {
        navigate('/dashboard');
    }, 3000);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <GlassCard className="max-w-2xl w-full p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-6">
                {type === 'interview' ? <Video size={40} /> : type === 'coding' ? <Code size={40} /> : <FileText size={40} />}
            </div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {type === 'interview' ? 'Virtual Interview Room' : type === 'coding' ? 'Coding Assessment' : 'MCQ Skill Test'}
            </h1>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                {type === 'interview' 
                    ? "You are about to join a live video interview with the HR panel. Please ensure your camera and microphone are working." 
                    : "This is a timed assessment generated by AI based on the role requirements. Once started, you cannot pause."}
            </p>
            
            <Button size="lg" className="mt-8 w-full" disabled={isLoadingQ} onClick={() => {
                setIsStarted(true);
                if (type === 'interview') requestMedia();
            }}>
                {isLoadingQ ? 'Generating Questions...' : `Start ${type === 'interview' ? 'Interview' : 'Test'}`}
            </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <Badge variant="blue" className="uppercase">{type}</Badge>
                <h2 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                    {type === 'interview' ? 'Live Interview' : `Question ${currentQ + 1}/${questions.length}`}
                </h2>
            </div>
            <div className={`px-4 py-2 rounded-lg font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                <Clock size={18} /> {formatTime(timeLeft)}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* MCQ Layout */}
            {(type === 'mcq' || type === 'mock') && (
                <div className="lg:col-span-3">
                    <GlassCard className="p-8 min-h-[400px] flex flex-col">
                        <h3 className="text-xl font-medium mb-8 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                            {questions[currentQ]?.q}
                        </h3>
                        <div className="space-y-4 max-w-2xl">
                            {questions[currentQ]?.options?.map((opt: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setAnswers({...answers, [currentQ]: opt})}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQ] === opt ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'hover:bg-white/5 border-white/10'}`}
                                >
                                    <span className="inline-block w-6 font-bold opacity-50">{String.fromCharCode(65 + i)}.</span> {opt}
                                </button>
                            ))}
                        </div>
                        <div className="mt-auto pt-8 flex justify-between">
                            <Button variant="ghost" disabled={currentQ === 0} onClick={() => setCurrentQ(prev => prev - 1)}>Previous</Button>
                            {currentQ < questions.length - 1 ? (
                                <Button onClick={() => setCurrentQ(prev => prev + 1)}>Next Question</Button>
                            ) : (
                                <Button variant="primary" onClick={handleSubmit}>Submit Test</Button>
                            )}
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Coding Layout */}
            {type === 'coding' && (
                <>
                    <div className="lg:col-span-1">
                        <GlassCard className="p-6 h-full">
                            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>{questions[currentQ]?.title || 'Problem'}</h3>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{questions[currentQ]?.q}</p>
                            <div className="p-4 rounded-lg bg-black/20 text-xs font-mono mb-4 text-gray-300">
                                {questions[currentQ]?.example || 'No example provided'}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" disabled={currentQ === 0} onClick={() => setCurrentQ(prev => prev - 1)}>Prev</Button>
                                <Button size="sm" variant="ghost" disabled={currentQ === questions.length - 1} onClick={() => setCurrentQ(prev => prev + 1)}>Next</Button>
                            </div>
                        </GlassCard>
                    </div>
                    <div className="lg:col-span-2">
                        <GlassCard className="h-full flex flex-col overflow-hidden">
                            <div className="bg-black/40 p-2 text-xs font-mono text-gray-400 flex justify-between">
                                <span>main.js</span>
                                <span>JavaScript</span>
                            </div>
                            <textarea 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 w-full bg-transparent p-4 font-mono text-sm focus:outline-none resize-none"
                                style={{ color: '#e2e8f0' }}
                                spellCheck={false}
                            />
                            <div className="p-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
                                <Button variant="secondary" size="sm">Run Code</Button>
                                <Button onClick={handleSubmit}>Submit Solution</Button>
                            </div>
                        </GlassCard>
                    </div>
                </>
            )}

            {/* Video Interview Layout */}
            {type === 'interview' && (
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
                    <GlassCard className="relative overflow-hidden flex items-center justify-center bg-black/40">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-4 animate-pulse flex items-center justify-center">
                                <Video size={30} className="text-gray-400" />
                            </div>
                            <p className="text-gray-400">Waiting for HR Panel...</p>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-xs font-bold text-white">HR Panel</div>
                    </GlassCard>

                    <GlassCard className="relative overflow-hidden bg-black">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                         {!hasPermissions && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <Button onClick={requestMedia}>Enable Camera</Button>
                             </div>
                         )}
                         <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-xs font-bold text-white">You</div>
                    </GlassCard>

                    <div className="md:col-span-2 flex justify-center">
                        <Button variant="danger" size="lg" onClick={handleSubmit}>End Interview</Button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};
