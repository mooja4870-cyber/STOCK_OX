/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCcw, 
  ShieldCheck,
  Zap,
  Clock,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { QUESTIONS, WEIGHTS } from './constants';
import { Domain, DiagnosisResult, DomainScore } from './types';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [step, setStep] = useState<'intro' | 'survey' | 'loading' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setStep('loading');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const domainTotals: Record<Domain, number[]> = {
      [Domain.EMOTION_CONTROL]: [],
      [Domain.IMPULSIVITY]: [],
      [Domain.RULE_EXECUTION]: [],
      [Domain.LONG_TERM_PATIENCE]: [],
    };

    QUESTIONS.forEach(q => {
      const val = answers[q.id] || 3;
      // Invert score because high Likert (5) usually means "bad" for investment suitability in these questions
      // 1 (Strongly disagree) -> 100 points (Good for investment)
      // 5 (Strongly agree) -> 0 points (Bad for investment)
      const score = ((5 - val) / 4) * 100;
      domainTotals[q.domain].push(score);
    });

    const domainScores: DomainScore[] = Object.entries(domainTotals).map(([domain, scores]) => ({
      domain: domain as Domain,
      score: scores.reduce((a, b) => a + b, 0) / scores.length
    }));

    const totalScore = domainScores.reduce((acc, ds) => acc + (ds.score * WEIGHTS[ds.domain]), 0);

    let category: DiagnosisResult['category'] = 'SUITABLE';
    let recommendation = "";

    if (totalScore < 50) {
      category = 'UNSUITABLE';
      recommendation = "직접 투자는 위험할 수 있습니다. ETF 자동 적립식 투자나 로보어드바이저를 통한 간접 투자를 강력히 권장합니다.";
    } else if (totalScore < 75) {
      category = 'CONDITIONAL';
      recommendation = "철저한 규칙 기반 매매가 필요합니다. 대형주 위주의 포트폴리오와 정기적인 리밸런싱을 추천합니다.";
    } else {
      category = 'SUITABLE';
      recommendation = "본인만의 투자 철학을 실천할 수 있는 역량이 있습니다. 개별 종목 분석 및 트레이딩을 병행할 수 있습니다.";
    }

    const finalResult: DiagnosisResult = {
      totalScore,
      domainScores,
      category,
      recommendation
    };

    setResult(finalResult);
    setStep('result');
    getAiAdvice(finalResult);
  };

  const getAiAdvice = async (res: DiagnosisResult) => {
    setIsAiLoading(true);
    try {
      const prompt = `
        투자 성향 진단 결과입니다:
        - 총점: ${res.totalScore.toFixed(1)}/100
        - 감정 통제: ${res.domainScores.find(d => d.domain === Domain.EMOTION_CONTROL)?.score.toFixed(1)}
        - 충동성: ${res.domainScores.find(d => d.domain === Domain.IMPULSIVITY)?.score.toFixed(1)}
        - 규칙 실행: ${res.domainScores.find(d => d.domain === Domain.RULE_EXECUTION)?.score.toFixed(1)}
        - 장기 인내: ${res.domainScores.find(d => d.domain === Domain.LONG_TERM_PATIENCE)?.score.toFixed(1)}

        이 데이터를 바탕으로 이 사용자의 투자 성향을 분석하고, 구체적인 투자 전략(추천 자산군, 매매 주기, 주의사항)을 3문장 이내로 친절하게 조언해주세요. 한국어로 답변하세요.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setResult(prev => prev ? { ...prev, aiAdvice: response.text } : null);
    } catch (error) {
      console.error("AI Advice Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">StockFit</h1>
          </div>
          {step !== 'intro' && (
            <button 
              onClick={reset}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              <RefreshCcw size={14} /> 다시 시작
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
                  당신은 주식 투자를 <br />
                  <span className="text-emerald-600">해도 되는 성향</span>인가요?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  행동재무학 기반의 20가지 질문을 통해 <br />
                  당신의 투자 심리적 적합성을 정밀 진단해 드립니다.
                </p>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-bold text-gray-700">행동재무학(Behavioral Finance):</span> 노벨 경제학상 수상자 대니얼 카너먼(Daniel Kahneman)과 리처드 세일러(Richard Thaler)가 정립한 이론으로, 인간의 심리적 편향이 투자 결정에 미치는 영향을 연구합니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Brain, title: "감정 통제력", desc: "급락장에서도 평정심을 유지하는가" },
                  { icon: Zap, title: "충동 억제", desc: "뉴스에 휘둘리지 않고 원칙을 지키는가" },
                  { icon: Target, title: "규칙 실행", desc: "세운 계획을 끝까지 완수하는가" },
                  { icon: Clock, title: "장기 인내", desc: "시간의 힘을 믿고 기다릴 수 있는가" },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStep('survey')}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group"
              >
                진단 시작하기 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 'survey' && (
            <motion.div 
              key="survey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} / {QUESTIONS.length}
                </span>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-500" 
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold leading-snug min-h-[4rem]">
                  {QUESTIONS[currentQuestionIndex].text}
                </h3>

                <div className="space-y-3" key={currentQuestionIndex}>
                  {[
                    { label: "전혀 그렇지 않다", value: 1 },
                    { label: "그렇지 않다", value: 2 },
                    { label: "보통이다", value: 3 },
                    { label: "그렇다", value: 4 },
                    { label: "매우 그렇다", value: 5 },
                  ].map((option) => {
                    const isSelected = answers[QUESTIONS[currentQuestionIndex].id] === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(QUESTIONS[currentQuestionIndex].id, option.value)}
                        className={`w-full p-5 text-left border rounded-2xl transition-all group flex items-center justify-between ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500/10' 
                            : 'bg-white border-gray-100 hover:border-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        <span className={`font-medium ${isSelected ? 'text-emerald-700' : 'text-gray-700'} group-hover:text-emerald-700`}>
                          {option.label}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 size={18} className="text-emerald-600" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-6 py-3 text-gray-400 font-medium flex items-center gap-2 hover:text-gray-600 disabled:opacity-0 transition-all"
                >
                  <ChevronLeft size={20} /> 이전 질문
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">당신의 투자 성향을 분석 중입니다</h3>
                <p className="text-gray-500">행동재무학 모델을 기반으로 결과를 산출하고 있습니다...</p>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Result Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                    Diagnosis Result
                  </div>
                  <h2 className="text-3xl font-black">
                    {result.category === 'SUITABLE' && "투자 적합형 🟢"}
                    {result.category === 'CONDITIONAL' && "조건부 투자형 🟡"}
                    {result.category === 'UNSUITABLE' && "투자 주의형 🔴"}
                  </h2>
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-6xl font-black text-emerald-600">{result.totalScore.toFixed(0)}</span>
                    <span className="text-xl font-bold text-gray-400">/ 100</span>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.domainScores.map(ds => ({
                      subject: ds.domain === Domain.EMOTION_CONTROL ? '감정통제' : 
                               ds.domain === Domain.IMPULSIVITY ? '충동억제' : 
                               ds.domain === Domain.RULE_EXECUTION ? '규칙실행' : '장기인내',
                      A: ds.score,
                      fullMark: 100,
                    }))}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#059669"
                        fill="#10B981"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <ShieldCheck size={20} /> 전문가 추천 전략
                  </div>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {result.recommendation}
                  </p>
                </div>

                {/* AI Advice */}
                <div className="p-6 bg-emerald-900 text-white rounded-2xl shadow-lg space-y-4 relative overflow-hidden">
                  <Sparkles className="absolute top-4 right-4 text-emerald-400 opacity-30" size={40} />
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <Brain size={18} /> AI 맞춤형 투자 조언
                  </div>
                  {isAiLoading ? (
                    <div className="flex items-center gap-3 text-emerald-200">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-sm">AI가 당신의 성향을 분석하여 조언을 작성 중입니다...</span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-emerald-50">
                      {result.aiAdvice || "AI 분석 결과를 불러오는 데 실패했습니다."}
                    </p>
                  )}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.domainScores.map((ds, i) => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">
                        {ds.domain === Domain.EMOTION_CONTROL && "감정 통제"}
                        {ds.domain === Domain.IMPULSIVITY && "충동 억제"}
                        {ds.domain === Domain.RULE_EXECUTION && "규칙 실행"}
                        {ds.domain === Domain.LONG_TERM_PATIENCE && "장기 인내"}
                      </span>
                      <span className={`text-lg font-black ${ds.score > 70 ? 'text-emerald-600' : ds.score > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {ds.score.toFixed(0)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${ds.score > 70 ? 'bg-emerald-500' : ds.score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        style={{ width: `${ds.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={reset}
                className="w-full py-5 border-2 border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                다시 진단하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-100 text-center space-y-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Behavioral Finance Analysis Engine v1.0
          </p>
          <p className="text-[10px] text-gray-300 px-10">
            본 진단 결과는 참고용이며, 실제 투자 성과를 보장하지 않습니다. <br />
            모든 투자의 책임은 투자자 본인에게 있습니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
