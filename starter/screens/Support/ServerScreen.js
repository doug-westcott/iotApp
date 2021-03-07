import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { Text, View } from '../../../components/Themed';
import fb from '../../../fb'
import db from '../../../db'
import { Picker } from '@react-native-picker/picker';

export default function ServerScreen() {

  const [sensors, setSensors] = useState([])
  useEffect(() => db.Sensors.listenAll(setSensors), [])

  const [sensorId, setSensorId] = useState("")  // set by user choosing from drop-down
  const [sensor, setSensor] = useState(null)
  useEffect(() => sensorId !== "" ? db.Sensors.listenOne(setSensor, sensorId) : undefined, [sensorId])

  const [category, setCategory] = useState(null)
  useEffect(() => sensor ? db.Categories.listenOne(setCategory, sensor.categoryId) : undefined, [sensor])

  // can only load images once you know the sensor id
  // -- first time running, will stop because sensor is null
  // -- when sensor is loaded (above), will rerun
  // -- second time running will active the listener to images
  const [images, setImages] = useState([])
  useEffect(() => category && category.name === "Motion" ? db.Sensors.Readings.listen2OrderByWhen(setImages, sensor.id) : undefined, [category])

  const [latestImageURL, setLatestImageURL] = useState("")
  useEffect(() => {
    const getData = async () => {
      if (images.length >= 1) {
        setLatestImageURL(await fb.storage().ref(`sensors/${sensor.id}/images/${images[0].id}.jpg`).getDownloadURL())
      }
    }
    getData()
  }, [images])

  const [previousImageURL, setPreviousImageURL] = useState("")
  useEffect(() => {
    const getData = async () => {
      if (images.length >= 2) {
        setPreviousImageURL(await fb.storage().ref(`sensors/${sensor.id}/images/${images[1].id}.jpg`).getDownloadURL())
      }
    }
    getData()
  }, [images])

  // const checkMotion = async () => {
  //   // images has the latest two id's
  //   // 1 -- get the blobs from fb storage
  //   //   -- change the blobs to base64 strings
  //   // 2 -- compare the strings
  //   // 3 -- update db with true/false (motiondetected field)

  //   const response1 = await fetch(latestImageURL)
  //   const blob1 = await response1.blob()

  //   const response2 = await fetch(previousImageURL)
  //   const blob2 = await response2.blob()

  //   // compare two blobs
  //   const reader = new FileReader();

  //   reader.onload = () => {

  //     blob1.close()
  //     const base64_1 = reader.result

  //     reader.onload = () => {
  //       blob2.close()
  //       const base64_2 = reader.result

  //       console.log(base64_1 == base64_2)
  //       db.Sensors.setMotionDetected(sensor, base64_1 != base64_2)

  //     }
  //     reader.readAsDataURL(blob2) // then call upload automatically

  //   }
  //   reader.readAsDataURL(blob1)  // then call upload automatically
  // }

  const testCheckMotion = async () => {
    const checkMotion = fb.functions().httpsCallable('checkMotion');
    const response = await checkMotion({ sensor, latestImageURL, previousImageURL })
    console.log(response)
  }

  const testURL = async () => {
    //const response = await fetch("http://10.0.2.2:5001/cp3351-73e9b/us-central1/helloWorld")
    const helloWorld = fb.functions().httpsCallable('helloWorld');
    const response = await helloWorld()
    console.log(response)
  }

  console.log(previousImageURL)
  console.log(latestImageURL)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={testURL} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Run server function
        </Text>
      </TouchableOpacity>
      <Picker
        style={{ height: 50, width: 200 }}
        selectedValue={sensorId}
        onValueChange={value => value !== "" && setSensorId(value)}
      >
        <Picker.Item label='Select Sensor' value="" />
        {
          sensors.map(sensor => <Picker.Item key={sensor.id} label={sensor.id} value={sensor.id} />)
        }
      </Picker>
      {
        sensor
        &&
        category
        &&
        category.name === "Motion"
        &&
        <View style={styles.helpContainer}>
          <TouchableOpacity onPress={testCheckMotion} style={styles.title}>
            <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
              Check for motion
          </Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
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
