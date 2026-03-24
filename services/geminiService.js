import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  REBUTTAL_SYSTEM_PROMPT,
  SCORE_SYSTEM_PROMPT,
  buildRebuttalPrompt,
  buildScorePrompt,
} from '../constants/prompts';
import { getTierByScore } from '../constants/tiers';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

function getModel(systemInstruction) {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
    generationConfig: {
      temperature: 0.9,
    },
  });
}

export async function getAIRebuttal(topic, userSide, aiSide, history, userArgument, category = '') {
  const model = getModel(REBUTTAL_SYSTEM_PROMPT);
  const prompt = buildRebuttalPrompt(topic, userSide, aiSide, history, userArgument, category);
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function getScoreAndTier(topic, userSide, aiSide, history, totalRounds = 5) {
  const model = getModel(SCORE_SYSTEM_PROMPT);
  const prompt = buildScorePrompt(topic, userSide, aiSide, history, totalRounds);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    // JSON 파싱 시도 (마크다운 코드블록 제거)
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const score = Math.min(100, Math.max(0, parseInt(parsed.score, 10)));
    const tier = getTierByScore(score);
    return { score, tier, comment: parsed.comment || '열심히 했습니다!' };
  } catch {
    // 파싱 실패시 기본값
    return {
      score: 30,
      tier: getTierByScore(30),
      comment: '다음엔 더 잘할 수 있을 거예요!',
    };
  }
}
