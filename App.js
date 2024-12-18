import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux';
import { store } from './app/store/store';
import LoginScreen from './app/components/LoginScreen';
import RegisterScreen from './app/components/RegisterScreen';
import HomeScreen from './app/components/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const token = useSelector((state) => state.auth.token);
  return (
    <Stack.Navigator>
      {token ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
