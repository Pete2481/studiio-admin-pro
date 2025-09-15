# Database Wiring Documentation

This document describes the database integration implementation for the Studiio multi-tenant RBAC system.

## Architecture Overview

The application uses a **Repository Pattern** with **Server Actions** and **RBAC Guards** to provide a secure, type-safe database layer.

### Directory Structure

```
src/
├── server/
│   ├── repos/           # Repository layer (pure Prisma calls)
│   │   ├── base.repo.ts
│   │   ├── jobs.repo.ts
│   │   ├── clients.repo.ts
│   │   ├── galleries.repo.ts
│   │   ├── invoices.repo.ts
│   │   └── assignments.repo.ts
│   └── actions/         # Server Actions (RBAC + validation)
│       ├── bookings.actions.ts
│       ├── clients.actions.ts
│       ├── galleries.actions.ts
│       └── invoices.actions.ts
├── client/
│   └── api/            # Client-side hooks
│       └── bookings.ts
└── server/repos/
    └── types.ts        # Shared types and schemas
```

## Repository Pattern

### Base Repository

All repositories extend `BaseRepository` which provides:

- **Tenant Guard**: Ensures all operations are scoped to a valid tenant
- **Audit Logging**: Automatic audit trail for all state changes
- **Prisma Client**: Singleton database connection

```typescript
export class BaseRepository {
  protected async withTenantGuard<T>(
    tenantId: string,
    operation: () => Promise<T>
  ): Promise<T>

  protected async auditLog(
    actorUserId: string,
    tenantId: string,
    action: string,
    entity: string,
    entityId: string,
    diff?: any
  )
}
```

### Repository Examples

#### Jobs Repository

```typescript
export class JobsRepository extends BaseRepository {
  async create(tenantId: string, createdBy: string, data: CreateBookingData)
  async listByRange(tenantId: string, range: DateRange, opts?: FilterOptions)
  async update(bookingId: string, tenantId: string, updatedBy: string, data: UpdateBookingData)
  async setStatus(bookingId: string, tenantId: string, updatedBy: string, status: BookingStatus)
  async cancel(bookingId: string, tenantId: string, cancelledBy: string)
}
```

#### Clients Repository

```typescript
export class ClientsRepository extends BaseRepository {
  async create(tenantId: string, createdBy: string, data: CreateClientData)
  async search(tenantId: string, query: string, limit: number)
  async softDelete(clientId: string, tenantId: string, deletedBy: string)
  async restore(clientId: string, tenantId: string, restoredBy: string)
}
```

## Server Actions

Server Actions provide the API layer with:

- **RBAC Guards**: Role-based access control
- **Input Validation**: Zod schema validation
- **Error Handling**: Standardized error responses
- **Cache Revalidation**: Automatic Next.js cache invalidation

### Action Structure

```typescript
export async function createBooking(
  tenantId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    await requireTenantRole(tenantId, ["SUB_ADMIN", "CLIENT"]);
    
    const validatedData = CreateBookingSchema.parse(data);
    const booking = await jobsRepo.create(tenantId, user.id, validatedData);
    
    revalidatePath(`/t/${tenantId}/bookings`);
    
    return { ok: true, data: booking };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
```

### RBAC Guards

- `requireTenantRole(tenantId, roles[])`: Ensures user has one of the specified roles
- `hasRole(tenantId, role)`: Checks if user has a specific role
- `getCurrentUser()`: Gets authenticated user or redirects to login

### Available Actions

#### Bookings
- `createBooking(tenantId, data)`
- `updateBooking(tenantId, bookingId, data)`
- `cancelBooking(tenantId, bookingId)`
- `assignUser(tenantId, bookingId, data)`
- `unassignUser(tenantId, bookingId, userId, role)`
- `getBookingsByRange(tenantId, from, to, opts)`
- `getBooking(tenantId, bookingId)`

#### Clients
- `createClient(tenantId, data)`
- `updateClient(tenantId, clientId, data)`
- `deleteClient(tenantId, clientId)`
- `restoreClient(tenantId, clientId)`
- `getClients(tenantId, params)`
- `searchClients(tenantId, query, limit)`

#### Galleries
- `createGallery(tenantId, data)`
- `updateGallery(tenantId, galleryId, data)`
- `addAsset(tenantId, galleryId, data)`
- `removeAsset(tenantId, assetId)`
- `extendExpiry(tenantId, galleryId, newExpiry)`
- `getGalleries(tenantId, params)`
- `getPublicGallery(publicId)` - No auth required

#### Invoices
- `createInvoice(tenantId, data)`
- `updateInvoiceStatus(tenantId, invoiceId, status)`
- `updateInvoice(tenantId, invoiceId, data)`
- `getInvoices(tenantId, params)`
- `getInvoiceStats(tenantId)`

## Client-Side Hooks

React hooks provide a clean interface for client components:

```typescript
export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (tenantId: string, data: CreateBookingData) => {
    // Implementation with loading states and error handling
  };

  return { mutate, isLoading, error };
}
```

### Available Hooks

- `useCreateBooking()`
- `useUpdateBooking()`
- `useCancelBooking()`
- `useAssignUser()`
- `useUnassignUser()`
- `useBookingsByRange()`
- `useBooking()`

