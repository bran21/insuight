import { useEffect, useState, useRef } from 'react';
import type { MonologueLine, TradeProposal } from '../services/agentService';
import { runAgentCycle, generateDemoMonologue } from '../services/agentService';

export default function AgentConsole() {
  const [monologue, setMonologue] = useState<MonologueLine[]>([]);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [monologue]);

  // Run demo on mount
  useEffect(() => {
    const lines = generateDemoMonologue();
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setMonologue(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  async function handleRunCycle() {
    setIsRunning(true);
    setMode('live');
    setMonologue([]);
    setProposals([]);

    try {
      const result = await runAgentCycle();
      // Stream lines with delay
      for (let i = 0; i < result.lines.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setMonologue(prev => [...prev, result.lines[i]]);
      }
      setProposals(result.proposals);
    } catch {
      setMonologue(prev => [...prev, {
        id: `err-${Date.now()}`,
        timestamp: Date.now(),
        tag: 'error' as const,
        message: 'Agent cycle failed. Check console for details.',
      }]);
    }
    setIsRunning(false);
  }

  function handleRunDemo() {
    setMode('demo');
    setMonologue([]);
    setProposals([]);
    const lines = generateDemoMonologue();
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setMonologue(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
  }

  const tagColors: Record<string, string> = {
    research: 'tag-research',
    analyze: 'tag-analyze',
    signal: 'tag-signal',
    propose: 'tag-propose',
    waiting: 'tag-waiting',
    error: 'tag-error',
    info: 'tag-waiting',
  };

  const pendingCount = proposals.filter(p => p.status === 'pending').length;

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-xl border border-accent/10">
              🤖
            </div>
            <h1 className="section-header">Agent Console</h1>
          </div>
          <p className="text-text-secondary text-sm md:text-base max-w-md">
            Watch the AI agent research, analyze, and propose prediction trades
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="btn-secondary flex items-center gap-2 text-sm" onClick={handleRunDemo} disabled={isRunning}>
            <span>▶</span> Demo
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm" onClick={handleRunCycle} disabled={isRunning}>
            {isRunning ? (
              <><span className="animate-spin inline-block">⏳</span> Running…</>
            ) : (
              <><span>🔍</span> Live Scan</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Inner Monologue Terminal */}
        <div className="glass-card overflow-hidden flex flex-col shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Terminal Header */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-bg-secondary/30">
            <div className="flex items-center gap-3">
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red/60" />
                <span className="w-3 h-3 rounded-full bg-amber/60" />
                <span className="w-3 h-3 rounded-full bg-green/60" />
              </div>
              <div className="flex items-center gap-2">
                <div className={`status-dot ${isRunning ? 'status-dot-live' : mode === 'demo' ? 'status-dot-demo' : 'status-dot-idle'}`} />
                <span className="text-xs font-bold text-text-secondary tracking-wide uppercase">
                  Inner Monologue
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  {mode === 'demo' ? '(demo)' : '(live)'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-text-muted font-mono tracking-wider bg-bg-secondary/50 px-2 py-0.5 rounded">
              {monologue.length} lines
            </span>
          </div>

          {/* Terminal Body */}
          <div
            ref={scrollRef}
            className="relative p-5 h-[480px] overflow-y-auto bg-[#0a0a0a] scroll-smooth border-t border-white/5"
          >
            {/* Terminal scanlines / grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]" />
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]" />

            <div className="relative z-10 h-full">
              {monologue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40 gap-3">
                <span className="text-3xl opacity-30">⌨️</span>
                <p className="text-xs font-mono opacity-60 text-center max-w-[200px]">
                  Press "Demo" or "Live Scan" to start the agent…
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {monologue.map((line, i) => (
                  <div
                    key={line.id}
                    className="monologue-line"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <span className={`tag ${tagColors[line.tag]}`}>
                      [{line.tag.toUpperCase()}]
                    </span>
                    <span className="text-white/85">
                      {line.message}
                    </span>
                  </div>
                ))}
                {isRunning && (
                  <div className="monologue-line" style={{ opacity: 1 }}>
                    <span className="tag tag-waiting">▌</span>
                    <span className="text-white/30 animate-pulse text-xs">thinking…</span>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Trade Proposals Panel */}
        <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-text-secondary uppercase tracking-wider">
              <span>📋</span> Trade Proposals
            </h3>
            {pendingCount > 0 && (
              <span className="badge badge-accent">
                {pendingCount} pending
              </span>
            )}
          </div>

          {proposals.length === 0 ? (
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center flex-1 min-h-[360px] border-dashed">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary/60 flex items-center justify-center text-2xl mb-4 opacity-40">
                📝
              </div>
              <p className="text-text-muted text-xs max-w-[180px] leading-relaxed">
                No proposals yet. Run the agent to generate trade ideas.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4 max-h-[520px]">
              {proposals.map((proposal, i) => (
                <div
                  key={proposal.id}
                  className="glass-card p-4 group animate-slide-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Proposal Header */}
                  <div className="flex justify-between items-center mb-3">
                    <span className={`badge ${proposal.isUp ? 'badge-green' : 'badge-red'}`}>
                      {proposal.isUp ? '↑ UP' : '↓ DOWN'}
                    </span>
                    <span className="badge badge-green">
                      +{(proposal.edge * 100).toFixed(1)}% EDGE
                    </span>
                  </div>

                  {/* Oracle Name */}
                  <p className="text-sm font-bold mb-3 group-hover:text-accent transition-colors">
                    {proposal.oracleName}
                  </p>

                  {/* Details */}
                  <div className="text-xs text-text-muted mb-3 flex flex-col gap-1.5 p-3 bg-bg-secondary/30 rounded-lg border border-border/30">
                    <div className="flex justify-between">
                      <span>Strike</span>
                      <span className="font-mono text-text-primary font-medium">${proposal.strike}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity</span>
                      <span className="font-mono text-text-primary font-medium">{proposal.quantity} DUSDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Prob</span>
                      <span className="font-mono text-text-primary font-medium">{(proposal.aiProbability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Oracle</span>
                      <span className="font-mono text-text-primary font-medium">{(proposal.oracleFairPrice).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <p className="text-[11px] text-text-muted italic mb-4 leading-relaxed pl-3 border-l-2 border-accent/20 py-1">
                    "{proposal.reasoning}"
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className={`btn-primary flex-1 text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 ${
                        proposal.status === 'approved' ? '!bg-green !shadow-green/20' : ''
                      }`}
                      onClick={() => {
                        setProposals(prev => prev.map(p =>
                          p.id === proposal.id ? { ...p, status: 'approved' } : p
                        ));
                      }}
                      disabled={proposal.status !== 'pending'}
                    >
                      {proposal.status === 'approved' ? (
                        <>✅ Approved</>
                      ) : (
                        <>✍️ Sign & Execute</>
                      )}
                    </button>
                    <button
                      className="btn-secondary text-xs py-2.5 px-3 hover:!bg-red/10 hover:!text-red hover:!border-red/30"
                      onClick={() => {
                        setProposals(prev => prev.map(p =>
                          p.id === proposal.id ? { ...p, status: 'rejected' } : p
                        ));
                      }}
                      disabled={proposal.status !== 'pending'}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
