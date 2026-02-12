CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`at` real,
	`moveId` integer NOT NULL,
	`commenter` integer NOT NULL,
	`comment` text NOT NULL,
	FOREIGN KEY (`moveId`) REFERENCES `movement`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`commenter`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `comments_moveId` ON `comments` (`moveId`);--> statement-breakpoint
CREATE TABLE `movement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`at` real,
	`kind` text NOT NULL,
	`radio` integer NOT NULL,
	`auditor` integer NOT NULL,
	`possessor` integer,
	FOREIGN KEY (`radio`) REFERENCES `radios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`auditor`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`possessor`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `movement_at` ON `movement` (`at`);--> statement-breakpoint
CREATE INDEX `movement_radio` ON `movement` (`radio`);--> statement-breakpoint
CREATE INDEX `movement_auditor` ON `movement` (`auditor`);--> statement-breakpoint
CREATE INDEX `movement.possessor` ON `movement` (`possessor`);--> statement-breakpoint
CREATE TABLE `people` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dispName` text NOT NULL,
	`realName` text NOT NULL,
	`phone` text,
	`email` text,
	`discord` text
);
--> statement-breakpoint
CREATE INDEX `people_dispName` ON `people` (`dispName`);--> statement-breakpoint
CREATE INDEX `people_realName` ON `people` (`realName`);--> statement-breakpoint
CREATE TABLE `radios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`identifier` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `radios_identifier` ON `radios` (`identifier`);