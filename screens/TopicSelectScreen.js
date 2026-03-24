import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { CATEGORIES, TOPICS } from '../constants/topics';
import { useTheme } from '../context/ThemeContext';

const ROUND_OPTIONS = [3, 5, 8];

export default function TopicSelectScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedRounds, setSelectedRounds] = useState(5);
  const s = styles(colors);

  const handleTopicPress = (topic) => {
    setExpandedTopic(expandedTopic?.title === topic.title ? null : topic);
  };

  const handleSideSelect = (topic, sideIndex) => {
    const userSide = topic.sides[sideIndex];
    const aiSide = topic.sides[1 - sideIndex];
    navigation.navigate('Chat', { topic: topic.title, userSide, aiSide, totalRounds: selectedRounds, category: selectedCategory });
  };

  return (
    <SafeAreaView style={s.container}>
      {/* 헤더 */}
      <View style={s.headerRow}>
        <Text style={s.title}>AI 말싸움 챌린지</Text>
        <TouchableOpacity style={s.themeToggle} onPress={toggleTheme}>
          <Text style={s.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
          <Text style={s.themeToggleLabel}>{isDark ? '라이트' : '다크'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.subtitle}>주제를 골라서 AI와 싸워보세요!</Text>

      {/* 카테고리 탭 */}
      <View style={s.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[s.categoryTab, selectedCategory === cat && s.categoryTabActive]}
            onPress={() => { setSelectedCategory(cat); setExpandedTopic(null); }}
          >
            <Text style={[s.categoryText, selectedCategory === cat && s.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 억지주장 설명 */}
      {selectedCategory === '억지주장' && (
        <Text style={s.categoryDesc}>서로가 억지로 반박하는 주제입니다</Text>
      )}

      {/* 주제 목록 */}
      <ScrollView contentContainerStyle={s.topicList}>
        {TOPICS[selectedCategory].map((topic) => {
          const isExpanded = expandedTopic?.title === topic.title;
          return (
            <View key={topic.title}>
              <TouchableOpacity
                style={[s.topicButton, isExpanded && s.topicButtonExpanded]}
                onPress={() => handleTopicPress(topic)}
              >
                <Text style={s.sideA}>{topic.sides[0]}</Text>
                <Text style={s.vs}>VS</Text>
                <Text style={s.sideB}>{topic.sides[1]}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={s.sideSelectRow}>
                  <Text style={s.sideSelectLabel}>라운드 수</Text>
                  <View style={s.roundButtons}>
                    {ROUND_OPTIONS.map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={[s.roundBtn, selectedRounds === r && s.roundBtnActive]}
                        onPress={() => setSelectedRounds(r)}
                      >
                        <Text style={[s.roundBtnText, selectedRounds === r && s.roundBtnTextActive]}>
                          {r}라운드
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={[s.sideSelectLabel, { marginTop: 10 }]}>뭐가 맞아?</Text>
                  <View style={s.sideButtons}>
                    <TouchableOpacity style={[s.sideBtn, s.sideBtnA]} onPress={() => handleSideSelect(topic, 0)}>
                      <Text style={s.sideBtnText}>{topic.sides[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.sideBtn, s.sideBtnB]} onPress={() => handleSideSelect(topic, 1)}>
                      <Text style={s.sideBtnText}>{topic.sides[1]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: c.primary, flex: 1, textAlign: 'center' },
  themeToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 52,
  },
  themeToggleIcon: { fontSize: 18 },
  themeToggleLabel: { fontSize: 10, color: c.subtext, fontWeight: '600', marginTop: 1 },
  subtitle: { fontSize: 14, color: c.subtext, textAlign: 'center', marginBottom: 20 },
  categoryDesc: { fontSize: 12, color: c.subtext, textAlign: 'center', marginBottom: 10, paddingHorizontal: 16 },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  categoryTab: { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: c.tabInactive, alignItems: 'center' },
  categoryTabActive: { backgroundColor: c.tabActive },
  categoryText: { color: c.tabTextInactive, fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: c.tabTextActive },
  topicList: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  topicButton: {
    backgroundColor: c.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: c.border,
  },
  topicButtonExpanded: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomColor: 'transparent' },
  sideA: { color: c.sideAText, fontWeight: 'bold', fontSize: 14, flex: 1, textAlign: 'center' },
  vs: { color: c.vsText, fontWeight: 'bold', fontSize: 16, marginHorizontal: 8 },
  sideB: { color: c.sideBText, fontWeight: 'bold', fontSize: 14, flex: 1, textAlign: 'center' },
  sideSelectRow: {
    backgroundColor: c.expandedBg,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: c.border,
  },
  sideSelectLabel: { color: c.subtext, fontSize: 12, textAlign: 'center' },
  roundButtons: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center',
    backgroundColor: c.roundBtnInactive, borderWidth: 1, borderColor: c.border,
  },
  roundBtnActive: { backgroundColor: c.roundBtnActive, borderColor: c.roundBtnActive },
  roundBtnText: { color: c.roundBtnTextInactive, fontWeight: '600', fontSize: 14 },
  roundBtnTextActive: { color: c.roundBtnTextActive },
  sideButtons: { flexDirection: 'row', gap: 10 },
  sideBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  sideBtnA: { backgroundColor: c.sideA },
  sideBtnB: { backgroundColor: c.sideB },
  sideBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
