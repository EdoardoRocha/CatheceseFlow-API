import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import db configs
import conn from './src/Config/db.js';

// Import models
import User from './src/Models/Users.js';
import Parishe from './src/Models/Parishes.js';
import Class from './src/Models/Class.js';
import Lecture from './src/Models/Lectures.js';
import Student from './src/Models/Students.js';
import StudentPhone from './src/Models/StudentPhones.js';
import Absence from './src/Models/Absences.js';
import Attendance from './src/Models/Attendances.js';
import Address from './src/Models/Address.js';

//Import associations
import './src/Models/associations.js';

const app = express();

// Config JSON response
app.use(express.json());

// Solve CORS
app.use(cors());

// Routes
import UserRoutes from './src/Routes/UserRoutes.js';
import ClassRoutes from './src/Routes/ClassRoutes.js';
import StudentRoutes from './src/Routes/StudentRoutes.js';
import AddressRoutes from './src/Routes/AdressRoutes.js';
import LectureRoutes from './src/Routes/LectureRoutes.js';
import AbsenceRoutes from './src/Routes/AbsenceRoutes.js';
import AttendanceRoutes from './src/Routes/AttendanceRoutes.js';
import ParisheRoutes from './src/Routes/ParisheRoutes.js';

app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/classes', ClassRoutes);
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/addresses', AddressRoutes);
app.use('/api/v1/lectures', LectureRoutes);
app.use('/api/v1/absences', AbsenceRoutes);
app.use('/api/v1/attendances', AttendanceRoutes);
app.use('/api/v1/parishes', ParisheRoutes);

conn
    .sync()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT}`)
        })
    })
    .catch(err => console.error(err));