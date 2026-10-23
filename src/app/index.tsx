import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/Store/useStore';
import { ThemedText } from '../../src/Components/ThemedText';
import { ThemedView } from '../../src/Components/ThemedView';
import { useThemeColors } from '../../src/Hooks/useThemeColors';
import { ThemeToggleButton } from '../../src/Components/ThemeToggleButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);
  const colors = useThemeColors();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    const success = login(email.trim(), password);

    if (success) {
      router.replace('/events');
    } else {
      Alert.alert('Erreur', 'Mot de passe incorrect');
    }
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
          placeholder="Votre email"
          placeholderTextColor={colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={[styles.input, {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Mot de passe"
          placeholderTextColor={colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
        />

        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPassword}
        >
          <ThemedText variant="caption" color="primary">
            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <ThemedText variant="button" style={{ color: '#FFFFFF' }}>
            Se connecter
          </ThemedText>
        </TouchableOpacity>

        <ThemedText variant="caption" color="textLight" style={styles.hint}>
          Première connexion ? Un compte sera créé automatiquement.
        </ThemedText>
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
  showPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -10,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  hint: {
    textAlign: 'center',
    marginTop: 20,
  },
});