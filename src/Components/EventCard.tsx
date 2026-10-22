import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image as RNImage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppEvent } from '../Types';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColors } from '../Hooks/useThemeColors';
import { useStore } from '../Store/useStore';
import { getWeatherByCity, getWeatherIconUrl, WeatherData } from '../Utile/weather';

interface EventCardProps {
  event: AppEvent;
}

export function EventCard({ event }: EventCardProps) {
  const colors = useThemeColors();
  const toggleParticipation = useStore((state) => state.toggleParticipation);
  const deleteEvent = useStore((state) => state.deleteEvent);
  const currentUser = useStore((state) => state.currentUser);
  const participations = useStore((state) => state.participations);
  const isUserParticipating = currentUser
    ? (participations[currentUser.id] || []).includes(event.id)
    : false;
  const router = useRouter();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    if (event.location) {
      setLoadingWeather(true);
      getWeatherByCity(event.location).then((data) => {
        setWeather(data);
        setLoadingWeather(false);
      });
    }
  }, [event.location]);

  const handleDelete = () => {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cet événement ?');
    if (confirmed && event.id) {
      deleteEvent(event.id);
      router.replace('/events');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date non reconnue";
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <ThemedView background="cardBackground" style={styles.card}>
      <View style={styles.header}>
        <ThemedText variant="h3" color="text" style={styles.title}>
          {event.title}
        </ThemedText>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/Event/[id]', params: { id: event.id } })}
            style={styles.iconButton}
          >
            <Ionicons name="pencil-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText variant="bodySmall" color="textSecondary" style={styles.description}>
        {event.description}
      </ThemedText>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.primary} />
        <ThemedText variant="bodySmall" color="text" style={styles.infoText}>
          {formatDate(event.date)}
        </ThemedText>
      </View>

      {event.location && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <ThemedText variant="bodySmall" color="text" style={styles.infoText}>
            {event.location}
          </ThemedText>
        </View>
      )}

      {event.location && (
        <View style={styles.weatherContainer}>
          {loadingWeather ? (
            <ThemedText variant="caption" color="textLight">Chargement météo...</ThemedText>
          ) : weather ? (
            <>
              <RNImage
                source={{ uri: getWeatherIconUrl(weather.icon) }}
                style={styles.weatherIcon}
              />
              <View style={styles.weatherInfo}>
                <ThemedText variant="bodySmall" color="text" style={styles.temperature}>
                  {weather.temperature}°C
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  {weather.description}
                </ThemedText>
              </View>
              <View style={styles.weatherDetails}>
                <ThemedText variant="caption" color="textLight">
                  💧 {weather.humidity}%
                </ThemedText>
                <ThemedText variant="caption" color="textLight">
                  💨 {weather.wind} km/h
                </ThemedText>
              </View>
            </>
          ) : (
            <ThemedText variant="caption" color="textLight">
              Météo non disponible
            </ThemedText>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.participateButton,
          { backgroundColor: isUserParticipating ? colors.success : colors.cardBackground, borderColor: colors.border }
        ]}
        onPress={() => toggleParticipation(event.id)}
      >
        <Ionicons
          name={isUserParticipating ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={isUserParticipating ? "#FFFFFF" : colors.primary}
        />
        <ThemedText
          variant="button"
          style={{ color: isUserParticipating ? "#FFFFFF" : colors.primary, marginLeft: 8 }}
        >
          {isUserParticipating ? 'Participe' : 'Je participe'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

// ... (garde les mêmes styles qu'avant)

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
  },
  participateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherInfo: {
    flex: 1,
    marginLeft: 8,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherDetails: {
    alignItems: 'flex-end',
  },
});