-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TENTATIVE',
    "clientId" TEXT,
    "agentId" TEXT,
    "photographerId" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "durationM" INTEGER NOT NULL DEFAULT 60,
    "services" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "agents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("address", "agentId", "clientId", "createdAt", "createdBy", "durationM", "end", "id", "notes", "services", "start", "status", "tenantId", "title", "updatedAt") SELECT "address", "agentId", "clientId", "createdAt", "createdBy", "durationM", "end", "id", "notes", "services", "start", "status", "tenantId", "title", "updatedAt" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
