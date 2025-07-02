CREATE TYPE "public"."appointment_status_enum" AS ENUM('Pending', 'Confirmed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."complaint_status_enum" AS ENUM('Open', 'In Progress', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."userType" AS ENUM('user', 'admin', 'doctor');--> statement-breakpoint
CREATE TABLE "appointmentsTable" (
	"appointment_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"appointment_date" date DEFAULT now() NOT NULL,
	"time_slot" text NOT NULL,
	"total_amount" numeric(10, 2),
	"appointment_status" "appointment_status_enum" DEFAULT 'Pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaintsTable" (
	"complaint_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"related_appointment_id" integer,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"status" "complaint_status_enum" DEFAULT 'Open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctorsTable" (
	"doctor_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"specialization" text NOT NULL,
	"contact_phone" text NOT NULL,
	"available_days" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paymentsTable" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" text NOT NULL,
	"transaction_id" text NOT NULL,
	"payment_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescriptionsTable" (
	"prescription_id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usersTable" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"contact_phone" text NOT NULL,
	"address" text,
	"userType" "userType" DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usersTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointmentsTable" ADD CONSTRAINT "appointmentsTable_user_id_usersTable_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."usersTable"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointmentsTable" ADD CONSTRAINT "appointmentsTable_doctor_id_doctorsTable_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctorsTable"("doctor_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaintsTable" ADD CONSTRAINT "complaintsTable_user_id_usersTable_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."usersTable"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaintsTable" ADD CONSTRAINT "complaintsTable_related_appointment_id_appointmentsTable_appointment_id_fk" FOREIGN KEY ("related_appointment_id") REFERENCES "public"."appointmentsTable"("appointment_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctorsTable" ADD CONSTRAINT "doctorsTable_user_id_usersTable_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."usersTable"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD CONSTRAINT "paymentsTable_appointment_id_appointmentsTable_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointmentsTable"("appointment_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD CONSTRAINT "prescriptionsTable_appointment_id_appointmentsTable_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointmentsTable"("appointment_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD CONSTRAINT "prescriptionsTable_doctor_id_doctorsTable_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctorsTable"("doctor_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD CONSTRAINT "prescriptionsTable_patient_id_usersTable_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."usersTable"("user_id") ON DELETE cascade ON UPDATE no action;