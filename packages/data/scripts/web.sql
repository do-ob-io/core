CREATE TABLE IF NOT EXISTS "thing" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"url" varchar(2083),
	"same_as" varchar(2083),
	"identifier" varchar(255),
	"image" varchar(2083),
	"additional_type" varchar(2083),
	"alternate_name" varchar(255),
	"disambiguating_description" text,
	"main_entity_of_page" varchar(2083),
	"date_created" timestamp DEFAULT now(),
	"date_modified" timestamp DEFAULT now()
);
