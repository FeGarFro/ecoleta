import axios from 'axios'

const ApiRequest = axios.create({
    baseURL: "http://192.168.0.14:3333/"
})

export default ApiRequest