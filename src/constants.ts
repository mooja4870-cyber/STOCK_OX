import { Domain, Question } from './types';

export const QUESTIONS: Question[] = [
  // 감정 통제 (Emotion Control)
  { id: 1, text: "주가가 5% 이상 급락하면 일상생활에 지장이 있을 정도로 불안하다.", domain: Domain.EMOTION_CONTROL },
  { id: 2, text: "손실이 발생하면 원금을 회복하기 위해 즉시 더 큰 금액을 투자하고 싶어진다.", domain: Domain.EMOTION_CONTROL },
  { id: 3, text: "수익이 나고 있을 때 더 큰 수익을 위해 무리하게 빚을 내서 투자하고 싶다.", domain: Domain.EMOTION_CONTROL },
  { id: 4, text: "내 종목이 하락할 때 다른 사람들이 돈을 벌고 있다는 사실이 견디기 힘들다.", domain: Domain.EMOTION_CONTROL },
  { id: 5, text: "매수 후 주가 창을 10분 단위로 확인하지 않으면 불안하다.", domain: Domain.EMOTION_CONTROL },

  // 충동성 (Impulsivity)
  { id: 6, text: "유튜브나 뉴스에서 추천하는 종목을 보면 분석 없이 바로 매수하는 편이다.", domain: Domain.IMPULSIVITY },
  { id: 7, text: "주변 지인이 '이거 진짜 좋다'라고 하면 나도 모르게 매수 버튼을 누른다.", domain: Domain.IMPULSIVITY },
  { id: 8, text: "계획에 없던 종목을 장중에 충동적으로 매수한 적이 많다.", domain: Domain.IMPULSIVITY },
  { id: 9, text: "급등하는 종목을 보면 '나만 소외될까 봐' 급하게 따라 들어간다.", domain: Domain.IMPULSIVITY },
  { id: 10, text: "한 번에 큰 수익을 내기 위해 분산 투자보다는 몰빵 투자를 선호한다.", domain: Domain.IMPULSIVITY },

  // 규칙 실행 (Rule Execution)
  { id: 11, text: "매수 전 세운 손절가나 익절가 원칙을 실제 상황에서 지키기 어렵다.", domain: Domain.RULE_EXECUTION },
  { id: 12, text: "물린 종목에 대해 '언젠간 오르겠지'라며 무작정 방치하는 경우가 많다.", domain: Domain.RULE_EXECUTION },
  { id: 13, text: "나만의 투자 원칙이 명확하지 않거나, 있어도 감정에 따라 바뀐다.", domain: Domain.RULE_EXECUTION },
  { id: 14, text: "매매 일지를 작성하거나 복기하는 과정이 귀찮고 필요 없다고 생각한다.", domain: Domain.RULE_EXECUTION },
  { id: 15, text: "시장이 과열되었을 때 현금 비중을 늘리라는 조언을 무시하고 풀매수한다.", domain: Domain.RULE_EXECUTION },

  // 장기 인내 (Long-term Patience)
  { id: 16, text: "좋은 종목이라도 3개월 이상 주가가 횡보하면 지루해서 팔아버린다.", domain: Domain.LONG_TERM_PATIENCE },
  { id: 17, text: "단기적인 급등주 매매가 우량주 장기 투자보다 훨씬 매력적이라고 느낀다.", domain: Domain.LONG_TERM_PATIENCE },
  { id: 18, text: "복리의 마법보다는 한 번의 대박 수익이 더 현실적이라고 믿는다.", domain: Domain.LONG_TERM_PATIENCE },
  { id: 19, text: "기업의 가치 분석보다는 차트의 움직임에 더 의존하는 편이다.", domain: Domain.LONG_TERM_PATIENCE },
  { id: 20, text: "1년 뒤의 100% 수익보다 내일 당장의 5% 수익이 더 중요하다.", domain: Domain.LONG_TERM_PATIENCE },
];

export const WEIGHTS = {
  [Domain.EMOTION_CONTROL]: 0.30,
  [Domain.IMPULSIVITY]: 0.25,
  [Domain.RULE_EXECUTION]: 0.25,
  [Domain.LONG_TERM_PATIENCE]: 0.20,
};
