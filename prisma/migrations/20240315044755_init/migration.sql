-- CreateTable
CREATE TABLE `User` (
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Institutes` (
    `institute_id` INTEGER NOT NULL AUTO_INCREMENT,
    `institute_initial` VARCHAR(191) NOT NULL,
    `institute_name` VARCHAR(191) NOT NULL,
    `institute_type` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `from` INTEGER NOT NULL,
    `to` INTEGER NOT NULL,
    `contact_number` INTEGER NOT NULL,

    UNIQUE INDEX `Institutes_institute_initial_key`(`institute_initial`),
    PRIMARY KEY (`institute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subjects` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `institute_type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `institute_id` INTEGER NOT NULL,

    UNIQUE INDEX `Subjects_name_key`(`name`),
    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `Institutes`(`institute_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
