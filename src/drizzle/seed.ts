import { db } from "../drizzle/db";
import {
  usersTable, doctorsTable,
  appointmentsTable, prescriptionsTable,
  prescriptionItemsTable, paymentsTable,
  complaintsTable,
} from "../drizzle/schema";

import bcrypt from "bcrypt";

async function seed() {
  // Hash passwords
  const password1 = await bcrypt.hash("12345", 10); // For Alice
  const password2 = await bcrypt.hash("12345", 10);   // For Brian
  const password3 = await bcrypt.hash("12345", 10);     // For Charles

  // --- USERS ---
  const users = await db.insert(usersTable).values([
    {
      firstName: "Alice",
      lastName: "Mwangi",
      email: "dennis@gmail.com",
      password: password1,
      contactPhone: "+254712345678",
      address: "Nairobi, Kenya",
      userType: "user",
    },
    {
      firstName: "Dr. Brian",
      lastName: "Otieno",
      email: "dennisngaburia@gmail.com",
      password: password2,
      contactPhone: "+254798765432",
      address: "Kisumu, Kenya",
      userType: "doctor",
    },
    {
      firstName: "Charles",
      lastName: "Kimani",
      email: "dennismathenge@gmail.com",
      password: password3,
      contactPhone: "+254700112233",
      address: "Mombasa, Kenya",
      userType: "user",
    },
  ]).returning();

  const userAlice = users[0];
  const doctorBrian = users[1];
  const userCharles = users[2];

  // --- DOCTORS ---
  const doctors = await db.insert(doctorsTable).values([
    {
      userId: doctorBrian.userId,
      specialization: "General Physician",
      bio: "Experienced in general medical practice.",
      availableDays: "Monday, Wednesday, Friday",
    },
  ]).returning();

  const doctor1 = doctors[0];

  // --- APPOINTMENTS ---
  const appointments = await db.insert(appointmentsTable).values([
    {
      userId: userAlice.userId,
      doctorId: doctor1.doctorId,
      appointmentDate: new Date().toISOString().split("T")[0],
      timeSlot: "09:00 AM - 09:30 AM",
      totalAmount: "1500.00",
      appointmentStatus: "Pending",
    },
    {
      userId: userCharles.userId,
      doctorId: doctor1.doctorId,
      appointmentDate: new Date().toISOString().split("T")[0],
      timeSlot: "10:00 AM - 10:30 AM",
      totalAmount: "2000.00",
      appointmentStatus: "Pending",
    },
  ]).returning();

  const appointment1 = appointments[0];
  const appointment2 = appointments[1];

  // --- PRESCRIPTIONS ---
  const prescriptions = await db.insert(prescriptionsTable).values([
    {
      appointmentId: appointment1.appointmentId,
      doctorId: doctor1.doctorId,
      patientId: userAlice.userId,
      diagnosis: "Common Cold",
      notes: "Rest, fluids, and paracetamol.",
    },
    {
      appointmentId: appointment2.appointmentId,
      doctorId: doctor1.doctorId,
      patientId: userCharles.userId,
      diagnosis: "Migraine",
      notes: "Avoid triggers and take pain relief.",
    },
  ]).returning();

  const prescription1 = prescriptions[0];
  const prescription2 = prescriptions[1];

  // --- PRESCRIPTION ITEMS ---
  await db.insert(prescriptionItemsTable).values([
    {
      prescriptionId: prescription1.prescriptionId,
      drugName: "Paracetamol",
      dosage: "500mg",
      route: "oral",
      frequency: "Three times a day",
      duration: "5 days",
      instructions: "Take after meals",
      substitutionAllowed: 1,
    },
    {
      prescriptionId: prescription2.prescriptionId,
      drugName: "Ibuprofen",
      dosage: "200mg",
      route: "oral",
      frequency: "Twice a day",
      duration: "3 days",
      instructions: "Take with water",
      substitutionAllowed: 0,
    },
  ]);

  // --- PAYMENTS ---
  const today = new Date().toISOString().split("T")[0];
  await db.insert(paymentsTable).values([
    {
      appointmentId: appointment1.appointmentId,
      amount: "1500.00",
      paymentStatus: "Confirmed",
      transactionId: "TXN123ABC",
      paymentDate: today,
    },
    {
      appointmentId: appointment2.appointmentId,
      amount: "2000.00",
      paymentStatus: "Pending",
      transactionId: "TXN456DEF",
      paymentDate: today,
    },
  ]);

  // --- COMPLAINTS ---
  await db.insert(complaintsTable).values([
    {
      userId: userAlice.userId,
      relatedAppointmentId: appointment1.appointmentId,
      subject: "Delay in appointment",
      description: "Doctor arrived late for consultation.",
    },
    {
      userId: userCharles.userId,
      relatedAppointmentId: appointment2.appointmentId,
      subject: "Overcharged",
      description: "Was charged more than expected.",
    },
  ]);

  console.log("✅ All tables seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
