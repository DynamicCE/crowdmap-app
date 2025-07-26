import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text h3 style={styles.title}>Yeni Hesap Oluştur</Text>
        
        <Input
          placeholder="Kullanıcı Adı"
          leftIcon={{ type: 'material', name: 'person' }}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          containerStyle={styles.input}
        />
        
        <Input
          placeholder="E-posta"
          leftIcon={{ type: 'material', name: 'email' }}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          containerStyle={styles.input}
        />
        
        <Input
          placeholder="Şifre"
          leftIcon={{ type: 'material', name: 'lock' }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          containerStyle={styles.input}
        />
        
        <Input
          placeholder="Şifre Tekrar"
          leftIcon={{ type: 'material', name: 'lock' }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          containerStyle={styles.input}
        />
        
        <Button
          title="Kayıt Ol"
          loading={loading}
          onPress={handleRegister}
          buttonStyle={styles.registerButton}
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
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#2196F3',
  },
  input: {
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
  },
});