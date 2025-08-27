import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen: React.FC = () => {
    return (
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to SyncTrip</Text>
                <Text style={styles.subtitle}>Plan your perfect trip together</Text>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default HomeScreen;