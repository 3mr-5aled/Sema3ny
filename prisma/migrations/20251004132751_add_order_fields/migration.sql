-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_grades" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_grades" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "grades";
DROP TABLE "grades";
ALTER TABLE "new_grades" RENAME TO "grades";
CREATE UNIQUE INDEX "grades_slug_key" ON "grades"("slug");
CREATE TABLE "new_lessons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "sections" TEXT DEFAULT '[]',
    "unitId" INTEGER NOT NULL,
    CONSTRAINT "lessons_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lessons" ("id", "name", "sections", "unitId") SELECT "id", "name", "sections", "unitId" FROM "lessons";
DROP TABLE "lessons";
ALTER TABLE "new_lessons" RENAME TO "lessons";
CREATE TABLE "new_units" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gradeId" INTEGER NOT NULL,
    CONSTRAINT "units_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_units" ("gradeId", "id", "name") SELECT "gradeId", "id", "name" FROM "units";
DROP TABLE "units";
ALTER TABLE "new_units" RENAME TO "units";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
