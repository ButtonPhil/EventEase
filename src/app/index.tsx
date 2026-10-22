import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/Store/useStore';
import { User } from '../../src/Types';
import { ThemedText } from '../../src/Components/ThemedText';
import { ThemedView } from '../../src/Components/ThemedView';
import { useThemeColors } from '../../src/Hooks/useThemeColors';
import { ThemeToggleButton } from '../../src/Components/ThemeToggleButton';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const login = useStore((state) => state.login);
  const colors = useThemeColors();

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const stableId = 'user_' + email.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const mockUser: User = {
      id: stableId,
      name: name.trim(),
      email: email.trim(),
    };
    login(mockUser);
    router.replace('/events');
  };

  return (
    <ThemedView background="background" style={styles.container}>
      <ThemeToggleButton />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ThemedText variant="h1" color="primary" style={styles.title}>
          EventEase
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
          Connectez-vous pour gérer vos événements
        </ThemedText>

        <TextInput
          style={[styles.input, {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Votre nom"
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.input, {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Votre email"
          placeholderTextColor={colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <ThemedText variant="button" style={{ color: '#FFFFFF' }}>
            Se connecter
          </ThemedText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
});