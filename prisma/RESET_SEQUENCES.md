# Database Sequence Reset

## Problem
When you delete data from PostgreSQL tables and create new data, the auto-increment IDs don't start from 1. This is because PostgreSQL uses sequences that continue from where they left off, even after data is deleted.

## Solution
Run the reset sequences script after deleting data:

```bash
npx tsx prisma/reset-sequences.ts
```

This will reset all table sequences (StudyLevel, Unit, Lesson, Word) back to 1, so the next record created will have ID 1.

## When to Use
- After deleting all data from the database
- When you want IDs to start from 1 again
- After running database migrations that clear data

## Important Notes
- This script is safe to run on an empty database
- Run this AFTER deleting data but BEFORE creating new data
- This only affects future inserts, not existing data
