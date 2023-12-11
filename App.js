import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen'
import ProfilScreen from './screens/ProfilScreen'
import HistoricalScreen from './screens/HistoricalScreen'
import SigninScreen from './screens/SigninScreen'
import SignupScreen from './screens/SignupScreen'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersPro from './reducers/usersPro'

const store = configureStore({
  reducer: {usersPro}
})


const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () =>{
  return (
    <Tab.Navigator screenOptions={({route})=>({
      tabBarIcon: ({color, size}) => {
        let iconName = '';
        if (route.name === 'Evènements'){
          iconName = 'home'
        } else if (route.name === 'Profil'){
          iconName = 'user'
        } else if (route.name === 'Historique'){
          iconName = 'history'
        }
        return <FontAwesome name={iconName} size={size} color={color}/>
      },
      tabBarActiveTintColor: '#8E44AE',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,

    })}>
      <Tab.Screen name='Profil' component={ProfilScreen}/>
      <Tab.Screen name='Evènements' component={HomeScreen}/>
      <Tab.Screen name='Historique' component={HistoricalScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Signup' component={SignupScreen}/>
        <Stack.Screen name='Signin' component={SigninScreen}/>
        <Stack.Screen name='TabNavigator' component={TabNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
