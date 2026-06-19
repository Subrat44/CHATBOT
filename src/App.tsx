import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Plus, 
  Trash2, 
  Compass, 
  BrainCircuit, 
  Headphones, 
  Sparkles, 
  Code, 
  Layers, 
  Search, 
  MessageSquare, 
  Undo, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Rule, ChatMessage, BotScenario, TriggerType, DebugMatchInfo } from './types';
import { BOT_SCENARIOS, processRuleEngine, normalizeText } from './data';

export default function App() {
  // Use local storage to persist rules if possible or default to scenario configs
  const [activeScenarioId, setActiveScenarioId] = useState<string>('support');
  const [scenarioRules, setScenarioRules] = useState<Record<string, Rule[]>>(() => {
    const initial: Record<string, Rule[]> = {};
    BOT_SCENARIOS.forEach(sc => {
      initial[sc.id] = [...sc.defaultRules];
    });
    return initial;
  });

  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() => {
    const initial: Record<string, ChatMessage[]> = {};
    BOT_SCENARIOS.forEach(sc => {
      initial[sc.id] = [
        {
          id: `${sc.id}-welcome`,
          sender: 'bot',
          text: sc.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    return initial;
  });

  const [userInput, setUserInput] = useState<string>('');
  const [selectedDebugInfo, setSelectedDebugInfo] = useState<DebugMatchInfo | null>(null);
  
  // Custom Rule Setup Form state
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleTriggerType, setNewRuleTriggerType] = useState<TriggerType>('contains');
  const [newRulePatterns, setNewRulePatterns] = useState('');
  const [newRuleResponse, setNewRuleResponse] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState('Custom');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Quick Live Simulator state (for debugging typing in real-time)
  const [simulatedInput, setSimulatedInput] = useState<string>('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const activeScenario = BOT_SCENARIOS.find(s => s.id === activeScenarioId) || BOT_SCENARIOS[0];
  const activeRules = scenarioRules[activeScenarioId] || [];
  const activeMessages = chatHistories[activeScenarioId] || [];

  // Scroll to bottom on updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeMessages]);

  // Sync simulated input when user starts typing or typing in main chat
  useEffect(() => {
    if (activeMessages.length > 0) {
      const lastUserMsg = [...activeMessages].reverse().find(m => m.sender === 'user');
      if (lastUserMsg?.debugInfo) {
        setSelectedDebugInfo(lastUserMsg.debugInfo);
      }
    }
  }, [activeScenarioId]);

  // Handle message sending
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = `usr-${Date.now()}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Process with our local custom NLP Rule Engine
    const { matchedRule, debugInfo } = processRuleEngine(textToSend, activeRules);

    // Increment Rule counter if one matched
    if (matchedRule) {
      setScenarioRules(prev => {
        const scRules = prev[activeScenarioId].map(r => {
          if (r.id === matchedRule.id) {
            return { ...r, usageCount: r.usageCount + 1 };
          }
          return r;
        });
        return { ...prev, [activeScenarioId]: scRules };
      });
    }

    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: timestampStr,
      debugInfo
    };

    // Prepare bot response
    const botMsgId = `bot-${Date.now()}`;
    const botResponseText = matchedRule ? matchedRule.response : getFallbackResponse(activeScenarioId);
    
    const botMessage: ChatMessage = {
      id: botMsgId,
      sender: 'bot',
      text: botResponseText,
      timestamp: timestampStr,
      matchedRuleId: matchedRule?.id
    };

    setChatHistories(prev => ({
      ...prev,
      [activeScenarioId]: [...(prev[activeScenarioId] || []), userMessage, botMessage]
    }));

    setSelectedDebugInfo(debugInfo);
    setUserInput('');
  };

  const getFallbackResponse = (scenarioId: string): string => {
    if (scenarioId === 'eliza') {
      const elizaFallbacks = [
        "Please go on. Tell me more.",
        "Does that trouble you?",
        "Why do you say that?",
        "Can you elaborate on that point?",
        "How does that relate to your current situation?",
        "Very interesting. Let's delve deeper into why you think so."
      ];
      return elizaFallbacks[Math.floor(Math.random() * elizaFallbacks.length)];
    }
    if (scenarioId === 'adventure') {
      return "I didn't recognize that move. Try command keywords like 'look', 'east', 'north', or 'unlock door' to navigate.";
    }
    return "I couldn't match that query to my predefined rules. Try typing 'pricing', 'hours', 'contact', or adding a custom rule in the right-hand panel!";
  };

  // Preset commands for user to test easily
  const getScenariosQuickPrompts = (id: string) => {
    switch (id) {
      case 'support':
        return [
          { label: '👋 Say Hello', text: 'Hello, is there someone here?' },
          { label: '💰 Check Pricing', text: 'What are your pricing plans?' },
          { label: '🕒 Store Hours', text: 'Are you guys open on the weekend?' },
          { label: '👤 Speak with Human', text: 'I need to talk to a supervisor' }
        ];
      case 'adventure':
        return [
          { label: '🔎 Inspect surroundings', text: 'look' },
          { label: '🌲 Head Forest (North)', text: 'go north' },
          { label: '📦 Search Ivy Chest', text: 'chest' },
          { label: '🔑 Grab Silver Key', text: 'take key' },
          { label: '🚪 Unlock White House', text: 'unlock' }
        ];
      case 'eliza':
        return [
          { label: '😔 Feel Down', text: 'I am feeling very sad and isolated' },
          { label: '👨 Tell of Father', text: 'My father was very demanding of me' },
          { label: '💭 Share Nightmare', text: 'I had a vivid dream about climbing mountains last night' },
          { label: '❓ Ask Eliza', text: 'How do you operate?' }
        ];
      default:
        return [];
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!newRuleName.trim()) {
      setFormError('Please provide a descriptive rule name.');
      return;
    }
    if (!newRulePatterns.trim()) {
      setFormError('Include at least one pattern keyword/phrase.');
      return;
    }
    if (!newRuleResponse.trim()) {
      setFormError('Please specify the bot response when this rule triggers.');
      return;
    }

    const patternsArray = newRulePatterns
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (patternsArray.length === 0) {
      setFormError('At least one pattern must be non-empty.');
      return;
    }

    const newRule: Rule = {
      id: `custom-${Date.now()}`,
      name: newRuleName.trim(),
      triggerType: newRuleTriggerType,
      patterns: patternsArray,
      response: newRuleResponse.trim(),
      category: newRuleCategory.trim() || 'Custom',
      usageCount: 0,
      isSystem: false
    };

    setScenarioRules(prev => ({
      ...prev,
      [activeScenarioId]: [newRule, ...prev[activeScenarioId]]
    }));

    // Reset forms
    setNewRuleName('');
    setNewRulePatterns('');
    setNewRuleResponse('');
    setNewRuleCategory('Custom');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleDeleteRule = (ruleId: string) => {
    setScenarioRules(prev => ({
      ...prev,
      [activeScenarioId]: prev[activeScenarioId].filter(r => r.id !== ruleId)
    }));
  };

  const resetToDefaultRules = () => {
    const sc = BOT_SCENARIOS.find(s => s.id === activeScenarioId);
    if (sc) {
      setScenarioRules(prev => ({
        ...prev,
        [activeScenarioId]: [...sc.defaultRules]
      }));
    }
  };

  // Get active scenario icon component
  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5 text-indigo-600" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-purple-600" />;
      case 'Headphones': default: return <Headphones className="w-5 h-5 text-emerald-600" />;
    }
  };

  // Live tester calculations
  const { normalized: liveNormalized, tokens: liveTokens } = normalizeText(simulatedInput);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Professional Polish Main Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <Bot className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              RuleBot Analyzer
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono font-normal">
                v2.4.0-pro
              </span>
            </h1>
            <p className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active &amp; Monitoring
            </p>
          </div>
        </div>

        {/* Dynamic Scenario Swapper built with elegant responsive tabs */}
        <div className="hidden md:flex gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-205">
          {BOT_SCENARIOS.map(sc => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                const userMsgs = chatHistories[sc.id]?.filter(m => m.sender === 'user');
                if (userMsgs && userMsgs.length > 0) {
                  setSelectedDebugInfo(userMsgs[userMsgs.length - 1].debugInfo);
                } else {
                  setSelectedDebugInfo(null);
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                activeScenarioId === sc.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {getScenarioIcon(sc.icon)}
              {sc.name}
            </button>
          ))}
        </div>

        {/* Latency and Accuracy Engine stats */}
        <div className="flex gap-4 sm:gap-6 items-center">
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Logic Latency</p>
            <p className="text-xs font-mono text-slate-700 font-semibold">
              {selectedDebugInfo ? `${selectedDebugInfo.searchTimeMs}ms` : '14ms'}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Sim Engine</p>
            <p className="text-xs font-mono text-indigo-600 font-semibold">98.2% Acc</p>
          </div>
        </div>
      </header>

      {/* Mobile Scenario Selector Tab-bar */}
      <div className="md:hidden flex overflow-x-auto bg-white border-b border-slate-200 p-2 gap-1.5">
        {BOT_SCENARIOS.map(sc => (
          <button
            key={sc.id}
            onClick={() => {
              setActiveScenarioId(sc.id);
              const userMsgs = chatHistories[sc.id]?.filter(m => m.sender === 'user');
              if (userMsgs && userMsgs.length > 0) {
                setSelectedDebugInfo(userMsgs[userMsgs.length - 1].debugInfo);
              } else {
                setSelectedDebugInfo(null);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border shrink-0 flex items-center gap-1.5 ${
              activeScenarioId === sc.id
                ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {getScenarioIcon(sc.icon)}
            {sc.name}
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column: Chat Previews & Flow Simulator (7 Columns) */}
        <section className="lg:col-span-7 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
          
          {/* Active Bot Bio Banner */}
          <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wider">
                  {activeScenario.name} Active Agent
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Rules active: {activeRules.length}</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-800 mt-1">{activeScenario.tagline}</h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md">
                {activeScenario.description}
              </p>
            </div>
            <button
              onClick={resetToDefaultRules}
              className="text-xs text-slate-500 hover:text-indigo-600 transition-colors bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-250 flex items-center gap-1.5 self-start sm:self-center shadow-sm cursor-pointer"
            >
              <Undo className="w-3.5 h-3.5" /> Reset Default Rules
            </button>
          </div>

          {/* Chat message streams - rendered as professional polish spec layout */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 overflow-y-auto p-6 bg-slate-50/20 space-y-6 scrollbar-thin"
          >
            {activeMessages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Left Avatar: only show for incoming bot */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-650 font-bold text-xs shadow-sm">
                      AI
                    </div>
                  )}

                  {/* Message Bubble wrapper */}
                  <div className={`space-y-1.5 ${isUser ? 'max-w-lg' : 'max-w-xl'}`}>
                    <div className={`${
                      isUser
                        ? 'bg-indigo-600 p-4 rounded-xl rounded-tr-none shadow-md text-white'
                        : 'bg-white border border-slate-200 p-4 rounded-xl rounded-tl-none shadow-sm text-slate-750'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Sub-tags for Rule classification */}
                      {!isUser && msg.matchedRuleId && (
                        <span className="block mt-2.5 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                          • Triggered by {msg.matchedRuleId.toUpperCase()}
                        </span>
                      )}
                      {!isUser && !msg.matchedRuleId && index > 0 && (
                        <span className="block mt-2.5 text-[10px] text-amber-600 font-semibold tracking-wider uppercase">
                          • Triggered by RULE_FALLBACK
                        </span>
                      )}
                    </div>

                    {/* Timestamp & Interactive NLP debugger triggers */}
                    <div className={`flex items-center gap-2 text-[10px] ${isUser ? 'justify-end' : 'justify-start'} text-slate-400`}>
                      <Clock className="w-3 h-3 text-slate-350" />
                      <span>{msg.timestamp}</span>

                      {isUser && msg.debugInfo && (
                        <>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => setSelectedDebugInfo(msg.debugInfo || null)}
                            className={`flex items-center gap-1 hover:text-indigo-600 font-mono font-semibold transition-colors ${
                              selectedDebugInfo?.originalText === msg.text 
                                ? 'text-indigo-600 underline' 
                                : 'text-slate-400'
                            }`}
                          >
                            <Layers className="w-3 h-3" /> logic trace
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Avatar: only show for outgoing user */}
                  {isUser && (
                    <div className="w-8 h-8 rounded bg-slate-800 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      ME
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick floating logic snapshot overlay if available */}
            {selectedDebugInfo && (
              <div className="flex justify-center pt-2">
                <div className="px-4 py-2 bg-slate-800 rounded-full text-white text-[11px] font-mono shadow-lg flex items-center gap-3 border border-slate-750 opacity-95">
                  <span className="text-indigo-400 font-medium">MATCH OVERVIEW:</span>
                  <span>
                    {selectedDebugInfo.matchedPattern ? `Pattern "${selectedDebugInfo.matchedPattern}"` : 'NO PRECISE MATCH'}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-amber-300 font-semibold">
                    Score: {(selectedDebugInfo.matchScore || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="px-5 py-3 border-t border-slate-200 bg-white">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Suggested Rules Triggers
            </p>
            <div className="flex flex-wrap gap-1.5">
              {getScenariosQuickPrompts(activeScenarioId).map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p.text)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-xs text-slate-600 font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Styled Bottom Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  setSimulatedInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(userInput);
                  }
                }}
                placeholder={`Type a message to test rules... (e.g. Try keywords from the right directory)`}
                className="w-full pl-5 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder-slate-400 text-slate-850"
              />
              <div className="absolute right-2.5">
                <button
                  onClick={() => handleSendMessage(userInput)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="mt-2.5 text-center text-[10px] text-slate-400">
              Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono font-medium">Enter</kbd> to execute NLP sequence test & check engine accuracy
            </p>
          </div>
        </section>

        {/* Right Column: Rule Engine Control and Debug Dashboard (5 Columns) */}
        <section className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] pr-1 scrollbar-thin">
          
          {/* Top Panel: NLP Pipeline Debug Tracing */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col relative">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3.5 mb-3.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Logic Parser Trace</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-semibold px-2 py-0.5 rounded">
                PIPELINE Log
              </span>
            </div>

            {selectedDebugInfo ? (
              <div className="space-y-4 text-xs">
                {/* Visual steps of processing */}
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1">User Query String</span>
                  <div className="bg-slate-50 border border-slate-150 p-2.5 rounded font-mono text-[11px] text-slate-700 font-medium">
                    "{selectedDebugInfo.originalText}"
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1">Normalized Stream</span>
                    <div className="bg-slate-50 p-2 rounded text-slate-700 font-mono text-[11px] truncate">
                      "{selectedDebugInfo.normalizedText || '—'}"
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1">Weight Factor</span>
                    <div className="bg-slate-50 p-2 rounded text-slate-750 font-mono text-[11px] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      {(selectedDebugInfo.matchScore * 100).toFixed(0)}% Math Score
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1.5">Parsed NLP Word-Tokens</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDebugInfo.tokens.length > 0 ? (
                      selectedDebugInfo.tokens.map((tok, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono rounded font-medium">
                          {tok}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic font-mono text-[11px]">No word tokens parsed</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-150 pt-3.5">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase mb-2">Sequential Processing Log</span>
                  <div className="space-y-2">
                    {selectedDebugInfo.evaluationSteps.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-2.5 p-2 rounded bg-slate-50 border border-slate-150">
                        <div className="mt-0.5 shrink-0">
                          {step.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          {step.status === 'info' && <HelpCircle className="w-3.5 h-3.5 text-blue-500" />}
                          {step.status === 'fail' && <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-700 text-[11px]">{step.stepName}</p>
                          <p className="text-slate-500 text-[11px] font-mono mt-0.5 break-all leading-relaxed bg-white p-1 rounded-sm border border-slate-100">
                            {step.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4 text-slate-400">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-400" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Waiting for Utterance Capture</p>
                <p className="text-[11px] mt-1.5 text-slate-450 leading-relaxed">
                  Submit a query to watch the rules engine execute sentence normalization, spacing squeezes, lexer tokenization, and regular expression evaluations.
                </p>
              </div>
            )}
          </div>

          {/* Lower Panel: Rules Dictionary Directory & Form Maker */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
            
            {/* Custom Rule Creator with details transition element */}
            <details className="group border-b border-slate-150 pb-4 mb-4">
              <summary className="flex items-center justify-between text-slate-900 font-semibold cursor-pointer text-sm list-none outline-none select-none">
                <span className="flex items-center gap-2 text-indigo-700 font-bold">
                  <Plus className="w-4 h-4" /> Inject New Custom Override Rule
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono font-medium group-open:hidden">
                  Add Rule +
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium hidden group-open:inline">
                  Close -
                </span>
              </summary>
              
              <form onSubmit={handleCreateRule} className="mt-4 space-y-3 px-0.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Rule Name ID</label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. RULE_REFUND_OVERRIDE"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Matching Class</label>
                    <select
                      value={newRuleTriggerType}
                      onChange={(e) => setNewRuleTriggerType(e.target.value as TriggerType)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs text-slate-800 bg-white focus:outline-none"
                    >
                      <option value="contains">Contains Keyword</option>
                      <option value="exact">Exact Phrase Match</option>
                      <option value="regex">Regex Expression</option>
                      <option value="starts_with">Starts With Prefix</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Category tag</label>
                    <input
                      type="text"
                      value={newRuleCategory}
                      onChange={(e) => setNewRuleCategory(e.target.value)}
                      placeholder="e.g. Billing"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Pattern Triggers <span className="font-normal text-slate-450 normal-case">(Comma separated values)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newRulePatterns}
                    onChange={(e) => setNewRulePatterns(e.target.value)}
                    placeholder="e.g. refund, back, cancellation"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-800 font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Regex uses standard Javascript literals (e.g. <code className="bg-slate-100 px-1 py-0.2 rounded font-mono text-[9px]">refund.*money</code>).
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Response Utterance Output</label>
                  <textarea
                    required
                    rows={2}
                    value={newRuleResponse}
                    onChange={(e) => setNewRuleResponse(e.target.value)}
                    placeholder="Provide response string to synthesize..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Success: Rule injected directly into scanner database!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Match-Rule Injection
                </button>
              </form>
            </details>

            {/* Rules Dictionary Header list */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Engine Rules Dictionary ({activeRules.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Top-to-Bottom Precedence</span>
              </div>

              {/* Display rule list styled as professional rule card templates */}
              <div className="space-y-3.5 overflow-y-auto max-h-[355px] pr-1 flex-1">
                {activeRules.map((r, i) => (
                  <div 
                    key={r.id} 
                    className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs relative hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          r.isSystem 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {r.name.replace(/\s+/g, '_').toUpperCase()}
                        </span>
                        <span className="text-[9px] text-slate-400">({r.category})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase pr-6">
                        Hits: {r.usageCount}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[11px] text-slate-400 italic">IF input matches via {r.triggerType}:</p>
                      <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded">
                        {r.patterns.map((pat, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px]">
                            {pat}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 italic mt-2">THEN synthesize response:</p>
                      <p className="text-xs text-slate-700 leading-tight bg-slate-50 p-2 rounded border border-slate-150-subtle font-sans italic">
                        "{r.response}"
                      </p>
                    </div>

                    {/* Delete overrides for custom injector items */}
                    {!r.isSystem && (
                      <button
                        onClick={() => handleDeleteRule(r.id)}
                        className="p-1 hover:text-red-600 hover:bg-red-50 text-slate-400 rounded transition-colors absolute right-2.5 top-2.5 cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Live Helper Panel */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-950 font-mono text-xs space-y-2 shadow-md">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Live Input Normalization Previewer
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Simulator Sandbox text / live key capture:</span>
              <input
                type="text"
                value={simulatedInput}
                onChange={(e) => setSimulatedInput(e.target.value)}
                placeholder="Type symbols/punctuation to preview NLP normalization..."
                className="w-full bg-slate-950 border border-slate-800 text-emerald-400 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Normalized Text Result</span>
                <span className="text-indigo-300 block truncate font-mono text-[11px] bg-slate-950 px-2 py-1 rounded border border-slate-850 mt-1">
                  {liveNormalized ? `"${liveNormalized}"` : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Derived Tokens size</span>
                <span className="text-amber-400 block font-mono text-[11px] bg-slate-950 px-2 py-1 rounded border border-slate-850 mt-1">
                  {liveTokens.length} {liveTokens.length === 1 ? 'word' : 'words'}
                </span>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
