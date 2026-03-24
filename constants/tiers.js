export const TIERS = [
  {
    name: '브론즈',
    emoji: '🥉',
    minScore: 0,
    maxScore: 29,
    description: 'AI에게 완패했습니다...',
    color: '#CD7F32',
  },
  {
    name: '실버',
    emoji: '🥈',
    minScore: 30,
    maxScore: 49,
    description: '아직 AI가 더 강했네요.',
    color: '#C0C0C0',
  },
  {
    name: '골드',
    emoji: '🥇',
    minScore: 50,
    maxScore: 69,
    description: '나쁘지 않아요! 논리가 있었습니다.',
    color: '#FFD700',
  },
  {
    name: '플래티넘',
    emoji: '💎',
    minScore: 70,
    maxScore: 84,
    description: '꽤 강한 논리였어요! AI가 힘들었습니다.',
    color: '#E5E4E2',
  },
  {
    name: '다이아몬드',
    emoji: '💠',
    minScore: 85,
    maxScore: 94,
    description: 'AI가 당황했습니다. 진짜 고수!',
    color: '#B9F2FF',
  },
  {
    name: 'AI를 마침내 이겼다',
    emoji: '🏆',
    minScore: 95,
    maxScore: 100,
    description: 'AI가 더 이상 현실적으로 반박할 수 없었습니다.',
    color: '#FF6B35',
  },
];

export function getTierByScore(score) {
  return TIERS.find((t) => score >= t.minScore && score <= t.maxScore) || TIERS[0];
}
