import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import TopicSelectScreen from './screens/TopicSelectScreen';
import ChatScreen from './screens/ChatScreen';
import ResultScreen from './screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="TopicSelect" component={TopicSelectScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
