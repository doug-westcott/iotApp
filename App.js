import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import NavigationCustomer from './starter/navigation/customer';
import NavigationAdmin from './starter/navigation/admin';

import { LogBox } from 'react-native'
LogBox.ignoreLogs(['Setting a timer for a long period of time'])

import fb from './fb'
import db from './db'
import UserContext from './UserContext'
import RegisterLogin from './RegisterLogin'
import './SampleData'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [user, setUser] = useState(null) // store db user, not auth user 

  // run once, set listener to auth user state
  useEffect(() => {

    // listener for auth state:
    // 1 - cancel db user listener
    // 2 - if non-null auth user,  start new db user listener

    let dbUnsubscribe = () => { } // initially, do nothing

    const findAndSetUser = async user => {
      dbUnsubscribe()
      if (user) {
        dbUnsubscribe = db.Users.listenOne(setUser, user.uid)
      } else {
        dbUnsubscribe = () => { }
        setUser(null)
      }
    }

    const authUnsubscribe = fb.auth().onAuthStateChanged(findAndSetUser)

    return () => {
      authUnsubscribe()
      dbUnsubscribe()
    }
  }, [])

  console.log('user', user)

  const selectNavigation = () => {
    if (!user) {
      return <RegisterLogin />
    } else if (user?.role === "Customer") {
      return <NavigationCustomer colorScheme={colorScheme} />
    } else if (user?.role === "Admin") {
      return <NavigationAdmin colorScheme={colorScheme} />
    } else {
      console.log('user role', user?.role)
      fb.auth().signOut()
      return null
    }
  }

  return (
    isLoadingComplete
    &&
    <UserContext.Provider value={{ user }}>
      <SafeAreaProvider>
        {selectNavigation()}
        <StatusBar />
      </SafeAreaProvider>
    </UserContext.Provider>
  )

}
