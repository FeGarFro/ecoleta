import express from 'express';
import cors from 'cors'
import routes from './routes'
import path from 'path'
import { errors } from 'celebrate'

var app = express();

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/images', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use('/images/point', express.static(path.resolve(__dirname, '..', 'uploads', 'points')))
app.use(errors())



app.listen(3333) 