## Data Models

### Core Entities

#### Booking (Job)
```typescript
{
  id: string
  title: string
  start: Date
  end: Date
  status: "TENTATIVE" | "CONFIRMED" | "PENCILED" | "CANCELLED" | "REQUEST"
  clientId?: string
  address?: string
  notes?: string
  durationM: number
  tenantId: string
  createdBy: string
  client?: Client
  assignments?: Assignment[]
  galleries?: Gallery[]
}
```

#### Client
```typescript
{
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  isActive: boolean
  tenantId: string
  createdBy: string
  bookings?: Booking[]
  invoices?: Invoice[]
}
```

#### Gallery
```typescript
{
  id: string
  title: string
  description?: string
  publicId: string
  isPublic: boolean
  expiresAt?: Date
  accessPolicy?: string
  bookingId?: string
  tenantId: string
  createdBy: string
  images?: GalleryImage[]
}
```

#### Invoice
```typescript
{
  id: string
  invoiceNumber: string
  amountCents: number
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
  dueDate?: Date
  clientId?: string
  tenantId: string
  createdBy: string
  client?: Client
}
```

## Adding New Actions

### 1. Define Types

Add to `src/server/repos/types.ts`:

```typescript
export const CreateNewEntitySchema = z.object({
  name: z.string().min(1),
  // ... other fields
});

export type CreateNewEntityData = z.infer<typeof CreateNewEntitySchema>;
```

### 2. Create Repository

Create `src/server/repos/new-entity.repo.ts`:

```typescript
export class NewEntityRepository extends BaseRepository {
  async create(tenantId: string, createdBy: string, data: CreateNewEntityData) {
    return this.withTenantGuard(tenantId, async () => {
      const entity = await this.prisma.newEntity.create({
        data: { ...data, tenantId, createdBy },
      });

      await this.auditLog(createdBy, tenantId, "entity.created", "entity", entity.id, data);
      return entity;
    });
  }
}
```

### 3. Create Server Action

Create `src/server/actions/new-entity.actions.ts`:

```typescript
export async function createNewEntity(
  tenantId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    await requireTenantRole(tenantId, ["SUB_ADMIN"]);
    
    const validatedData = CreateNewEntitySchema.parse(data);
    const entity = await newEntityRepo.create(tenantId, user.id, validatedData);
    
    revalidatePath(`/t/${tenantId}/new-entity`);
    
    return { ok: true, data: entity };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
```

### 4. Create Client Hook

Add to `src/client/api/new-entity.ts`:

```typescript
export function useCreateNewEntity() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (tenantId: string, data: CreateNewEntityData) => {
    // Implementation
  };

  return { mutate, isLoading, error };
}
```

## Security Features

### Multi-Tenant Isolation
- All queries filter by `tenantId`
- Repository layer enforces tenant boundaries
- Public routes use separate methods without tenant context

### RBAC Enforcement
- Server actions check roles before operations
- Different roles have different permissions:
  - `MASTER_ADMIN`: Full access across all tenants
  - `SUB_ADMIN`: Full access within tenant
  - `PHOTOGRAPHER`: Limited access to assigned bookings
  - `EDITOR`: Limited access to assigned galleries
  - `CLIENT`: Can create booking requests

### Audit Logging
- All state changes are logged
- Includes actor, action, entity, and diff
- Stored in `AuditLog` table for compliance

### Input Validation
- Zod schemas validate all inputs
- Type-safe data flow from client to database
- Prevents injection attacks and data corruption

## Database Schema

The schema includes all necessary models for the multi-tenant system:

- **Auth**: `User`, `Account`, `Session`, `VerificationToken`
- **Tenants**: `Tenant`, `UserTenant`, `TenantSettings`
- **Business**: `Client`, `Booking`, `Gallery`, `GalleryImage`, `Invoice`, `Service`
- **Assignments**: `Assignment`
- **Audit**: `AuditLog`
- **System**: `Invitation`, `Webhook`

## Testing

### Repository Testing
```typescript
describe('JobsRepository', () => {
  it('should create booking with tenant guard', async () => {
    const repo = new JobsRepository();
    const booking = await repo.create(tenantId, userId, bookingData);
    expect(booking.tenantId).toBe(tenantId);
  });
});
```

### Action Testing
```typescript
describe('createBooking', () => {
  it('should require SUB_ADMIN role', async () => {
    // Mock user with CLIENT role
    const result = await createBooking(tenantId, bookingData);
    expect(result.ok).toBe(false);
  });
});
```

## Performance Considerations

- **Connection Pooling**: Prisma handles database connections efficiently
- **Query Optimization**: Use includes for related data, avoid N+1 queries
- **Caching**: Next.js automatic cache revalidation
- **Pagination**: All list operations support pagination
- **Indexing**: Database indexes on `tenantId`, `createdAt`, `status`

## Deployment

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

### Database Migrations
```bash
npx prisma migrate dev    # Development
npx prisma migrate deploy # Production
npx prisma db seed        # Seed data
```

### Health Checks
- Database connectivity
- Repository operations
- RBAC system
- Audit logging

This architecture provides a robust, secure, and scalable foundation for the multi-tenant RBAC system.


















