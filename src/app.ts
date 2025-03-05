import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import indexRouter from './routes';
import sqlite3 = require('sqlite3');

const app = express();

const corsOptions = {
   methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
   credentials: true,
   optionsSuccessStatus: 200
};

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
   sqlite3.verbose()
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true} ));
app.use(express.json());
app.use('', indexRouter);

export default app;