import express, { Application, Response } from 'express';
import { logger } from './middleware/logger';
import { rateLimiterMiddleware } from './middleware/limiter';
import { authRouter } from './auth/auth.route';
import { userRouter } from './Users/user.route';
import { prescriptionRouter } from './Prescriptions/prescription.route';
import { paymentRouter } from './Payments/payment.route';
import { complaintRouter } from './Complaints/complaints.route';
import { doctorRouter } from './Doctors/doctor.route';
import{ prescriptionItemsRouter} from './PrescriptionItems/prescriptionItems.route'
import { appointmentRouter } from './Appointments/appointments.route';
import cors from "cors"
import { mpesaRouter } from "./mpesa/mpesa.route";

const app: Application = express();

app.use(express.json({ type: "*/*" }));
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(logger);
app.use(rateLimiterMiddleware);

//default route
app.get('/',(req: any,res:Response)=>{
    res.send('Welcome to Express API Backend with drizle ORM and PostgreSQL');
})


app.use('/api',authRouter);
app.use('/api',userRouter)
app.use('/api',prescriptionRouter)
app.use('/api',paymentRouter)
app.use('/api',complaintRouter)
app.use('/api',doctorRouter)
app.use('/api',appointmentRouter)
app.use('/api',prescriptionItemsRouter)
app.use("/api/mpesa", mpesaRouter);


export default app