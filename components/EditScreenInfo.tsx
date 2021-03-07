import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from '../starter/screens/node_modules/react
import { StyleSheet, TouchableOpacity, Image } from '../starter/screens/node_modules/react-native

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import fb from '../fb'
import db from '../db'

export default function SensorScreen() {

  const sensorId = "wZl4sbUX5js38Y0lvwpd"

  const [sensor, setSensor] = useState({
    id: "",
    location: "",
    motiondetected: true
  })
  useEffect(() => db.Sensors.listenOne(setSensor, sensorId), [sensorId])

  const [images, setImages] = useState([])
  // can only load images once you know the sensor id
  // -- first time running, will stop because sensor.id is ""
  // -- when sensor is loaded (above), will rerun
  // -- second time running will active the listener to images
  useEffect(() => sensor.id !== "" ? db.Sensors.Images.listen2OrderByWhen(setImages, sensor.id) : undefined, [sensor])

  const [latestImageURL, setLatestImageURL] = useState("https://image.shutterstock.com/image-vector/loading-icon-logo-isolated-on-260nw-1453631144.jpg")
  useEffect(() => {
    const getData = async () => {
      if (images.length >= 1) {
        setLatestImageURL(await fb.storage().ref(`sensors/${sensor.id}/images/${images[0].id}.jpg`).getDownloadURL())
      }
    }
    getData()
  }, [images])

  const [previousImageURL, setPreviousImageURL] = useState("https://image.shutterstock.com/image-vector/loading-icon-logo-isolated-on-260nw-1453631144.jpg")
  useEffect(() => {
    const getData = async () => {
      if (images.length >= 2) {
        setPreviousImageURL(await fb.storage().ref(`sensors/${sensor.id}/images/${images[1].id}.jpg`).getDownloadURL())
      }
    }
    getData()
  }, [images])

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
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

      {/* <View style={styles.helpContainer}>
        <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
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
});
