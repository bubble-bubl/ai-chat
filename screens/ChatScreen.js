import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getAIRebuttal, getScoreAndTier } from '../services/geminiService';

export default function ChatScreen({ route, navigation }) {
  const { topic, userSide, aiSide, totalRounds = 5 } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const scrollRef = useRef(null);
  // history: 번갈아가며 [사용자, AI, 사용자, AI, ...]
  const historyRef = useRef([]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || loading || gameOver) return;

    setInputText('');
    const userMsg = { role: 'user', text, round };
    setMessages((prev) => [...prev, userMsg]);
    historyRef.current.push(text);

    setLoading(true);
    try {
      const aiText = await getAIRebuttal(topic, userSide, aiSide, historyRef.current.slice(0, -1), text);
      historyRef.current.push(aiText);
      const aiMsg = { role: 'ai', text: aiText, round };
      setMessages((prev) => [...prev, aiMsg]);

      if (round >= totalRounds) {
        setGameOver(true);
        // 잠깐 딜레이 후 결과 화면으로
        setTimeout(async () => {
          setLoading(true);
          try {
            const result = await getScoreAndTier(topic, userSide, aiSide, historyRef.current);
            navigation.replace('Result', { topic, result });
          } catch {
            navigation.replace('Result', {
              topic,
              result: { score: 30, tier: { name: '브론즈', emoji: '🥉', color: '#CD7F32' }, comment: '채점 중 오류가 발생했어요.' },
            });
          } finally {
            setLoading(false);
          }
        }, 1000);
      } else {
        setRound((r) => r + 1);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '(오류가 발생했습니다. 다시 시도해주세요.)', round },
      ]);
      historyRef.current.pop(); // 실패한 유저 메시지 제거
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← 나가기</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.topicLabel} numberOfLines={1}>{topic}</Text>
          <Text style={styles.sideLabel}>나: {userSide} vs AI: {aiSide}</Text>
          <Text style={styles.roundLabel}>
            {gameOver ? '⚔️ 종료' : `⚔️ ${round} / ${totalRounds} 라운드`}
          </Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* 채팅 영역 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
        >
          {/* 시작 안내 */}
          {messages.length === 0 && (
            <View style={styles.startHint}>
              <Text style={styles.startHintText}>
                AI가 반대편을 맡습니다.{'\n'}첫 번째 주장을 입력하세요!
              </Text>
            </View>
          )}

          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubbleWrap,
                msg.role === 'user' ? styles.userWrap : styles.aiWrap,
              ]}
            >
              {msg.role === 'ai' && <Text style={styles.aiLabel}>AI</Text>}
              <View
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
              {msg.role === 'user' && <Text style={styles.userLabel}>나</Text>}
            </View>
          ))}

          {loading && (
            <View style={styles.aiWrap}>
              <Text style={styles.aiLabel}>AI</Text>
              <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                <ActivityIndicator color="#e94560" size="small" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* 입력창 */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={gameOver ? '게임 종료!' : `라운드 ${round} 주장을 입력하세요`}
            placeholderTextColor="#666"
            multiline
            editable={!loading && !gameOver}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (loading || !inputText.trim() || gameOver) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={loading || !inputText.trim() || gameOver}
          >
            <Text style={styles.sendText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  backBtn: { width: 60 },
  backText: { color: '#e94560', fontSize: 14 },
  headerCenter: { flex: 1, alignItems: 'center' },
  topicLabel: { color: '#fff', fontWeight: 'bold', fontSize: 14, maxWidth: 200 },
  sideLabel: { color: '#aaa', fontSize: 11, marginTop: 1 },
  roundLabel: { color: '#e94560', fontSize: 12, marginTop: 2 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  startHint: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  startHintText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  messageBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  userWrap: { justifyContent: 'flex-end' },
  aiWrap: { justifyContent: 'flex-start' },
  aiLabel: { color: '#e94560', fontSize: 11, marginBottom: 4 },
  userLabel: { color: '#aaa', fontSize: 11, marginBottom: 4 },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#e94560',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  loadingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  bubbleText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
    backgroundColor: '#1a1a2e',
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sendBtn: {
    backgroundColor: '#e94560',
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#555' },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
