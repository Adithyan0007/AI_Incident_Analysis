/*
  Warnings:

  - Added the required column `incidentId` to the `AgentRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentRun" ADD COLUMN     "incidentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
