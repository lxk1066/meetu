import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000'
})

export default request
