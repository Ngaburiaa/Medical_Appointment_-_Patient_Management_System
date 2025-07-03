import { db } from "./db"; // adjust path if needed
import {
  usersTable, doctorsTable, appointmentsTable,
  prescriptionsTable, paymentsTable, complaintsTable,
  TUserInsert, TDoctorInsert, TAppointmentInsert,
  TPrescriptionInsert, TPaymentInsert, TComplaintInsert
} from "./schema"; // adjust path to your schema

// Utility: format Date to 'YYYY-MM-DD'
const formatDate = (date: Date) => date.toISOString().split("T")[0];

async function seed() {
  // === USERS ===
  const users: TUserInsert[] = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "hashedpassword123",
      contactPhone: "0700123456",
      address: "Nairobi",
      userType: "user"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: "hashedpassword456",
      contactPhone: "0711223344",
      address: "Mombasa",
      userType: "user"
    },
  ];
  const insertedUsers = await db.insert(usersTable).values(users).returning();

  // === DOCTORS ===
  const doctors: TDoctorInsert[] = [
    {
       
        specialization: "Pediatrics",
         availableDays: "Mon,Wed,Fri",
        bio:"Harvard-trained specialist in cardiovascular diseases",
        userId: insertedUsers[0].userId
    },
    {
        specialization: "Dentistry",
        availableDays: "Tue,Thu",
        bio:"Child health expert with focus on preventive care",
        userId: insertedUsers[1].userId
    },
  ];
  const insertedDoctors = await db.insert(doctorsTable).values(doctors).returning();

  // === APPOINTMENTS ===
  const appointments: TAppointmentInsert[] = [
    {
      userId: insertedUsers[0].userId,
      doctorId: insertedDoctors[0].doctorId,
      appointmentDate: formatDate(new Date("2025-07-01")),
      timeSlot: "09:00 AM - 10:00 AM",
      totalAmount: "3000.00",
      appointmentStatus: "Confirmed"
    },
    {
      userId: insertedUsers[1].userId,
      doctorId: insertedDoctors[1].doctorId,
      appointmentDate: formatDate(new Date("2025-07-03")),
      timeSlot: "11:00 AM - 12:00 PM",
      totalAmount: "4500.00",
      appointmentStatus: "Pending"
    },
  ];
  const insertedAppointments = await db.insert(appointmentsTable).values(appointments).returning();

  // === PRESCRIPTIONS ===
  const prescriptions: TPrescriptionInsert[] = [
    {
      appointmentId: insertedAppointments[0].appointmentId,
      doctorId: insertedDoctors[0].doctorId,
      patientId: insertedUsers[0].userId,
      notes: "Take paracetamol 500mg twice daily."
    },
    {
      appointmentId: insertedAppointments[1].appointmentId,
      doctorId: insertedDoctors[1].doctorId,
      patientId: insertedUsers[1].userId,
      notes: "Apply gel twice daily."
    },
  ];
  await db.insert(prescriptionsTable).values(prescriptions);

  // === PAYMENTS ===
  const payments: TPaymentInsert[] = [
    {
      appointmentId: insertedAppointments[0].appointmentId,
      amount: "3000.00",
      paymentStatus: "Paid",
      transactionId: "TXN001",
      paymentDate: formatDate(new Date("2025-07-01"))
    },
    {
      appointmentId: insertedAppointments[1].appointmentId,
      amount: "4500.00",
      paymentStatus: "Pending",
      transactionId: "TXN002",
      paymentDate: formatDate(new Date("2025-07-02"))
    },
  ];
  await db.insert(paymentsTable).values(payments);

  // === COMPLAINTS ===
  const complaints: TComplaintInsert[] = [
    {
      userId: insertedUsers[0].userId,
      relatedAppointmentId: insertedAppointments[0].appointmentId,
      subject: "Doctor arrived late",
      description: "The doctor came 30 mins late",
      status: "Open"
    },
    {
      userId: insertedUsers[1].userId,
      relatedAppointmentId: insertedAppointments[1].appointmentId,
      subject: "Wrong diagnosis",
      description: "Prescribed medicine caused allergies",
      status: "In Progress"
    },
  ];
  await db.insert(complaintsTable).values(complaints);

  console.log("✅ Seed completed successfully.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
