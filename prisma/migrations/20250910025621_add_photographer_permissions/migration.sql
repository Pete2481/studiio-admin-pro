-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_agents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "profileImage" TEXT,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewCalendar" BOOLEAN NOT NULL DEFAULT true,
    "viewBlankedBookings" BOOLEAN NOT NULL DEFAULT true,
    "viewAllBookings" BOOLEAN NOT NULL DEFAULT true,
    "viewInvoice" BOOLEAN NOT NULL DEFAULT true,
    "deleteGallery" BOOLEAN NOT NULL DEFAULT true,
    "viewAllGallery" BOOLEAN NOT NULL DEFAULT true,
    "viewService" BOOLEAN NOT NULL DEFAULT true,
    "addGalleries" BOOLEAN NOT NULL DEFAULT true,
    "viewClients" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "agents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "agents_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "agents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_agents" ("companyId", "createdAt", "createdBy", "email", "id", "isActive", "name", "phone", "profileImage", "role", "tenantId", "updatedAt") SELECT "companyId", "createdAt", "createdBy", "email", "id", "isActive", "name", "phone", "profileImage", "role", "tenantId", "updatedAt" FROM "agents";
DROP TABLE "agents";
ALTER TABLE "new_agents" RENAME TO "agents";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
