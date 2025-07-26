import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-elements';
import CategoryService from '../services/CategoryService';

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip
          title="Tümü"
          selected={!selectedCategory}
          onPress={() => onCategoryChange(null)}
          selectedColor="#2196F3"
          buttonStyle={[
            styles.chip,
            !selectedCategory && styles.selectedChip
          ]}
          titleStyle={!selectedCategory && styles.selectedTitle}
        />
        
        {categories.map((category) => (
          <Chip
            key={category.id}
            title={`${category.icon} ${category.name}`}
            selected={selectedCategory === category.id}
            onPress={() => onCategoryChange(category.id)}
            selectedColor="#2196F3"
            buttonStyle={[
              styles.chip,
              selectedCategory === category.id && styles.selectedChip
            ]}
            titleStyle={selectedCategory === category.id && styles.selectedTitle}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 10,
  },
  chip: {
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  selectedTitle: {
    color: 'white',
  },
});