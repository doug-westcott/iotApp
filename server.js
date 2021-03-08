const firebase = require('firebase')

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

// when command received, act on it
// - send back any info to 'out' document
const act = async data => {
    console.log('acting on', data)
    const { count } = reformat(await outDoc.get())
    await outDoc.set({ count: count + 1 })
    const { count: count1 } = reformat(await outDoc.get())
    console.log('count1', count1)
}

// set listener to 'in' document
inDoc.onSnapshot(snap => act(reformat(snap)))

const test = async () => {
    console.log("sending commands to simulator...")
    await outDoc.set({ count: 0 })
    await inDoc.set({ status: "On" })
    await inDoc.set({ status: "Off" })
    await inDoc.set({ status: "On" })
    await inDoc.set({ status: "Off" })
}
test()