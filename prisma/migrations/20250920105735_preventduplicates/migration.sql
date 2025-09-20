/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId,type]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId,type]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_movieId_type_key" ON "public"."Favorite"("userId", "movieId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_movieId_type_key" ON "public"."Watchlist"("userId", "movieId", "type");
