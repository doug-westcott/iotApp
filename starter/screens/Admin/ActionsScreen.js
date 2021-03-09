import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import CategoryPicker from '../pickers/CategoryPicker'
import SensorByCategoryPicker from '../pickers/SensorByCategoryPicker'
import TemperatureActions from './TemperatureActions'
import MotionActions from './MotionActions'
import Colors from '../../../constants/Colors';
import db from '../../../db'

export default function ActionsScreen() {

  const [category, setCategory] = useState(null)
  useEffect(() => setSensor(null), [category])
  const [sensor, setSensor] = useState(null)

  const [out, setOut] = useState(null)
  useEffect(() => db.Simulator.listenOne(setOut, "out"), [])

  let delay = 5
  // start uploading random readings every 5 seconds
  const handleStartSimulator = () => {
    db.Simulator.update({ id: "in", command: "Start", delay })
  }

  const handleStopSimulator = () => {
    db.Simulator.update({ id: "in", command: "Stop" })
  }

  const handleDelay = async change => {
    delay = out.delay + change
    await handleStopSimulator()
    await handleStartSimulator()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleStartSimulator} style={styles.title} disabled={out?.status === "Running"}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Start simulator
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelay(-1)} style={styles.title} disabled={out?.delay <= 1}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Decrement delay by 1
    </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelay(+1)} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Increment delay by 1
    </Text>
      </TouchableOpacity>
      <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
        Status: {out?.status} Delay: {out?.delay}
      </Text>
      <TouchableOpacity onPress={handleStopSimulator} style={styles.title} disabled={out?.status !== "Running"}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Stop simulator
    </Text>
      </TouchableOpacity>
      <CategoryPicker set={setCategory} />
      {
        category
        &&
        <SensorByCategoryPicker category={category} set={setSensor} />
      }
      {
        category
        &&
        sensor
        &&
        category.name === "Motion"
        &&
        <MotionActions sensor={sensor} />
      }
      {
        category
        &&
        sensor
        &&
        category.name === "Temperature"
        &&
        <TemperatureActions sensor={sensor} />
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
