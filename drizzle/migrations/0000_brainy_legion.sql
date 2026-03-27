CREATE TYPE "public"."cargo_type" AS ENUM('general', 'refrigerated');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."route_status" AS ENUM('active', 'inactive', 'archived', 'matched');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('transportista', 'enviador');--> statement-breakpoint
CREATE TABLE "match_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coord_key" varchar(100) NOT NULL,
	"match_count" integer NOT NULL,
	"tomorrow_count" integer,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "match_cache_coord_key_unique" UNIQUE("coord_key")
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"user_type" "user_type" NOT NULL,
	"origin_address" text NOT NULL,
	"origin_lat" real NOT NULL,
	"origin_lng" real NOT NULL,
	"destination_address" text NOT NULL,
	"destination_lat" real NOT NULL,
	"destination_lng" real NOT NULL,
	"pickup_window_start" timestamp,
	"pickup_window_end" timestamp,
	"cargo_type" "cargo_type",
	"pallet_count" integer,
	"weight_kg" real,
	"cargo_description" text,
	"notes" text,
	"status" "route_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"role" "role" DEFAULT 'user' NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verification_code" varchar(6),
	"verification_code_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;