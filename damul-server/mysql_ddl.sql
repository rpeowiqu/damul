use damul;

SET FOREIGN_KEY_CHECKS = 0;
SET restrict_fk_on_non_standard_key = OFF;

DROP TABLE IF EXISTS `user_badge`;

CREATE TABLE `user_badge` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`badgeId`	INT	NOT NULL,
	`userId`	INT	NOT NULL,
	`level`	TINYINT	NOT NULL,
	`count`	INT	NOT NULL
);

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`nickname`	VARCHAR(50)	NOT NULL UNIQUE,
	`email`	VARCHAR(255)	NOT NULL UNIQUE,
	`profile_image_url`	TEXT	NULL,
	`profile_background_image_url`	TEXT	NULL,
	`provider`	ENUM('GOOGLE', 'KAKAO', 'NAVER')	NOT NULL,
	`role`	ENUM('ADMIN', 'USER')	NOT NULL	DEFAULT 'USER',
	`created_at`	DATETIME	NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	DATETIME	NULL,
	`last_login_at`	DATETIME	NULL,
	`is_active`	BOOLEAN	NULL	DEFAULT TRUE,
	`report_count`	TINYINT	NULL	DEFAULT 0,
	`self_introduction`	VARCHAR(255)	NULL,
	`is_fridge_public`	TINYINT	NOT NULL	DEFAULT 1,
	`is_warning`	TINYINT	NOT NULL	DEFAULT 1
);

DROP TABLE IF EXISTS `recipes`;

CREATE TABLE `recipes` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`writer_id`	INT	NOT NULL,
	`title`	VARCHAR(200)	NOT NULL,
	`content`	TEXT	NOT NULL,
	`thumbnail_url`	VARCHAR(255)	NULL,
	`view_cnt`	INT	NOT NULL	DEFAULT 0,
	`like_cnt`	INT	NOT NULL	DEFAULT 0,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	DATETIME	NULL,
	`is_deleted`	TINYINT	NOT NULL	DEFAULT 0
);

DROP TABLE IF EXISTS `user_receipts`;

CREATE TABLE `user_receipts` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	INT	NOT NULL,
	`store_name`	VARCHAR(100)	NULL,
	`purchase_at`	DATETIME	NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `follows`;

CREATE TABLE `follows` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`follower_id`	INT	NOT NULL,
	`following_id`	INT	NOT NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `recipe_steps`;

CREATE TABLE `recipe_steps` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`recipe_id`	INT	NOT NULL,
	`step_number`	INT	NOT NULL	DEFAULT 0,
	`content`	TEXT	NULL,
	`image_url`	VARCHAR(255)	NULL
);

DROP TABLE IF EXISTS `report`;

CREATE TABLE `report` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`reporter_id`	INT	NOT NULL,
	`category_id`	INT	NOT NULL,
	`report_type`	ENUM('RECIPE', 'COMMENT', 'POST')	NOT NULL,
	`target_id`	INT	NOT NULL,
	`description`	TEXT	NULL,
	`status`	ENUM('PENDING', 'RESOLVED', 'REJECTED')	NOT NULL	DEFAULT 'PENDING',
	`report_image_url`	TEXT	NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`resolved_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `terms_and_conditions`;

CREATE TABLE `terms_and_conditions` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
	`content`	TEXT	NOT NULL
);

DROP TABLE IF EXISTS `user_ingredients`;

CREATE TABLE `user_ingredients` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`receipt_id`	INT	NOT NULL,
	`category_id`	INT	NOT NULL,
	`ingredient_quantity`	INT	NOT NULL	DEFAULT 100,
	`ingredient_up`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`ingredient_name`	VARCHAR(100)	NOT NULL,
	`due_date`	DATETIME	NOT NULL,
	`ingredient_storage`	ENUM('FROZEN', 'REFRIGERATED', 'ROOM_TEMPERATURE')	NOT NULL,
	`Field`	VARCHAR(255)	NULL
);

DROP TABLE IF EXISTS `recipe_ingredients`;

CREATE TABLE `recipe_ingredients` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`recipe_id`	INT	NOT NULL,
	`ingredient_name`	VARCHAR(50)	NOT NULL,
	`amount`	DECIMAL(5,1)	NOT NULL,
	`unit`	VARCHAR(10)	NULL,
	`ingredient_order`	INT	NOT NULL	DEFAULT 0
);

DROP TABLE IF EXISTS `post_images`;

CREATE TABLE `post_images` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`post_id`	INT	NOT NULL,
	`image_url`	VARCHAR(255)	NULL,
	`created_at`	DATETIME	NOT NULL
);

DROP TABLE IF EXISTS `badge`;

CREATE TABLE `badge` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name`	VARCHAR(100)	NOT NULL,
	`standard`	SMALLINT	NOT NULL,
	`description`	VARCHAR(255)	NOT NULL
);

DROP TABLE IF EXISTS `recipe_comments`;

