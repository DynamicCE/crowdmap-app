import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Input, Button, Image } from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text h2 style={styles.title}>CrowdMap</Text>
        <Text style={styles.subtitle}>Haritada yerini işaretle</Text>
        
        <Input
          placeholder="Kullanıcı Adı"
          leftIcon={{ type: 'material', name: 'person' }}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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
        
        <Button
          title="Giriş Yap"
          loading={loading}
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
        />
        
        <Button
          title="Hesabın yok mu? Kayıt Ol"
          type="clear"
          onPress={() => navigation.navigate('Register')}
          titleStyle={styles.registerLink}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
  },
  registerLink: {
    color: '#2196F3',
    marginTop: 20,
  },
});