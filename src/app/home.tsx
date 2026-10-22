import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useStore } from '../../src/Store/useStore';

// Importation de notre système de thème
import { ThemedText } from '../../src/Components/ThemedText';
import { ThemedView } from '../../src/Components/ThemedView';
import { useThemeColors } from '../../src/Hooks/useThemeColors';
import { ThemeToggleButton } from '../../src/Components/ThemeToggleButton';

export default function HomeScreen() {
  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const colors = useThemeColors();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (!currentUser) {
    router.replace('/');
    return null;
  }

  return (
    <ThemedView background="background" style={styles.container}>

      <ThemedView background="cardBackground" style={styles.card}>
        <ThemeToggleButton />
        <ThemedView background="cardBackground" style={styles.card}></ThemedView>
        <ThemedText variant="h2" color="text">
          Bonjour, {currentUser.name} ! 👋
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.email}>
          {currentUser.email}
        </ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <ThemedText variant="button" style={{ color: '#FFFFFF' }}>
          Se déconnecter
        </ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    // Petite ombre pour le style
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  email: {
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
});
