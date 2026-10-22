// src/app/Event/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../../src/Store/useStore';
import { ThemedText } from '../../../src/Components/ThemedText';
import { ThemedView } from '../../../src/Components/ThemedView';
import { useThemeColors } from '../../../src/Hooks/useThemeColors';

export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const colors = useThemeColors();
  const event = useStore((state) => state.events.find((e) => e.id === id));
  const updateEvent = useStore((state) => state.updateEvent);
  const deleteEvent = useStore((state) => state.deleteEvent);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 ID récupéré:', id);
    console.log('📋 Événement trouvé:', event);
    
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      
      const date = new Date(event.date);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      
      setDate(formattedDate);
      setLocation(event.location || '');
      setIsLoading(false);
    } else {
      Alert.alert('Erreur', 'Événement introuvable.');
      router.replace('/events');
    }
  }, [event, id]);

  const handleSave = () => {
    if (!title.trim() || !description.trim() || !date.trim()) {
      Alert.alert('Erreur', 'Le titre, la description et la date sont obligatoires.');
      return;
    }

    const parseEuropeanDate = (input: string): string | null => {
      if (!isNaN(new Date(input).getTime())) {
        return new Date(input).toISOString();
      }
      const parts = input.trim().split(/\s+/);
      if (parts.length >= 1) {
        const dateParts = parts[0].split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          const time = parts[1] ? parts[1].padStart(5, '0') : '00:00';
          const isoString = `${year}-${month}-${day}T${time}`;
          if (!isNaN(new Date(isoString).getTime())) {
            return new Date(isoString).toISOString();
          }
        }
      }
      return null;
    };

    const validDateString = parseEuropeanDate(date);

    if (!validDateString) {
      Alert.alert('Erreur de format', 'La date est invalide.\nFormats acceptés :\n- Européen : 25/10/2026 14:00\n- ISO : 2026-10-25T14:00');
      return;
    }

    if (id) {
      updateEvent(id, {
        title: title.trim(),
        description: description.trim(),
        date: validDateString,
        location: location.trim() || undefined,
      });
      Alert.alert('Succès', 'Événement modifié avec succès !');
      router.replace('/events');
    }
  };

   const handleDelete = () => {
    console.log('🗑️ Tentative de suppression, ID:', id);
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cet événement ?');
    
    if (confirmed) {
      console.log('✅ Suppression confirmée pour ID:', id); 
      if (id) {
        deleteEvent(id);
        router.replace('/events');
      } else {
        console.error(' ID manquant !');
      }
    } else {
      console.log('❌ Suppression annulée par l\'utilisateur');
    }
  };

  if (isLoading) {
    return (
      <ThemedView background="background" style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView background="background" style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <ThemedText variant="h2" color="text">Modifier</ThemedText>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Titre *</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.textLight}
        />

        <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Description *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={colors.textLight}
        />

        <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Date et heure *</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
          value={date}
          onChangeText={setDate}
          placeholderTextColor={colors.textLight}
        />

        <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Lieu (Optionnel)</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
          value={location}
          onChangeText={setLocation}
          placeholderTextColor={colors.textLight}
        />

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <ThemedText variant="button" style={{ color: '#FFFFFF' }}>Enregistrer les modifications</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: { padding: 8 },
  deleteButton: { padding: 8 },
  scrollContent: { padding: 20 },
  label: { marginBottom: 8, marginTop: 16 },
  input: { padding: 14, borderRadius: 10, borderWidth: 1, fontSize: 16 },
  textArea: { height: 100 },
  saveButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32, marginBottom: 40 },
});