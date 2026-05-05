import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WorkerLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#E67E22', headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Nhận Việc',
          tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Ví Tín Dụng',
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ekyc"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="job-detail"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
