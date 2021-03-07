import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { Text, View } from '../../../components/Themed';
import db from '../../../db'
import UserContext from '../../../UserContext'

export default function TemperatureActions({ sensor }) {

  const { user } = useContext(UserContext)
  useEffect(() => handleStopSimulator(), [user])

  // return "stop simulator function", to be called on component unmount, stopping the timer
  useEffect(() => handleStopSimulator, [])

  const [reading, setReading] = useState(null)
  useEffect(() => db.Sensors.Readings.listenLatestOne(setReading, sensor.id), [sensor])

  const uploadReading = async () => await db.Sensors.Readings.createReading(sensor.id, {
    when: new Date(),
    current: (reading?.current || 50) + Math.floor(Math.random() * 20) - 10
  })

  const handleToggleAlert = async () => await db.Sensors.toggleAlert(sensor)

  const updateMinMax = async (minmax, amount) => await db.Sensors.update({ ...sensor, [minmax]: sensor[minmax] + amount })

  const [delay, setDelay] = useState(5)
  const [intervalId, setIntervalId] = useState(0)

  // start uploading random readings every 5 seconds
  const handleStartSimulator = () => setIntervalId(setInterval(uploadReading, delay * 1000))

  const handleStopSimulator = () => {
    clearInterval(intervalId)
    setIntervalId(0)
  }

  return (
    <View style={styles.helpContainer}>
      <TouchableOpacity onPress={() => updateMinMax('min', -10)} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Decrement min by 10
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateMinMax('min', 10)} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Increment min by 10
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateMinMax('max', -10)} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Decrement max by 10
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateMinMax('max', 10)} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Increment max by 10
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadReading} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Upload a new random reading
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleToggleAlert} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Toggle alert field
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStartSimulator} style={styles.title} disabled={intervalId !== 0}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Start simulator
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDelay(delay - 1)} style={styles.title} disabled={delay <= 1}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Decrement delay by 1
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDelay(delay + 1)} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Increment delay by 1
    </Text>
      </TouchableOpacity>
      <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
        Delay: {delay}
      </Text>
      <TouchableOpacity onPress={handleStopSimulator} style={styles.title} disabled={intervalId === 0}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Stop simulator
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
