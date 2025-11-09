/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Fridge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Fridge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FridgeItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    "itemId" INTEGER NOT NULL,
    "fridgeId" INTEGER NOT NULL,
    CONSTRAINT "FridgeItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FridgeItem_fridgeId_fkey" FOREIGN KEY ("fridgeId") REFERENCES "Fridge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NutritionalValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "servingSize" TEXT NOT NULL,
    "calories" REAL NOT NULL DEFAULT 0,
    "totalFat" REAL NOT NULL DEFAULT 0,
    "saturatedFat" REAL NOT NULL DEFAULT 0,
    "transFat" REAL NOT NULL DEFAULT 0,
    "protein" REAL NOT NULL DEFAULT 0,
    "cholesterol" REAL NOT NULL DEFAULT 0,
    "sodium" REAL NOT NULL DEFAULT 0,
    "totalCarbohydrate" REAL NOT NULL DEFAULT 0,
    "dietaryFiber" REAL NOT NULL DEFAULT 0,
    "totalSugars" REAL NOT NULL DEFAULT 0,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "NutritionalValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RecipeItem" (
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    PRIMARY KEY ("recipeId", "itemId"),
    CONSTRAINT "RecipeItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("email", "id") SELECT "email", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Fridge_userId_key" ON "Fridge"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionalValue_itemId_key" ON "NutritionalValue"("itemId");
