// src/app/events.tsx
import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/Store/useStore';
import { ThemedText } from '../../src/Components/ThemedText';
import { ThemedView } from '../../src/Components/ThemedView';
import { useThemeColors } from '../../src/Hooks/useThemeColors';
import { EventCard } from '../../src/Components/EventCard';
import { ThemeToggleButton } from '../../src/Components/ThemeToggleButton';

export default function EventsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const events = useStore((state) => state.events);
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);

  useFocusEffect(
    React.useCallback(() => {
      if (!currentUser) {
        router.replace('/');
      }
    }, [currentUser, router])
  );

  const handleLogout = () => {
    const confirmed = window.confirm('Voulez-vous vraiment vous déconnecter ?');
    if (confirmed) {
      logout();
      router.replace('/');
    }
  };
  if (!currentUser) return null;
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return (
    <ThemedView background="background" style={styles.container}>
      {/* ✅ Header avec les deux boutons côte à côte */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText variant="h2" color="text">
            Bonjour, {currentUser.name.split(' ')[0]} 👋
          </ThemedText>
          <ThemedText variant="body" color="textSecondary">
            {events.length} événement(s) à venir
          </ThemedText>
        </View>
        
        <View style={styles.headerButtons}>
          <ThemeToggleButton />
          <TouchableOpacity 
            onPress={handleLogout} 
            style={[styles.logoutButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {sortedEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
          <ThemedText variant="h3" color="textSecondary" style={{ marginTop: 16 }}>
            Aucun événement pour le moment
          </ThemedText>
          <ThemedText variant="body" color="textLight" style={{ marginTop: 8, textAlign: 'center' }}>
            Appuyez sur le bouton + pour en créer un !
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={sortedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-event')}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});