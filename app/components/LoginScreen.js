import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => dispatch(loginUser({ email, password }))}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20, // Adds space between the buttons
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#4CAF50', // Green color for login
  },
  registerButton: {
    backgroundColor: '#2196F3', // Blue color for register
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  loadingText: {
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});
