import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ResultScreen({ route, navigation }) {
  const { topic, result } = route.params;
  const { score, tier, comment } = result;
  const { colors } = useTheme();
  const s = styles(colors);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎤 AI 말싸움 챌린지 결과\n\n주제: "${topic}"\n점수: ${score}점\n티어: ${tier.emoji} ${tier.name}\n\n"${comment}"\n\n나도 도전해보기 👉 AI 말싸움 챌린지`,
      });
    } catch {
      // 공유 취소 무시
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.title}>결과 발표</Text>

        {/* 티어 배지 */}
        <View style={[s.tierBadge, { borderColor: tier.color }]}>
          <Text style={s.tierEmoji}>{tier.emoji}</Text>
          <Text style={[s.tierName, { color: tier.color }]}>{tier.name}</Text>
        </View>

        {/* 점수 */}
        <View style={s.scoreBox}>
          <Text style={s.scoreLabel}>최종 점수</Text>
          <Text style={s.scoreValue}>{score}</Text>
          <Text style={s.scoreMax}>/ 100</Text>
        </View>

        {/* AI 한줄평 */}
        <View style={s.commentBox}>
          <Text style={s.commentLabel}>AI의 한마디</Text>
          <Text style={s.commentText}>"{comment}"</Text>
        </View>

        <Text style={s.topicText}>주제: {topic}</Text>

        {/* 버튼들 */}
        <View style={s.buttonRow}>
          <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
            <Text style={s.shareBtnText}>📢 결과 공유</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.retryBtn} onPress={() => navigation.popToTop()}>
            <Text style={s.retryBtnText}>다시 도전</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: c.text, marginBottom: 8 },
  tierBadge: {
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: c.tierBadgeBg,
  },
  tierEmoji: { fontSize: 60 },
  tierName: { fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  scoreBox: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  scoreLabel: { color: c.subtext, fontSize: 16 },
  scoreValue: { color: c.scoreValue, fontSize: 52, fontWeight: 'bold' },
  scoreMax: { color: c.scoreMax, fontSize: 20 },
  commentBox: {
    backgroundColor: c.card,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: c.border,
  },
  commentLabel: { color: c.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  commentText: { color: c.text, fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
  topicText: { color: c.subtext, fontSize: 13 },
  buttonRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 8 },
  shareBtn: {
    flex: 1, backgroundColor: c.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  shareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  retryBtn: {
    flex: 1, backgroundColor: c.card, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: c.primary,
  },
  retryBtnText: { color: c.primary, fontWeight: 'bold', fontSize: 15 },
});
