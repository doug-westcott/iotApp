import fb from './fb'

const createSampleData = async () => {
  const init = fb.functions().httpsCallable('createSampleData');
  const response = await init()
  console.log(response)
}
createSampleData()
