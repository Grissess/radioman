PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`at` real,
	`moveId` integer NOT NULL,
	`commenter` integer NOT NULL,
	`comment` text NOT NULL,
	FOREIGN KEY (`moveId`) REFERENCES `movement`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`commenter`) REFERENCES `people`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_comments`("id", "at", "moveId", "commenter", "comment") SELECT "id", "at", "moveId", "commenter", "comment" FROM `comments`;--> statement-breakpoint
DROP TABLE `comments`;--> statement-breakpoint
ALTER TABLE `__new_comments` RENAME TO `comments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `comments_moveId` ON `comments` (`moveId`);--> statement-breakpoint
CREATE TABLE `__new_movement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`at` real,
	`kind` text NOT NULL,
	`radio` integer NOT NULL,
	`auditor` integer NOT NULL,
	`possessor` integer,
	FOREIGN KEY (`radio`) REFERENCES `radios`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`auditor`) REFERENCES `people`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`possessor`) REFERENCES `people`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_movement`("id", "at", "kind", "radio", "auditor", "possessor") SELECT "id", "at", "kind", "radio", "auditor", "possessor" FROM `movement`;--> statement-breakpoint
DROP TABLE `movement`;--> statement-breakpoint
ALTER TABLE `__new_movement` RENAME TO `movement`;--> statement-breakpoint
CREATE INDEX `movement_at` ON `movement` (`at`);--> statement-breakpoint
CREATE INDEX `movement_radio` ON `movement` (`radio`);--> statement-breakpoint
CREATE INDEX `movement_auditor` ON `movement` (`auditor`);--> statement-breakpoint
CREATE INDEX `movement.possessor` ON `movement` (`possessor`);