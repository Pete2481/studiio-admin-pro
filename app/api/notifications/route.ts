import { NextRequest, NextResponse } from 'next/server';
import { 
  createNotification, 
  getNotifications, 
  markAllNotificationsAsRead,
  getNotificationStats 
} from '@/src/server/actions/notification.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      message, 
      type, 
      category, 
      priority, 
      bookingId, 
      galleryId, 
      invoiceId, 
      clientId, 
      userId, 
      data, 
      actionUrl, 
      actionText, 
      tenantId, 
      createdBy, 
      expiresAt 
    } = body;

    // Validate required fields
    if (!title || !message || !type || !category || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createNotification({
      title,
      message,
      type,
      category,
      priority,
      bookingId,
      galleryId,
      invoiceId,
      clientId,
      userId,
      data,
      actionUrl,
      actionText,
      tenantId,
      createdBy,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: result.data 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const clientId = searchParams.get('clientId');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const isRead = searchParams.get('isRead');
    const isArchived = searchParams.get('isArchived');
    const bookingId = searchParams.get('bookingId');
    const galleryId = searchParams.get('galleryId');
    const invoiceId = searchParams.get('invoiceId');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const stats = searchParams.get('stats');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    // If stats is requested, return statistics
    if (stats === 'true') {
      const result = await getNotificationStats(tenantId, clientId || undefined);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    const filters = {
      tenantId,
      clientId: clientId || undefined,
      userId: userId || undefined,
      type: type || undefined,
      category: category || undefined,
      priority: priority || undefined,
      status: status || undefined,
      isRead: isRead ? isRead === 'true' : undefined,
      isArchived: isArchived ? isArchived === 'true' : undefined,
      bookingId: bookingId || undefined,
      galleryId: galleryId || undefined,
      invoiceId: invoiceId || undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };

    const result = await getNotifications(filters);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tenantId, clientId } = body;

    if (action === 'markAllRead') {
      if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
      }

      const result = await markAllNotificationsAsRead(tenantId, clientId);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}