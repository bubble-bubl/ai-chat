export const TIERS = [
  {
    name: '브론즈',
    emoji: '🥉',
    minScore: 0,
    maxScore: 39,
    description: 'AI에게 완패했습니다...',
    color: '#CD7F32',
  },
  {
    name: '실버',
    emoji: '🥈',
    minScore: 40,
    maxScore: 59,
    description: '나쁘지 않지만 AI가 더 강했네요.',
    color: '#C0C0C0',
  },
  {
    name: '골드',
    emoji: '🥇',
    minScore: 60,
    maxScore: 79,
    description: '꽤 괜찮은 실력이에요!',
    color: '#FFD700',
  },
  {
    name: '플래티넘',
    emoji: '💎',
    minScore: 80,
    maxScore: 94,
    description: '대단해요! AI가 당황했습니다.',
    color: '#E5E4E2',
  },
  {
    name: '전설',
    emoji: '👑',
    minScore: 95,
    maxScore: 100,
    description: 'AI를 이겼습니다! 진짜 말싸움 고수!',
    color: '#FF6B35',
  },
];

export function getTierByScore(score) {
  return TIERS.find((t) => score >= t.minScore && score <= t.maxScore) || TIERS[0];
}
