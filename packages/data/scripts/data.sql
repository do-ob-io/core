DO $$ BEGIN
 CREATE TYPE "public"."dispatch_status" AS ENUM('success', 'rejected', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."mutate_operation" AS ENUM('insert', 'update', 'remove');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."system_type" AS ENUM('boolean', 'number', 'string');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "action" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"definition" jsonb NOT NULL,
	"description" varchar(1024)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dispatch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"action_id" varchar(64) NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"initiate" timestamp DEFAULT now() NOT NULL,
	"payload" jsonb,
	"status" "dispatch_status" DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_credential" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" varchar(64) NOT NULL,
	"aaguid" varchar(128),
	"agent_name" varchar(256) NOT NULL,
	"public_key" text NOT NULL,
	"algorithm" smallint NOT NULL,
	"subject_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_email" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"address" varchar(255) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "entity_email_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_locale" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(8) NOT NULL,
	"name" varchar(1024) NOT NULL,
	"content" text,
	CONSTRAINT "entity_locale_code_name_unique" UNIQUE("code","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permit" (
	"id" uuid PRIMARY KEY NOT NULL,
	"entity_id" uuid NOT NULL,
	"action_id" varchar(64) NOT NULL,
	"ambit" smallint DEFAULT 0,
	"rate" smallint DEFAULT 0,
	CONSTRAINT "permit_entity_id_action_id_unique" UNIQUE("entity_id","action_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_phone" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"country_code" varchar(3) NOT NULL,
	"number" varchar(14) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"given_name" varchar(128),
	"family_name" varchar(128),
	"additional_name" varchar(128),
	"honorific_prefix" varchar(32),
	"honorific_suffix" varchar(32),
	"sex" varchar(1),
	"gender" varchar(128),
	"birth_date" timestamp,
	"death_date" timestamp,
	"picture_id" uuid,
	"cover_id" uuid,
	"biography" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_role" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"description" varchar(1024),
	"color" varchar(7),
	"icon" varchar(256),
	"avatar_id" uuid,
	CONSTRAINT "entity_role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"locked" boolean DEFAULT false NOT NULL,
	"last_login" timestamp,
	"avatar_id" uuid,
	CONSTRAINT "entity_user_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(64),
	"created" timestamp DEFAULT now() NOT NULL,
	"updated" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"owner_id" uuid,
	"creator_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_file_audio" (
	"id" uuid PRIMARY KEY NOT NULL,
	"length" integer NOT NULL,
	"volume" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_file_image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"height" smallint NOT NULL,
	"width" smallint NOT NULL,
	"animated" boolean DEFAULT false NOT NULL,
	"frames" smallint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_file_video" (
	"id" uuid PRIMARY KEY NOT NULL,
	"height" smallint NOT NULL,
	"width" smallint NOT NULL,
	"length" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_file" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"description" varchar(1024),
	"mime_type" varchar(64) NOT NULL,
	"size" bigint NOT NULL,
	"path" varchar(2048),
	CONSTRAINT "entity_file_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "join_assignment" (
	"entity_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "join_assignment_entity_id_role_id_pk" PRIMARY KEY("entity_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entitle" (
	"entity_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"action_id" varchar(64) NOT NULL,
	CONSTRAINT "entitle_entity_id_target_id_action_id_pk" PRIMARY KEY("entity_id","target_id","action_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mutate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispatch_id" uuid NOT NULL,
	"record_id" uuid NOT NULL,
	"table" varchar NOT NULL,
	"operation" "mutate_operation" NOT NULL,
	"occurred" timestamp DEFAULT now() NOT NULL,
	"mutation" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" uuid NOT NULL,
	"credential" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storage" (
	"slug" varchar PRIMARY KEY NOT NULL,
	"data" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" "system_type" NOT NULL,
	"value" text NOT NULL,
	"description" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_subject_id_entity_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_credential" ADD CONSTRAINT "entity_credential_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_credential" ADD CONSTRAINT "entity_credential_subject_id_entity_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_email" ADD CONSTRAINT "entity_email_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_email" ADD CONSTRAINT "entity_email_user_id_entity_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."entity_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_locale" ADD CONSTRAINT "entity_locale_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permit" ADD CONSTRAINT "permit_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permit" ADD CONSTRAINT "permit_entity_id_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permit" ADD CONSTRAINT "permit_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_phone" ADD CONSTRAINT "entity_phone_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_phone" ADD CONSTRAINT "entity_phone_user_id_entity_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."entity_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_profile" ADD CONSTRAINT "entity_profile_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_profile" ADD CONSTRAINT "entity_profile_user_id_entity_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."entity_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_profile" ADD CONSTRAINT "entity_profile_picture_id_entity_file_image_id_fk" FOREIGN KEY ("picture_id") REFERENCES "public"."entity_file_image"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_profile" ADD CONSTRAINT "entity_profile_cover_id_entity_file_image_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."entity_file_image"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_role" ADD CONSTRAINT "entity_role_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_role" ADD CONSTRAINT "entity_role_avatar_id_entity_file_image_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."entity_file_image"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_user" ADD CONSTRAINT "entity_user_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_user" ADD CONSTRAINT "entity_user_avatar_id_entity_file_image_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."entity_file_image"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_file_audio" ADD CONSTRAINT "entity_file_audio_id_entity_file_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_file_image" ADD CONSTRAINT "entity_file_image_id_entity_file_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_file_video" ADD CONSTRAINT "entity_file_video_id_entity_file_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_file" ADD CONSTRAINT "entity_file_id_entity_id_fk" FOREIGN KEY ("id") REFERENCES "public"."entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "join_assignment" ADD CONSTRAINT "join_assignment_entity_id_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "join_assignment" ADD CONSTRAINT "join_assignment_role_id_entity_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."entity_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entitle" ADD CONSTRAINT "entitle_entity_id_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entitle" ADD CONSTRAINT "entitle_target_id_entity_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entitle" ADD CONSTRAINT "entitle_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mutate" ADD CONSTRAINT "mutate_dispatch_id_dispatch_id_fk" FOREIGN KEY ("dispatch_id") REFERENCES "public"."dispatch"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mutate" ADD CONSTRAINT "mutate_record_id_entity_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_client_id_idx" ON "entity_credential" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_address_idx" ON "entity_email" USING btree ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locale_code_idx" ON "entity_locale" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locale_name_idx" ON "entity_locale" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_given_name_idx" ON "entity_profile" USING btree ("given_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_family_name_idx" ON "entity_profile" USING btree ("family_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_name_idx" ON "entity_user" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_name_idx" ON "entity_file" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_path_idx" ON "entity_file" USING btree ("path");