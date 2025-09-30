/*
  Warnings:

  - Added the required column `slug` to the `study_levels` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_study_levels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_study_levels" ("id", "name") SELECT "id", "name" FROM "study_levels";
DROP TABLE "study_levels";
ALTER TABLE "new_study_levels" RENAME TO "study_levels";
CREATE UNIQUE INDEX "study_levels_slug_key" ON "study_levels"("slug");
CREATE TABLE "new_words" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "en" TEXT NOT NULL,
    "ar" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'vocabulary',
    "lessonId" INTEGER NOT NULL,
    CONSTRAINT "words_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_words" ("ar", "category", "en", "id", "lessonId", "part") SELECT "ar", "category", "en", "id", "lessonId", "part" FROM "words";
DROP TABLE "words";
ALTER TABLE "new_words" RENAME TO "words";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
