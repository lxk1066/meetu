import { BackendURL } from '../../../project.config'
import { io } from 'socket.io-client'

const socket = io(BackendURL)

export default socket
