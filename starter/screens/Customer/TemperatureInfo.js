import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../../components/Themed';
import db from '../../../db'

// all picker values should be non-object (number, string, etc.)

export default function TemperatureInfo({ user, category, sensor }) {

    const [reading, setReading] = useState(null)
    useEffect(() => sensor ? db.Sensors.Readings.listenLatestOne(setReading, sensor.id) : undefined, [sensor])

    return (
        <View>
            <Text
                style={styles.getStartedText}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)"
            >
                Max: {sensor.max}
            </Text>
            <Text
                style={styles.getStartedText}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Min: {sensor.min}
            </Text>
            {
                reading
                &&
                <Text
                    style={sensor.alert ? styles.getStartedRed : styles.getStartedGreen}
                    lightColor="rgba(0,0,0,0.8)"
                    darkColor="rgba(255,255,255,0.8)">
                    Current: {reading.current}
                </Text>
            }
            <Text
                style={sensor.alert ? styles.getStartedRed : styles.getStartedGreen}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Alert: {sensor.alert ? "True" : "False"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tinyLogo: {
        width: 150,
        height: 150,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    getStartedGreen: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
        color: 'green'
    },
    getStartedRed: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
        color: 'red'
    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});