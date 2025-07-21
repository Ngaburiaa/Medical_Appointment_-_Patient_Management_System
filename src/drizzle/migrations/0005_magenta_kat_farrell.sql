CREATE TYPE "public"."prescription_status_enum" AS ENUM('active', 'expired', 'cancelled', 'refilled');--> statement-breakpoint
CREATE TABLE "prescriptionItemsTable" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"prescription_id" integer NOT NULL,
	"drug_name" text NOT NULL,
	"dosage" text NOT NULL,
	"route" text NOT NULL,
	"frequency" text NOT NULL,
	"duration" text NOT NULL,
	"instructions" text,
	"substitution_allowed" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD COLUMN "diagnosis" text;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD COLUMN "issued_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD COLUMN "status" "prescription_status_enum" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "prescriptionItemsTable" ADD CONSTRAINT "prescriptionItemsTable_prescription_id_prescriptionsTable_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptionsTable"("prescription_id") ON DELETE cascade ON UPDATE no action;