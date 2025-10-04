-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_words" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "en" TEXT NOT NULL,
    "ar" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "lessonId" INTEGER NOT NULL,
    CONSTRAINT "words_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_words" ("ar", "category", "en", "id", "lessonId", "part") SELECT "ar", "category", "en", "id", "lessonId", "part" FROM "words";
DROP TABLE "words";
ALTER TABLE "new_words" RENAME TO "words";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
