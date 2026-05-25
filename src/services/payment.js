import api from './api'

export const createOrder = (amount) => 
  api.post('/payment/create-order', { amount })

export const verifyAndBook = (data) => 
  api.post('/payment/verify-and-book', data)
