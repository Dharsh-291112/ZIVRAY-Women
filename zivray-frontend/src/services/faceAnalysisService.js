import { api } from './api.js'

export async function postFaceScan(imageBlob) {
  const formData = new FormData()
  formData.append('image', imageBlob, imageBlob.name || 'derma-test.jpg')
  const response = await api.post('/face-analysis/scan', formData)
  return response.data
}