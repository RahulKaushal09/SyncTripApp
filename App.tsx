import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme,NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import LocationPermissionScreen from './src/screens/permissions/LocationPermissionScreen';
import { COLORS } from './src/constants';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showLocationScreen, setShowLocationScreen] = useState(false);
  const [LocationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [showProfileBuilding, setShowProfileBuilding] = useState(false);
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.backgroundLightApp, // 👈 your global background
  },
};
  useEffect(() => {
    const checkFlow = async () => {
      const permissionGiven = await AsyncStorage.getItem('locationPermission');
      const profileCompleted = await AsyncStorage.getItem('profileCompleted');

      if (!permissionGiven) {
        setShowLocationScreen(true);
      } else if (!profileCompleted) {
        setShowProfileBuilding(true);
      }
    };
    checkFlow();
  }, []);

  const handlePermissionGranted = async (location: any) => {
    await AsyncStorage.setItem('locationPermission', 'true');
    setShowLocationScreen(false);
    console.log('Location:', location);
    if(location != null) {
      setLocationPermissionGranted(true);
    }
    else {
      setLocationPermissionGranted(false);
    }
  };
  const handleProfileCompleted = async () => {
    await AsyncStorage.setItem('profileCompleted', 'true');
    setShowProfileBuilding(false);
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AuthProvider>
            <AuthContext.Consumer>
              {({ user }) => (
                <View style={styles.appBackground}>

                  <NavigationContainer theme={MyTheme}>
                    {user != null ? (showLocationScreen && !LocationPermissionGranted ? (
                      <LocationPermissionScreen onPermissionGranted={handlePermissionGranted} />
                    ) : (
                      <AppNavigator showProfileBuilding={showProfileBuilding} />
                    )) : (
                      <AuthNavigator />
                    )}
                  </NavigationContainer>

                </View>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>

  );
}
const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: COLORS.backgroundLightApp,
  },
});
export default App;