CREATE TABLE `recipe_comments` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`recipe_id`	INT	NOT NULL,
	`writer_id`	INT	NOT NULL,
	`parent_id`	INT	NULL,
	`comment`	TEXT	NOT NULL,
	`depth`	TINYINT	NOT NULL	DEFAULT 0,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`is_deleted`	TINYINT	NOT NULL	DEFAULT 0
);

DROP TABLE IF EXISTS `report_category`;

CREATE TABLE `report_category` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name`	VARCHAR(10)	NOT NULL
);

DROP TABLE IF EXISTS `bookmarks`;

CREATE TABLE `bookmarks` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`recipe_id`	INT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `recipe_like`;

CREATE TABLE `recipe_like` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`recipe_id`	INT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `chart_ingredients`;

CREATE TABLE `chart_ingredients` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`category_id`	INT	NOT NULL,
	`indegrient_name`	VARCHAR(50)	NOT NULL UNIQUE,
	`ingredient_num`	INT	NOT NULL,
	`ingredient_unit`	VARCHAR(20)	NULL
);

DROP TABLE IF EXISTS `post_comments`;

CREATE TABLE `post_comments` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`post_id`	INT	NOT NULL,
	`writer_id`	INT	NOT NULL,
	`parent_id`	INT	NULL,
	`comment`	TEXT	NOT NULL,
	`depth`	TINYINT	NOT NULL	DEFAULT 0,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	DATETIME	NULL,
	`is_deleted`	TINYINT	NOT NULL
);

DROP TABLE IF EXISTS `food_categories`;

CREATE TABLE `food_categories` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`category_name`	VARCHAR(10)	NOT NULL UNIQUE
);

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`writer_id`	INT	NOT NULL,
	`title`	VARCHAR(200)	NOT NULL,
	`content`	TEXT	NOT NULL,
	`post_type`	ENUM('GROUP_PURCHASE', 'SHARE')	NOT NULL,
	`status`	ENUM('ACTIVE', 'COMPLETED', 'DELETED')	NOT NULL	DEFAULT 'ACTIVE',
	`view_cnt`	INT	NOT NULL	DEFAULT 0,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `chat_rooms`;

CREATE TABLE `chat_rooms` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`creator_id`	INT	NULL,
	`post_id`	INT	NULL,
	`room_name`	VARCHAR(100)	NOT NULL,
	`room_type`	ENUM('PRIVATE', 'GROUP')	NOT NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`status`	ENUM('ACTIVE', 'INACTIVE')	NOT NULL	DEFAULT 'ACTIVE',
	`member_limit`	TINYINT	NOT NULL	DEFAULT 2
);

DROP TABLE IF EXISTS `recipe_tags`;

CREATE TABLE `recipe_tags` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`recipe_id`	INT	NOT NULL,
	`tag_id`	INT	NOT NULL
);

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`tag_name`	VARCHAR(30)	NOT NULL UNIQUE
);

DROP TABLE IF EXISTS `chat_room_members`;

CREATE TABLE `chat_room_members` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`room_id`	INT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL,
	`role`	ENUM('ADMIN', 'MEMBER')	NOT NULL	DEFAULT 'MEMBER',
	`joined_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`last_read_message_id`	INT	NOT NULL	DEFAULT 0
);

DROP TABLE IF EXISTS `food_preference`;

CREATE TABLE `food_preference` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	INT	NOT NULL,
	`category_id`	INT	NOT NULL,
	`category_preference`	INT	NOT NULL
);

DROP TABLE IF EXISTS `chat_messages`;

