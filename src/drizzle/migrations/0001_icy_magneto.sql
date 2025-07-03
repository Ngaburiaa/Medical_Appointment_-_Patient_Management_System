CREATE TYPE "public"."paymentStatusEnum " AS ENUM('Pending', 'Confirmed', 'Cancelled');--> statement-breakpoint
ALTER TABLE "doctorsTable" ADD COLUMN "bio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "usersTable" ADD COLUMN "profile" text;