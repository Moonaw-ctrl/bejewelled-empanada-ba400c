CREATE TABLE "wedding_responses" (
	"id" uuid PRIMARY KEY,
	"guest_1" text NOT NULL,
	"guest_2" text DEFAULT '' NOT NULL,
	"confirmed" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"synced_at" timestamp with time zone
);
