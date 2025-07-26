import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FAB } from 'react-native-elements';
import LocationService from '../services/LocationService';
import CategoryFilter from '../components/CategoryFilter';

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    loadLocations();
  }, []);

  useEffect(() => {
    loadLocations();
  }, [selectedCategory, region]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Hata', 'Konum izni gerekiyor');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      Alert.alert('Hata', 'Konum alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    if (!region) return;

    try {
      const params = {
        lat: region.latitude,
        lng: region.longitude,
        radius: 10,
        category: selectedCategory,
      };
      const data = await LocationService.getNearbyLocations(params);
      setLocations(data);
    } catch (error) {
      console.error('Konumlar yüklenemedi:', error);
    }
  };

  const handleMarkerPress = (location) => {
    navigation.navigate('LocationDetail', { locationId: location.id });
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      1: '#4CAF50', // Tuvalet
      2: '#2196F3', // ATM
      3: '#FF9800', // Otopark
      4: '#9C27B0', // WiFi
      5: '#F44336', // Şarj
      6: '#00BCD4', // Güvenli Alan
      7: '#FFEB3B', // Fotoğraf
      8: '#F44336', // Tehlikeli
    };
    return colors[categoryId] || '#757575';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            description={location.description}
            pinColor={getCategoryColor(location.category?.id)}
            onPress={() => handleMarkerPress(location)}
          />
        ))}
      </MapView>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <FAB
        placement="right"
        color="#2196F3"
        icon={{ name: 'add', color: '#fff' }}
        onPress={() => navigation.navigate('AddLocation', { currentLocation: region })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});