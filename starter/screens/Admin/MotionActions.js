import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '../../../constants/Colors';
import { Text, View } from '../../../components/Themed';
import fb from '../../../fb'
import db from '../../../db'
import * as ImagePicker from 'expo-image-picker';

export default function MotionActions({ sensor }) {

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const uploadImage = async () => {

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      base64: true
    })

    if (!image.cancelled) {

      // image's name = date & time
      const when = new Date()
      const imageName = when.toISOString()
      const imageRef = fb.storage().ref(`sensors/${sensor.id}/images/${imageName}.jpg`)

      const response = await fetch(image.uri)
      const blob = await response.blob()
      await imageRef.put(blob)
      const url = await imageRef.getDownloadURL()
      console.log('url', url)
      blob.close()

      // create reading using when (ISO format) also as image name in storage
      await db.Sensors.Readings.createReading(sensor.id, { when, url })
    }
  }

  const handleToggleMotionDetected = () => db.Sensors.toggleMotionDetected(sensor)

  return (
    <View style={styles.helpContainer}>
      <TouchableOpacity onPress={uploadImage} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Upload an image
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleToggleMotionDetected} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Toggle motion detected field
    </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
