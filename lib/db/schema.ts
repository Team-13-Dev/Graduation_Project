import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  jsonb,
  varchar,
  boolean,
  integer,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["owner", "member", "analyst", "admin"]);
export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "trialing", "canceled"]);
export const insightFrequencyEnum = pgEnum("insight_frequency", ["daily", "weekly", "monthly"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("owner").notNull(),

  companyName: text("company_name").notNull(),
  companyIndustry: text("company_industry"),
  companySize: integer("company_size"),
  companyLocation: text("company_location"),

  currency: varchar("currency", { length: 10 }).default("EGP"),
  timezone: varchar("timezone", { length: 100 }).default("EET"),
  language: varchar("language", { length: 10 }).default("en"),

  notifyEmail: boolean("notify_email").default(true),
  notifySms: boolean("notify_sms").default(false),
  notifyInApp: boolean("notify_in_app").default(true),

  insightFrequency: insightFrequencyEnum("insight_frequency").default("weekly"),
  preferredMetrics: jsonb("preferred_metrics").$type<string[]>(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  industry: text("industry"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("member").notNull(),
  permissions: jsonb("permissions").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),

  type: text("type").notNull(), // e.g. "shopify", "woocommerce", "tiktok"
  accessData: jsonb("access_data").$type<{
    storeUrl?: string;
    accessToken?: string;
    consumerKey?: string;
    consumerSecret?: string;
    accountId?: string;
    refreshToken?: string;
  }>(),
  lastSync: timestamp("last_sync"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: planEnum("plan").default("free"),
  status: subscriptionStatusEnum("status").default("trialing"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
});

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
  subscriptions: many(subscriptions),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  integrations: many(integrations),
  teamMembers: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  business: one(businesses, {
    fields: [teamMembers.businessId],
    references: [businesses.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const integrationsRelations = relations(integrations, ({ one }) => ({
  business: one(businesses, {
    fields: [integrations.businessId],
    references: [businesses.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
