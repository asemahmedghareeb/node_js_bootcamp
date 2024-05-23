import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import coursesRouter from './routes/courses.route.js';
import usersRouter from './routes/users.route.js';
import { ERROR } from './utils/httpSatusText.js';
import path from 'path'; 
import { dirname } from 'path';
//i did this because in es6 modules i can not use __filename and __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const url = process.env.MONGO_URL;
const app = express();
app.use(cors());
app.use(express.json());
//this is for preview the uploads
//this middleware will tell the server to use the uploads folder for static files 
app.use('/uploads',express.static(path.join(__dirname, '/uploads')));
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);


//global middleware for not found router
app.all("*", (req, res, next) => {
    res.status(404).json({ status: ERROR, data: { message: "this resource is not found" } });
})
//global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusText || ERROR, message: error.message,code:error.statusCode || 500 , data:null});
})
mongoose.connect(url).then(() => {
    console.log("connected to DB successfully");
    app.listen(process.env.PORT || 4000, () => console.log(`Server running on port ${process.env.PORT || 4000}`));
});
 
//topics in the bootcamp:-

//rest api crud operations
//authentication    
//authorization (role based)
//error handling     
//file uploading
//web sockets
//deployment        


//rate limiting
//sending email
//access based authorization
//caching    