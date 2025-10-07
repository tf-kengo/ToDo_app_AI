-- CreateTable
CREATE TABLE `Todo_list` (
    `id` VARCHAR(191) NOT NULL,
    `todoTitle` VARCHAR(30) NOT NULL,
    `todoText` VARCHAR(100) NOT NULL,
    `endTime` DATE NULL,

    UNIQUE INDEX `Todo_list_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
