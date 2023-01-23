import axios from 'axios'
import { BackendURL } from '../../project.config'

const request = axios.create({
  baseURL: BackendURL
})

export default request
