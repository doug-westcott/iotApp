import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../../../components/Themed';
import MotionInfo from './MotionInfo'
import TemperatureInfo from './TemperatureInfo'
import CategoryByUserPicker from '../pickers/CategoryByUserPicker';
import SensorByUserAndCategoryPicker from '../pickers/SensorByUserAndCategoryPicker';
import UserContext from '../../../UserContext'

export default function SensorsScreen() {

  const { user } = useContext(UserContext)
  useEffect(() => setCategory(null), [user])
  const [category, setCategory] = useState(null)
  useEffect(() => setSensor(null), [category])
  const [sensor, setSensor] = useState(null)

  console.log(user, category, sensor)

  return (
    <View>
      <View style={styles.getStartedContainer}>
        {
          user
          &&
          <CategoryByUserPicker set={setCategory} />
        }
        {
          user
          &&
          category
          &&
          <SensorByUserAndCategoryPicker category={category} set={setSensor} />
        }
        {
          user
          &&
          category
          &&
          sensor
          &&
          <>
            {
              category.name === "Motion"
              &&
              <MotionInfo user={user} category={category} sensor={sensor} />
            }
            {
              category.name === "Temperature"
              &&
              <TemperatureInfo user={user} category={category} sensor={sensor} />
            }
          </>
        }
      </View>
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
