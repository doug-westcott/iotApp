const firebase = require('firebase')

// put your own config here
const firebaseConfig = {
    apiKey: "AIzaSyCT2n9FyFZpzBdM-eefgM3q1NooIOKmUA0",
    authDomain: "cp3351-73e9b.firebaseapp.com",
    projectId: "cp3351-73e9b",
    storageBucket: "cp3351-73e9b.appspot.com",
    messagingSenderId: "761342188736",
    appId: "1:761342188736:web:bb5450394e29612a78e125",
    measurementId: "G-W7HKMFEDYR"
}

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

db.useEmulator("localhost", 8080)
firebase.functions().useEmulator("localhost", 5001)
firebase.auth().useEmulator("http://localhost:9099")

const reformat = doc => ({ id: doc.id, ...doc.data() })
const findAll = async collection => (await db.collection(collection).get()).docs.map(reformat)
const findOne = async (collection, id) => reformat(await db.collection(collection).doc(id).get())
const listenOne = (act, collection, id) => db.collection(collection).doc(id).onSnapshot(snap => act(reformat(snap)))
const findOneSubAll = async (collection, id, subcollection) => (await db.collection(collection).doc(id).collection(subcollection).get()).docs.map(reformat)
const removeOneSubOne = async (collection, id, subcollection, subId) => await db.collection(collection).doc(id).collection(subcollection).doc(subId).delete()
const removeOne = async (collection, id) => await db.collection(collection).doc(id).delete()


const inDoc = db.collection('simulator').doc('in')
const outDoc = db.collection('simulator').doc('out')

let delay = 5
let intervalId = 0

// when command received, act on it
// - send back any info to 'out' document
const act = async ({ command, delay: newDelay }) => {
    console.log('acting on', command, newDelay)
    if (command === 'Start' && intervalId === 0) {
        delay = newDelay
        handleStartSimulator()
    } else if (command === 'Stop') {
        handleStopSimulator()
    } else {
        console.log("Unrecognized command")
    }
}

// set listener to 'in' document
inDoc.onSnapshot(snap => act(reformat(snap)))

// start listening to all categories
let categories = []
db.collection('categories').onSnapshot(snap => categories = snap.docs.map(reformat))
const isCategory = (sensor, name) => categories.find(category => category.id === sensor.categoryid).name === name

// start listening to all sensors
let sensors = []
db.collection('sensors').onSnapshot(snap => sensors = snap.docs.map(reformat))

const simulateReading = async sensor => {
    // first get latest reading
    const readings = (await db.collection('sensors').doc(sensor.id).collection('readings').orderBy("when").limit(1).get()).docs.map(reformat)
    // then update it
    if (isCategory(sensor, "Temperature")) {
        const current = readings.length > 0 ? readings[0].current : 50
        await db.collection('sensors').doc(sensor.id).collection('readings').add({
            when: new Date(),
            current: current + Math.floor(Math.random() * 20) - 10
        })
    } else {
        console.log('other type of sensor not simulated yet')
    }
}

const simulate = () => {
    sensors.map(simulateReading)
}

const handleStartSimulator = async () => {
    intervalId = setInterval(simulate, delay * 1000)
    await outDoc.set({ status: "Running", delay })
}

const handleStopSimulator = async () => {
    clearInterval(intervalId)
    intervalId = 0
    await outDoc.set({ status: "Stopped", delay })
}

const init = async () => {
    await outDoc.set({ status: "Stopped", delay })
}
init()
