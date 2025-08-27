import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import * as Location from 'react-native-location'; // or react-native-location
import LoginShortHeaderBlock from '../../components/headerBlocks/LoginShortHeaderBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants';


const LocationPermissionScreen = ({ onPermissionGranted }: any) => {

    const requestLocation = async () => {
        const status = await Location.requestPermission({
            ios: 'whenInUse',
            android: { detail: 'fine' }
        });

        if (status === true) {
            const location = await Location.getLatestLocation({ timeout: 100 });
            onPermissionGranted(location);
        } else {
            // User denied, you can store 'false' if needed
            await AsyncStorage.setItem('locationPermission', 'false');
        }
    };
    const handleSkip = async () => {
        await AsyncStorage.setItem('locationPermission', 'skipped');
        onPermissionGranted(null); // or handle skip differently
    };

    return (

        <View style={styles.container}>
            <LoginShortHeaderBlock showSkip={true} handleSkip={handleSkip} />
            <View style={{ height: 'auto', position: "relative",marginTop: 50 }}>
                <Image
                    source={require('../../assets/images/LocationPermissionMapImg.png')}
                />
                <Text style={styles.title}>What Is Your Location?</Text>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>

                <Text style={styles.subtitle}>
                    We need to know your location to suggest nearby services
                </Text>
            </View>
            <View style={{ position: "absolute", bottom: 50, left: 0, right: 0, paddingHorizontal: 20 }}>

                <Pressable style={styles.button} onPress={requestLocation}>
                    <Text style={styles.buttonText}>Allow Location Access</Text>
                </Pressable>
                {/* <Pressable style={styles.link}>
                    <Text style={styles.linkText}>Set Location</Text>
                </Pressable> */}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, },
    title: { fontSize: 22, color: COLORS.base.black, fontWeight: 'bold', marginBottom: 10, position: "absolute", bottom: 0, alignSelf: 'center' },
    subtitle: { textAlign: 'center', color: COLORS.secondary[1], paddingHorizontal: "10%" },
    button: { backgroundColor: COLORS.primary[1], padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', height: 50 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50 },
    linkText: { color: COLORS.primary[1] },
});

export default LocationPermissionScreen;
