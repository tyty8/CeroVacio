import {
  pgTable,
  uuid,
  varchar,
  text,
  real,
  timestamp,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const cargoTypeEnum = pgEnum("cargo_type", ["general", "refrigerated"]);
export const routeStatusEnum = pgEnum("route_status", ["active", "inactive", "archived", "matched"]);
export const userTypeEnum = pgEnum("user_type", ["transportista", "enviador"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  role: roleEnum("role").default("user").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationCode: varchar("verification_code", { length: 6 }),
  verificationCodeExpiresAt: timestamp("verification_code_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const routes = pgTable("routes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userType: userTypeEnum("user_type").notNull(),
  originAddress: text("origin_address").notNull(),
  originLat: real("origin_lat").notNull(),
  originLng: real("origin_lng").notNull(),
  destinationAddress: text("destination_address").notNull(),
  destinationLat: real("destination_lat").notNull(),
  destinationLng: real("destination_lng").notNull(),
  pickupWindowStart: timestamp("pickup_window_start"),
  pickupWindowEnd: timestamp("pickup_window_end"),
  cargoType: cargoTypeEnum("cargo_type"),
  palletCount: integer("pallet_count"),
  weightKg: real("weight_kg"),
  cargoDescription: text("cargo_description"),
  notes: text("notes"),
  status: routeStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
