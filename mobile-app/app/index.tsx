import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (role === 'customer' || role === 'admin') {
    return <Redirect href="/(customer)/home" />;
  } else if (role === 'worker') {
    return <Redirect href="/(worker)/home" />;
  }

  return <Redirect href="/login" />;
}

