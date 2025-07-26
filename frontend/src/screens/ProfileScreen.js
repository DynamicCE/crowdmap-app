import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Avatar, ListItem, Badge } from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';
import LocationService from '../services/LocationService';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [userLocations, setUserLocations] = useState([]);
  const [stats, setStats] = useState({
    locations: 0,
    comments: 0,
    photos: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const locations = await LocationService.getUserLocations(user.id);
      setUserLocations(locations);
      setStats({
        locations: locations.length,
        comments: 0, // TODO: API'den çek
        photos: 0, // TODO: API'den çek
      });
    } catch (error) {
      console.error('Kullanıcı verileri yüklenemedi:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış', onPress: logout, style: 'destructive' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.profileHeader}>
          <Avatar
            size="xlarge"
            rounded
            title={user.username[0].toUpperCase()}
            containerStyle={styles.avatar}
          />
          <Text h4>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.locations}</Text>
            <Text style={styles.statLabel}>Konum</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.comments}</Text>
            <Text style={styles.statLabel}>Yorum</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.photos}</Text>
            <Text style={styles.statLabel}>Fotoğraf</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Card.Title>Eklediğim Konumlar</Card.Title>
        <Card.Divider />
        {userLocations.length === 0 ? (
          <Text style={styles.emptyText}>Henüz konum eklememişsiniz</Text>
        ) : (
          userLocations.slice(0, 5).map((location) => (
            <ListItem 
              key={location.id} 
              bottomDivider
              onPress={() => navigation.navigate('LocationDetail', { locationId: location.id })}
            >
              <ListItem.Content>
                <ListItem.Title>{location.title}</ListItem.Title>
                <ListItem.Subtitle>
                  {location.category?.icon} {location.category?.name}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))
        )}
      </Card>

      <Card>
        <ListItem onPress={() => navigation.navigate('EditProfile')}>
          <ListItem.Content>
            <ListItem.Title>Profili Düzenle</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem onPress={() => navigation.navigate('Settings')}>
          <ListItem.Content>
            <ListItem.Title>Ayarlar</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem onPress={() => navigation.navigate('About')}>
          <ListItem.Content>
            <ListItem.Title>Hakkında</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>

      <Button
        title="Çıkış Yap"
        buttonStyle={styles.logoutButton}
        titleStyle={styles.logoutText}
        onPress={handleLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#2196F3',
    marginBottom: 10,
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 25,
  },
  logoutText: {
    fontSize: 16,
  },
});