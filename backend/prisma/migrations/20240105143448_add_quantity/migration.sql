/*
  Warnings:

  - Added the required column `quantit` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `quantit` INTEGER NOT NULL;
