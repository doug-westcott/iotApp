import React, { useState } from "react";
import fb from './fb'
import db from './db'
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Colors from './constants/Colors';
import { Text, View } from './components/Themed';
import LoginPicker from './starter/screens/pickers/LoginPicker'

export default function RegisterLogin() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    await fb.auth().signInWithEmailAndPassword(email, password)
  }

  const register = async () => {
    console.log('register')
    try {
      await fb.auth().createUserWithEmailAndPassword(email, password)
      console.log(fb.auth().currentUser.uid)
      await db.Users.update({ id: fb.auth().currentUser.uid, role: "Customer" })
    } catch (error) {
      alert(error.message)
    }
  }

  const valid = () =>
    email !== "" &&
    password !== ""

  return (
    <View style={styles.container}>
      <LoginPicker setEmail={setEmail} setPassword={setPassword} />
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TouchableOpacity disabled={!valid()} onPress={login} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity disabled={!valid()} onPress={register} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>Register</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
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
