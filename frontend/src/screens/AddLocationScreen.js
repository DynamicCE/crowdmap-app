import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Input, Button, ListItem } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import LocationService from '../services/LocationService';
import CategoryService from '../services/CategoryService';

export default function AddLocationScreen({ navigation, route }) {
  const { currentLocation } = route.params || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(data[0].id.toString());
      }
    } catch (error) {
      Alert.alert('Hata', 'Kategoriler yüklenemedi');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !categoryId) {
      Alert.alert('Hata', 'Lütfen başlık ve kategori seçin');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Hata', 'Konum bilgisi bulunamadı');
      return;
    }

    setLoading(true);
    try {
      const locationData = {
        title,
        description,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        category: { id: parseInt(categoryId) },
      };

      await LocationService.createLocation(locationData);
      Alert.alert('Başarılı', 'Konum eklendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Konum eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text h4 style={styles.title}>Yeni Konum Ekle</Text>

        <Input
          placeholder="Başlık"
          value={title}
          onChangeText={setTitle}
          containerStyle={styles.input}
        />

        <Input
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          containerStyle={styles.input}
        />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={setCategoryId}
            style={styles.picker}
          >
            {categories.map((category) => (
              <Picker.Item
                key={category.id}
                label={`${category.icon} ${category.name}`}
                value={category.id.toString()}
              />
            ))}
          </Picker>
        </View>

        <ListItem onPress={pickImage} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Fotoğraf Ekle</ListItem.Title>
            <ListItem.Subtitle>{photos.length} fotoğraf seçildi</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Text style={styles.locationInfo}>
          Konum: {currentLocation?.latitude.toFixed(6)}, {currentLocation?.longitude.toFixed(6)}
        </Text>

        <Button
          title="Konum Ekle"
          loading={loading}
          onPress={handleSubmit}
          buttonStyle={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#86939e',
    marginBottom: 10,
    marginLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#86939e',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  locationInfo: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
  },
});