import {text,timestamp,decimal,integer,serial,pgEnum,pgTable, date,} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("userType", ['user', 'admin', 'doctor']);

export const paymentStatusEnum = pgEnum("paymentStatusEnum ", [ "Pending","Confirmed", "Cancelled"]);

export const appointmentStatusEnum = pgEnum("appointment_status_enum", [ "Pending","Confirmed", "Cancelled"]);

export const complaintStatusEnum = pgEnum("complaint_status_enum", ["Open","In Progress","Resolved", "Closed",]);

export const prescriptionStatusEnum = pgEnum("prescription_status_enum", [ "active", "expired", "cancelled", "refilled"]);

export const usersTable = pgTable("usersTable", {
  userId: serial("user_id").primaryKey(),
  firstName: text("firstname").notNull(),
  lastName: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  contactPhone: text("contact_phone").notNull(),
  profileURL:text("profile"),
  address: text("address"),
  userType: roleEnum("userType").default('user'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});


export const doctorsTable = pgTable("doctorsTable", {
  doctorId: serial("doctor_id").primaryKey(),
  userId:integer("user_id").notNull().references(() => usersTable.userId, { onDelete: "cascade" }),
  specialization: text("specialization").notNull(),
  bio:text("bio").notNull(),
  availableDays: text("available_days"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const appointmentsTable = pgTable("appointmentsTable", {
  appointmentId: serial("appointment_id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.userId, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctorsTable.doctorId, { onDelete: "cascade" }),
  appointmentDate: date("appointment_date").notNull().defaultNow(),
  timeSlot: text("time_slot").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  appointmentStatus: appointmentStatusEnum("appointment_status").default("Pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});


export const prescriptionsTable = pgTable("prescriptionsTable", {
  prescriptionId: serial("prescription_id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointmentsTable.appointmentId, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctorsTable.doctorId, { onDelete: "cascade" }),
  patientId: integer("patient_id").notNull().references(() => usersTable.userId, { onDelete: "cascade" }),
  diagnosis: text("diagnosis"),
  notes: text("notes"),
  issuedAt: date("issued_at").notNull().defaultNow(),
  status: prescriptionStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const prescriptionItemsTable = pgTable("prescriptionItemsTable", {
  itemId: serial("item_id").primaryKey(),
  prescriptionId: integer("prescription_id").notNull().references(() => prescriptionsTable.prescriptionId, { onDelete: "cascade" }),
  drugName: text("drug_name").notNull(),
  dosage: text("dosage").notNull(),                  
  route: text("route").notNull(),                    
  frequency: text("frequency").notNull(),            
  duration: text("duration").notNull(),             
  instructions: text("instructions"),
  substitutionAllowed: integer("substitution_allowed").default(0).notNull(), 
});




export const paymentsTable = pgTable("paymentsTable", {
  paymentId: serial("payment_id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointmentsTable.appointmentId, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull(),
  transactionId: text("transaction_id").notNull(),
  paymentDate: date("payment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const complaintsTable = pgTable("complaintsTable", {
  complaintId: serial("complaint_id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.userId, { onDelete: "cascade" }),
  relatedAppointmentId: integer("related_appointment_id").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: complaintStatusEnum("status").default("Open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});


// === RELATIONS ===

export const usersTableRelations = relations(usersTable, ({ many, one }) => ({
  appointments: many(appointmentsTable),
  prescriptions: many(prescriptionsTable),
  complaints: many(complaintsTable),
  doctorProfile: one(doctorsTable, {
    fields: [usersTable.userId],
    references: [doctorsTable.userId],
  }),
}));

export const doctorsTableRelations = relations(doctorsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [doctorsTable.userId],
    references: [usersTable.userId],
  }),
  appointments: many(appointmentsTable),
  prescriptions: many(prescriptionsTable),
}));

export const appointmentsTableRelations = relations(appointmentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [appointmentsTable.userId],
    references: [usersTable.userId],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
  prescription: many(prescriptionsTable),
  payments: many(paymentsTable),
  complaints: many(complaintsTable),
}));

export const prescriptionsTableRelations = relations(prescriptionsTable, ({ one, many }) => ({
  appointment: one(appointmentsTable, {
    fields: [prescriptionsTable.appointmentId],
    references: [appointmentsTable.appointmentId],
  }),
  doctor: one(doctorsTable, {
    fields: [prescriptionsTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
  patient: one(usersTable, {
    fields: [prescriptionsTable.patientId],
    references: [usersTable.userId],
  }),
  items: many(prescriptionItemsTable),
}));

export const prescriptionItemsTableRelations = relations(prescriptionItemsTable, ({ one }) => ({
  prescription: one(prescriptionsTable, {
    fields: [prescriptionItemsTable.prescriptionId],
    references: [prescriptionsTable.prescriptionId],
  }),
}));


export const paymentsTableRelations = relations(paymentsTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [paymentsTable.appointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));

export const complaintsTableRelations = relations(complaintsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [complaintsTable.userId],
    references: [usersTable.userId],
  }),
  appointment: one(appointmentsTable, {
    fields: [complaintsTable.relatedAppointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));


//inferTypes

export type TUserInsert = typeof usersTable.$inferInsert;
export type TUserSelect = typeof usersTable.$inferSelect;

export type TDoctorInsert = typeof doctorsTable.$inferInsert;
export type TDoctorSelect = typeof doctorsTable.$inferSelect;

export type TAppointmentInsert = typeof appointmentsTable.$inferInsert;
export type TAppointmentSelect = typeof appointmentsTable.$inferSelect;

export type TPrescriptionInsert = typeof prescriptionsTable.$inferInsert;
export type TPrescriptionSelect = typeof prescriptionsTable.$inferSelect;

export type TPrescriptionItemInsert = typeof prescriptionItemsTable.$inferInsert;
export type TPrescriptionItemSelect = typeof prescriptionItemsTable.$inferSelect;


export type TPaymentInsert = typeof paymentsTable.$inferInsert;
export type TPaymentSelect = typeof paymentsTable.$inferSelect;

export type TComplaintInsert = typeof complaintsTable.$inferInsert;
export type TComplaintSelect = typeof complaintsTable.$inferSelect;


