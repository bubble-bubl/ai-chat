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
import { useTheme } from '../context/ThemeContext';

export default function ChatScreen({ route, navigation }) {
  const { topic, userSide, aiSide, totalRounds = 5, category = '' } = route.params;
  const { colors } = useTheme();
  const s = styles(colors);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const scrollRef = useRef(null);
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
      const aiText = await getAIRebuttal(topic, userSide, aiSide, historyRef.current.slice(0, -1), text, category);
      historyRef.current.push(aiText);
      const aiMsg = { role: 'ai', text: aiText, round };
      setMessages((prev) => [...prev, aiMsg]);

      if (round >= totalRounds) {
        setGameOver(true);
        setTimeout(async () => {
          setLoading(true);
          try {
            const result = await getScoreAndTier(topic, userSide, aiSide, historyRef.current, totalRounds);
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
      historyRef.current.pop();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← 나가기</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.topicLabel} numberOfLines={1}>{topic}</Text>
          <Text style={s.sideLabel}>나: {userSide} vs AI: {aiSide}</Text>
          <Text style={s.roundLabel}>
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
          style={s.chatArea}
          contentContainerStyle={s.chatContent}
        >
          {messages.length === 0 && (
            <View style={s.startHint}>
              <Text style={s.startHintText}>
                AI가 반대편을 맡습니다.{'\n'}첫 번째 주장을 입력하세요!
              </Text>
            </View>
          )}

          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[s.messageBubbleWrap, msg.role === 'user' ? s.userWrap : s.aiWrap]}
            >
              {msg.role === 'ai' && (
                <View style={s.aiAvatar}>
                  <Text style={s.aiAvatarEmoji}>🤖</Text>
                </View>
              )}
              <View style={[s.bubble, msg.role === 'user' ? s.userBubble : s.aiBubble]}>
                <Text style={msg.role === 'user' ? s.userBubbleText : s.aiBubbleText}>
                  {msg.text}
                </Text>
              </View>
              {msg.role === 'user' && <Text style={s.userLabel}>나</Text>}
            </View>
          ))}

          {loading && (
            <View style={s.aiWrap}>
              <View style={s.aiAvatar}>
                <Text style={s.aiAvatarEmoji}>🤖</Text>
              </View>
              <View style={[s.bubble, s.aiBubble, s.loadingBubble]}>
                <ActivityIndicator color="#e94560" size="small" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* 입력창 */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={gameOver ? '게임 종료!' : `라운드 ${round} 주장을 입력하세요`}
            placeholderTextColor={colors.subtext}
            multiline
            editable={!loading && !gameOver}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[s.sendBtn, (loading || !inputText.trim() || gameOver) && s.sendBtnDisabled]}
            onPress={handleSend}
            disabled={loading || !inputText.trim() || gameOver}
          >
            <Text style={s.sendText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    backgroundColor: c.card,
  },
  backBtn: { width: 60 },
  backText: { color: c.primary, fontSize: 14 },
  headerCenter: { flex: 1, alignItems: 'center' },
  topicLabel: { color: c.text, fontWeight: 'bold', fontSize: 14, maxWidth: 200 },
  sideLabel: { color: c.subtext, fontSize: 11, marginTop: 1 },
  roundLabel: { color: c.primary, fontSize: 12, marginTop: 2 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  startHint: { alignItems: 'center', paddingVertical: 20 },
  startHintText: { color: c.hintText, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  messageBubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  userWrap: { justifyContent: 'flex-end' },
  aiWrap: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: c.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  aiAvatarEmoji: { fontSize: 18 },
  userLabel: { color: c.subtext, fontSize: 11, marginBottom: 4 },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  userBubble: { backgroundColor: c.userBubble, borderBottomRightRadius: 4 },
  aiBubble: {
    backgroundColor: c.aiBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  loadingBubble: { paddingVertical: 14, paddingHorizontal: 20 },
  userBubbleText: { color: c.userBubbleText, fontSize: 15, lineHeight: 22 },
  aiBubbleText: { color: c.aiBubbleText, fontSize: 15, lineHeight: 22 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: c.border,
    backgroundColor: c.card,
  },
  input: {
    flex: 1,
    backgroundColor: c.inputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: c.inputText,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: c.border,
  },
  sendBtn: {
    backgroundColor: c.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: c.border },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
