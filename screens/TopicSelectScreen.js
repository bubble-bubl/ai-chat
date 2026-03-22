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

const ROUND_OPTIONS = [3, 5, 8];

export default function TopicSelectScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedRounds, setSelectedRounds] = useState(5);

  const handleTopicPress = (topic) => {
    setExpandedTopic(expandedTopic?.title === topic.title ? null : topic);
  };

  const handleSideSelect = (topic, sideIndex) => {
    const userSide = topic.sides[sideIndex];
    const aiSide = topic.sides[1 - sideIndex];
    navigation.navigate('Chat', { topic: topic.title, userSide, aiSide, totalRounds: selectedRounds });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AI 말싸움 챌린지</Text>
      <Text style={styles.subtitle}>주제를 골라서 AI와 싸워보세요!</Text>

      {/* 카테고리 탭 */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryTab, selectedCategory === cat && styles.categoryTabActive]}
            onPress={() => { setSelectedCategory(cat); setExpandedTopic(null); }}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 주제 목록 */}
      <ScrollView contentContainerStyle={styles.topicList}>
        {TOPICS[selectedCategory].map((topic) => {
          const isExpanded = expandedTopic?.title === topic.title;
          return (
            <View key={topic.title}>
              {/* 주제 버튼 */}
              <TouchableOpacity
                style={[styles.topicButton, isExpanded && styles.topicButtonExpanded]}
                onPress={() => handleTopicPress(topic)}
              >
                <Text style={styles.sideA}>{topic.sides[0]}</Text>
                <Text style={styles.vs}>VS</Text>
                <Text style={styles.sideB}>{topic.sides[1]}</Text>
              </TouchableOpacity>

              {/* 펼쳐지는 편 선택 */}
              {isExpanded && (
                <View style={styles.sideSelectRow}>
                  {/* 라운드 선택 */}
                  <Text style={styles.sideSelectLabel}>라운드 수</Text>
                  <View style={styles.roundButtons}>
                    {ROUND_OPTIONS.map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.roundBtn, selectedRounds === r && styles.roundBtnActive]}
                        onPress={() => setSelectedRounds(r)}
                      >
                        <Text style={[styles.roundBtnText, selectedRounds === r && styles.roundBtnTextActive]}>
                          {r}라운드
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 편 선택 */}
                  <Text style={[styles.sideSelectLabel, { marginTop: 10 }]}>뭐가 맞아?</Text>
                  <View style={styles.sideButtons}>
                    <TouchableOpacity
                      style={[styles.sideBtn, styles.sideBtnA]}
                      onPress={() => handleSideSelect(topic, 0)}
                    >
                      <Text style={styles.sideBtnText}>{topic.sides[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sideBtn, styles.sideBtnB]}
                      onPress={() => handleSideSelect(topic, 1)}
                    >
                      <Text style={styles.sideBtnText}>{topic.sides[1]}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 20 },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  categoryTabActive: { backgroundColor: '#e94560' },
  categoryText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: '#fff' },
  topicList: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  topicButton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  topicButtonExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  sideA: { color: '#64b5f6', fontWeight: 'bold', fontSize: 14, flex: 1, textAlign: 'center' },
  vs: { color: '#e94560', fontWeight: 'bold', fontSize: 16, marginHorizontal: 8 },
  sideB: { color: '#ef9a9a', fontWeight: 'bold', fontSize: 14, flex: 1, textAlign: 'center' },
  sideSelectRow: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#0f3460',
  },
  sideSelectLabel: { color: '#aaa', fontSize: 12, textAlign: 'center' },
  roundButtons: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333',
  },
  roundBtnActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  roundBtnText: { color: '#aaa', fontWeight: '600', fontSize: 14 },
  roundBtnTextActive: { color: '#fff' },
  sideButtons: { flexDirection: 'row', gap: 10 },
  sideBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  sideBtnA: { backgroundColor: '#1565c0' },
  sideBtnB: { backgroundColor: '#b71c1c' },
  sideBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
