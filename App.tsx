import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigation from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import { paperTheme } from './src/theme';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style="dark" />
        <RootNavigation />
      </PaperProvider>
    </AuthProvider>
  );
}
