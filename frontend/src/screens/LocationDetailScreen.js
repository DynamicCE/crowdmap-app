import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Input, Rating, Divider } from 'react-native-elements';
import LocationService from '../services/LocationService';
import CommentService from '../services/CommentService';
import CommentList from '../components/CommentList';

export default function LocationDetailScreen({ route, navigation }) {
  const { locationId } = route.params;
  const [location, setLocation] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationDetails();
  }, []);

  const loadLocationDetails = async () => {
    try {
      const [locationData, commentsData] = await Promise.all([
        LocationService.getLocationById(locationId),
        CommentService.getLocationComments(locationId)
      ]);
      setLocation(locationData);
      setComments(commentsData);
    } catch (error) {
      Alert.alert('Hata', 'Konum detayları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Hata', 'Lütfen bir yorum yazın');
      return;
    }

    try {
      const comment = await CommentService.addComment(locationId, {
        text: newComment,
        rating: rating,
      });
      setComments([comment, ...comments]);
      setNewComment('');
      setRating(3);
      Alert.alert('Başarılı', 'Yorumunuz eklendi');
    } catch (error) {
      Alert.alert('Hata', 'Yorum eklenemedi');
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title h4>{location.title}</Card.Title>
        <Card.Divider />
        
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>
            {location.category?.icon} {location.category?.name}
          </Text>
        </View>

        {location.description && (
          <Text style={styles.description}>{location.description}</Text>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Ekleyen: {location.user?.username}
          </Text>
          <Text style={styles.infoText}>
            Tarih: {new Date(location.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>

        <Button
          title="Haritada Göster"
          type="outline"
          onPress={() => navigation.navigate('Map', { 
            focusLocation: {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          })}
        />
      </Card>

      <Card>
        <Card.Title>Yorum Ekle</Card.Title>
        <Card.Divider />
        
        <Rating
          showRating
          onFinishRating={setRating}
          startingValue={rating}
          style={styles.rating}
        />
        
        <Input
          placeholder="Yorumunuzu yazın..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={3}
        />
        
        <Button
          title="Yorum Gönder"
          onPress={handleAddComment}
          buttonStyle={styles.commentButton}
        />
      </Card>

      <Card>
        <Card.Title>Yorumlar ({comments.length})</Card.Title>
        <Card.Divider />
        <CommentList comments={comments} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: '#2196F3',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  infoContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  rating: {
    paddingVertical: 10,
  },
  commentButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    marginTop: 10,
  },
});