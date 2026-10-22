import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/Store/useStore';
import { AppEvent } from '../../src/Types';
import { ThemedText } from '../../src/Components/ThemedText';
import { ThemedView } from '../../src/Components/ThemedView';
import { useThemeColors } from '../../src/Hooks/useThemeColors';

export default function AddEventScreen() {
    const router = useRouter();
    const colors = useThemeColors();
    const addEvent = useStore((state) => state.addEvent);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

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
            Alert.alert(
                'Erreur de format',
                'La date est invalide.\nFormats acceptés :\n- Européen : 25/10/2026 14:00\n- ISO : 2026-10-25T14:00'
            );
            return;
        }

        const newEvent: AppEvent = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            date: validDateString,
            location: location.trim() || undefined,
        };

        addEvent(newEvent);
        Alert.alert('Succès', 'Événement ajouté avec succès !');
        router.back();
    };

    return (
        <ThemedView background="background" style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <ThemedText variant="h2" color="text">Nouvel Événement</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Titre de l'événement *</ThemedText>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                    placeholder="Ex: Atelier React Native"
                    placeholderTextColor={colors.textLight}
                    value={title}
                    onChangeText={setTitle}
                />

                <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Description *</ThemedText>
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                    placeholder="Détails de l'événement..."
                    placeholderTextColor={colors.textLight}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Date et heure *</ThemedText>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                    placeholder="Ex: 25/10/2026 14:00"
                    placeholderTextColor={colors.textLight}
                    value={date}
                    onChangeText={setDate}
                />
                <ThemedText variant="caption" color="textLight" style={styles.hint}>Format: JJ-MM-AAAATHH:MM</ThemedText>

                <ThemedText variant="bodySmall" color="textSecondary" style={styles.label}>Lieu (Optionnel)</ThemedText>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.text }]}
                    placeholder="Ex: Paris, France"
                    placeholderTextColor={colors.textLight}
                    value={location}
                    onChangeText={setLocation}
                />

                <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
                    <ThemedText variant="button" style={{ color: '#FFFFFF' }}>Créer l'événement</ThemedText>
                </TouchableOpacity>

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
    },
    backButton: { padding: 8 },
    scrollContent: { padding: 20 },
    label: { marginBottom: 8, marginTop: 16 },
    input: { padding: 14, borderRadius: 10, borderWidth: 1, fontSize: 16 },
    textArea: { height: 100 },
    hint: { marginTop: 4, marginBottom: 8 },
    saveButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32, marginBottom: 40 },
});