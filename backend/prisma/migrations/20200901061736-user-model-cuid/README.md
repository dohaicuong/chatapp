# Migration `20200901061736-user-model-cuid`

This migration has been generated by dohaicuong at 9/1/2020, 4:17:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
PRIMARY KEY ("id")
);
INSERT INTO "new_User" ("id", "email", "password", "name", "avatar") SELECT "id", "email", "password", "name", "avatar" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200901060410-user-model-avatar-nullable..20200901061736-user-model-cuid
--- datamodel.dml
+++ datamodel.dml
@@ -1,15 +1,15 @@
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator photon {
   provider = "prisma-client-js"
 }
 model User {
-  id       Int     @id @default(autoincrement())
+  id       String     @id @default(cuid())
   email    String  @unique
   password String
   name     String?
   avatar   String?
```


