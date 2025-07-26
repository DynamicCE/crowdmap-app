import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { FAB } from 'react-native-elements';
import LocationService from '../services/LocationService';
import CategoryFilter from '../components/CategoryFilter';
import { MAPBOX_ACCESS_TOKEN } from '@env';

// Mapbox token from .env
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN || '');

export default function MapScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    zoom: 12
  });

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
      const coords = [location.coords.longitude, location.coords.latitude];
      setUserLocation(coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        zoom: 14
      });
    } catch (error) {
      Alert.alert('Hata', 'Konum alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
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

  const onRegionDidChange = async (feature) => {
    const { geometry, properties } = feature;
    if (geometry && geometry.coordinates) {
      setRegion({
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        zoom: properties.zoomLevel
      });
    }
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
      <MapboxGL.MapView 
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onRegionDidChange={onRegionDidChange}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <MapboxGL.Camera
          centerCoordinate={userLocation || [region.longitude, region.latitude]}
          zoomLevel={region.zoom}
          animationMode="flyTo"
          animationDuration={2000}
        />

        {userLocation && (
          <MapboxGL.UserLocation 
            visible={true}
            showsUserHeadingIndicator={true}
          />
        )}

        {locations.map((location) => (
          <MapboxGL.PointAnnotation
            key={location.id}
            id={location.id.toString()}
            coordinate={[location.longitude, location.latitude]}
            onSelected={() => handleMarkerPress(location)}
          >
            <View style={[
              styles.markerContainer,
              { backgroundColor: getCategoryColor(location.category?.id) }
            ]}>
              <View style={styles.marker} />
            </View>
            <MapboxGL.Callout title={location.title} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <FAB
        placement="right"
        color="#2196F3"
        icon={{ name: 'add', color: '#fff' }}
        onPress={() => navigation.navigate('AddLocation', { 
          currentLocation: {
            latitude: region.latitude,
            longitude: region.longitude
          }
        })}
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
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});