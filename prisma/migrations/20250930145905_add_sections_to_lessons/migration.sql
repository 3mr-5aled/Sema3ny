/*
  Warnings:

  - You are about to drop the column `section` on the `words` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN "sections" TEXT DEFAULT '["Key Words", "Additional Words"]';

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_words" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "en" TEXT NOT NULL,
    "ar" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,
    CONSTRAINT "words_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_words" ("ar", "category", "en", "id", "lessonId", "part") SELECT "ar", "category", "en", "id", "lessonId", "part" FROM "words";
DROP TABLE "words";
ALTER TABLE "new_words" RENAME TO "words";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
