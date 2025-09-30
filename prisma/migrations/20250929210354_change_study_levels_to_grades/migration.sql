/*
  Warnings:

  - You are about to drop the `study_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `studyLevelId` on the `units` table. All the data in the column will be lost.
  - Added the required column `gradeId` to the `units` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "study_levels_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "study_levels";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "grades" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_units" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gradeId" INTEGER NOT NULL,
    CONSTRAINT "units_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_units" ("id", "name") SELECT "id", "name" FROM "units";
DROP TABLE "units";
ALTER TABLE "new_units" RENAME TO "units";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "grades_slug_key" ON "grades"("slug");