CREATE TABLE `chat_messages` (
	`id`	INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`room_id`	INT	NOT NULL,
	`sender_id`	INT	NOT NULL,
	`message_type`	ENUM('TEXT', 'IMAGE', 'FILE')	NOT NULL	DEFAULT 'TEXT',
	`content`	TEXT	NOT NULL,
	`file_url`	VARCHAR(255)	NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `user_badge` ADD CONSTRAINT `FK_badge_TO_user_badge_1` FOREIGN KEY (
	`badgeId`
)
REFERENCES `badge` (
	`id`
);

ALTER TABLE `user_badge` ADD CONSTRAINT `FK_users_TO_user_badge_1` FOREIGN KEY (
	`userId`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `recipes` ADD CONSTRAINT `FK_users_TO_recipes_1` FOREIGN KEY (
	`writer_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `user_receipts` ADD CONSTRAINT `FK_users_TO_user_receipts_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `follows` ADD CONSTRAINT `FK_users_TO_follows_1` FOREIGN KEY (
	`follower_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `follows` ADD CONSTRAINT `FK_users_TO_follows_2` FOREIGN KEY (
	`following_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `recipe_steps` ADD CONSTRAINT `FK_recipes_TO_recipe_steps_1` FOREIGN KEY (
	`recipe_id`
)
REFERENCES `recipes` (
	`id`
);

ALTER TABLE `report` ADD CONSTRAINT `FK_users_TO_report_1` FOREIGN KEY (
	`reporter_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `report` ADD CONSTRAINT `FK_report_category_TO_report_1` FOREIGN KEY (
	`category_id`
)
REFERENCES `report_category` (
	`id`
);

ALTER TABLE `user_ingredients` ADD CONSTRAINT `FK_user_receipts_TO_user_ingredients_1` FOREIGN KEY (
	`receipt_id`
)
REFERENCES `user_receipts` (
	`id`
);

ALTER TABLE `user_ingredients` ADD CONSTRAINT `FK_food_categories_TO_user_ingredients_1` FOREIGN KEY (
	`category_id`
)
REFERENCES `food_categories` (
	`id`
);

ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `FK_recipes_TO_recipe_ingredients_1` FOREIGN KEY (
	`recipe_id`
)
REFERENCES `recipes` (
	`id`
);

ALTER TABLE `post_images` ADD CONSTRAINT `FK_posts_TO_post_images_1` FOREIGN KEY (
	`post_id`
)
REFERENCES `posts` (
	`id`
);

ALTER TABLE `recipe_comments` ADD CONSTRAINT `FK_recipes_TO_recipe_comments_1` FOREIGN KEY (
	`recipe_id`
)
REFERENCES `recipes` (
	`id`
);

ALTER TABLE `recipe_comments` ADD CONSTRAINT `FK_users_TO_recipe_comments_1` FOREIGN KEY (
	`writer_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `recipe_comments` ADD CONSTRAINT `FK_recipe_comments_TO_recipe_comments_1` FOREIGN KEY (
	`parent_id`
)
REFERENCES `recipe_comments` (
	`id`
);

ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_users_TO_bookmarks_1` FOREIGN KEY (
	`recipe_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_recipes_TO_bookmarks_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `recipes` (
	`id`
);

ALTER TABLE `recipe_like` ADD CONSTRAINT `FK_users_TO_recipe_like_1` FOREIGN KEY (
	`recipe_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `recipe_like` ADD CONSTRAINT `FK_recipes_TO_recipe_like_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `recipes` (
	`id`
);

ALTER TABLE `chart_ingredients` ADD CONSTRAINT `FK_food_categories_TO_chart_ingredients_1` FOREIGN KEY (
	`category_id`
)
REFERENCES `food_categories` (
	`id`
);

ALTER TABLE `post_comments` ADD CONSTRAINT `FK_posts_TO_post_comments_1` FOREIGN KEY (
	`post_id`
)
REFERENCES `posts` (
	`id`
);

ALTER TABLE `post_comments` ADD CONSTRAINT `FK_users_TO_post_comments_1` FOREIGN KEY (
	`writer_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `post_comments` ADD CONSTRAINT `FK_post_comments_TO_post_comments_1` FOREIGN KEY (
	`parent_id`
)
REFERENCES `post_comments` (
	`id`
);

ALTER TABLE `posts` ADD CONSTRAINT `FK_users_TO_posts_1` FOREIGN KEY (
	`writer_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `chat_rooms` ADD CONSTRAINT `FK_users_TO_chat_rooms_1` FOREIGN KEY (
	`creator_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `chat_rooms` ADD CONSTRAINT `FK_posts_TO_chat_rooms_1` FOREIGN KEY (
	`post_id`
)
REFERENCES `posts` (
	`id`
);

ALTER TABLE `recipe_tags` ADD CONSTRAINT `FK_recipes_TO_recipe_tags_1` FOREIGN KEY (
	`recipe_id`
)
REFERENCES `recipes` (
	`id`
);

ALTER TABLE `recipe_tags` ADD CONSTRAINT `FK_tags_TO_recipe_tags_1` FOREIGN KEY (
	`tag_id`
)
REFERENCES `tags` (
	`id`
);

ALTER TABLE `chat_room_members` ADD CONSTRAINT `FK_chat_rooms_TO_chat_room_members_1` FOREIGN KEY (
	`room_id`
)
REFERENCES `chat_rooms` (
	`id`
);

ALTER TABLE `chat_room_members` ADD CONSTRAINT `FK_users_TO_chat_room_members_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `food_preference` ADD CONSTRAINT `FK_users_TO_food_preference_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `food_preference` ADD CONSTRAINT `FK_food_categories_TO_food_preference_1` FOREIGN KEY (
	`category_id`
)
REFERENCES `food_categories` (
	`id`
);

ALTER TABLE `chat_messages` ADD CONSTRAINT `FK_chat_rooms_TO_chat_messages_1` FOREIGN KEY (
	`room_id`
)
REFERENCES `chat_rooms` (
	`id`
);

ALTER TABLE `chat_messages` ADD CONSTRAINT `FK_users_TO_chat_messages_1` FOREIGN KEY (
	`sender_id`
)
REFERENCES `users` (
	`id`
);

SET restrict_fk_on_non_standard_key = ON;
SET FOREIGN_KEY_CHECKS = 1;