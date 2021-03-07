import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '../../../components/Themed';
import db from '../../../db'

// all picker values should be non-object (number, string, etc.)

export default function MotionInfo({ user, category, sensor }) {

    const [readings, setReadings] = useState([])
    // can only load images once you know the sensor id
    // -- first time running, will stop because sensor.id is ""
    // -- when sensor is loaded (above), will rerun
    // -- second time running will active the listener to images
    useEffect(() => sensor ? db.Sensors.Readings.listen2OrderByWhen(setReadings, sensor.id) : undefined, [sensor])

    let latestImageURL = "https://image.shutterstock.com/image-vector/loading-icon-logo-isolated-on-260nw-1453631144.jpg"
    if (readings.length >= 1) {
        latestImageURL = readings[0].url
    }

    let previousImageURL = "https://image.shutterstock.com/image-vector/loading-icon-logo-isolated-on-260nw-1453631144.jpg"
    if (readings.length >= 2) {
        previousImageURL = readings[1].url
    }

    console.log(category)
    console.log(readings.length)

    return (
        <View>

            <Text
                style={styles.getStartedText}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)"
            >
                Previous image
            </Text>
            <Image
                style={styles.tinyLogo}
                source={{
                    uri: previousImageURL,
                }}
            />
            <Text
                style={styles.getStartedText}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Latest image
            </Text>
            <Image
                style={styles.tinyLogo}
                source={{
                    uri: latestImageURL,
                }}
            />
            <Text
                style={styles.getStartedText}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Motion detected
            </Text>
            <Text
                style={styles.getStartedText}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                {sensor.motiondetected ? "True" : "False"}
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