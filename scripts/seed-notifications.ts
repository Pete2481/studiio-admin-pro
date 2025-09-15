import { PrismaClient } from '@prisma/client';
import { NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from '../lib/notification-types';

const prisma = new PrismaClient();

async function seedNotifications() {
  try {
    console.log('🌱 Seeding notifications...');

    // Get the first tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log('❌ No tenant found. Please run tenant seeding first.');
      return;
    }

    // Get the Belle Property client specifically
    const client = await prisma.client.findFirst({
      where: { 
        tenantId: tenant.id,
        id: 'belle-property-client'
      }
    });

    // Get the first user
    const user = await prisma.user.findFirst();

    if (!user) {
      console.log('❌ No user found. Please run user seeding first.');
      return;
    }

    // Sample notifications
    const sampleNotifications = [
      {
        title: 'New Booking Created',
        message: 'A new booking has been created for your property shoot on December 15th, 2024.',
        type: NOTIFICATION_TYPES.BOOKING,
        category: NOTIFICATION_CATEGORIES.INFO,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          bookingDate: '2024-12-15',
          property: '123 Main Street',
          photographer: 'John Smith'
        }),
        actionUrl: '/client-admin/bookings',
        actionText: 'View Booking'
      },
      {
        title: 'Gallery Ready for Review',
        message: 'Your property gallery is ready for review. 45 high-resolution images are available.',
        type: NOTIFICATION_TYPES.GALLERY,
        category: NOTIFICATION_CATEGORIES.SUCCESS,
        priority: NOTIFICATION_CATEGORIES.INFO,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          imageCount: 45,
          galleryId: 'gallery-123',
          deliveryDate: '2024-12-10'
        }),
        actionUrl: '/client-admin/galleries',
        actionText: 'View Gallery'
      },
      {
        title: 'Invoice #INV-2024-001 Sent',
        message: 'Your invoice for the property photography service has been sent. Amount: $1,250.00',
        type: NOTIFICATION_TYPES.INVOICE,
        category: NOTIFICATION_CATEGORIES.INFO,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          invoiceNumber: 'INV-2024-001',
          amount: 125000, // in cents
          dueDate: '2024-12-25'
        }),
        actionUrl: '/client-admin/invoices',
        actionText: 'View Invoice'
      },
      {
        title: 'Payment Received',
        message: 'Payment of $1,250.00 has been received for invoice #INV-2024-001. Thank you!',
        type: NOTIFICATION_TYPES.PAYMENT,
        category: NOTIFICATION_CATEGORIES.SUCCESS,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          amount: 125000,
          paymentMethod: 'Credit Card',
          transactionId: 'txn_123456789'
        }),
        actionUrl: '/client-admin/invoices',
        actionText: 'View Payment'
      },
      {
        title: 'Upcoming Booking Reminder',
        message: 'Reminder: Your property photography session is scheduled for tomorrow at 2:00 PM.',
        type: NOTIFICATION_TYPES.REMINDER,
        category: NOTIFICATION_CATEGORIES.INFO,
        priority: NOTIFICATION_PRIORITIES.HIGH,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          bookingDate: '2024-12-12',
          time: '2:00 PM',
          photographer: 'Jane Doe',
          address: '456 Oak Avenue'
        }),
        actionUrl: '/client-admin/bookings',
        actionText: 'View Details'
      },
      {
        title: 'Photographer Assignment',
        message: 'Sarah Johnson has been assigned as your photographer for the upcoming session.',
        type: NOTIFICATION_TYPES.ASSIGNMENT,
        category: NOTIFICATION_CATEGORIES.INFO,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          photographerName: 'Sarah Johnson',
          photographerEmail: 'sarah@example.com',
          experience: '5 years',
          specialties: ['Real Estate', 'Interior Design']
        }),
        actionUrl: '/client-admin/photographers',
        actionText: 'View Profile'
      },
      {
        title: 'System Maintenance Notice',
        message: 'Scheduled maintenance will occur on Sunday, December 15th from 2:00 AM to 4:00 AM EST.',
        type: NOTIFICATION_TYPES.SYSTEM,
        category: NOTIFICATION_CATEGORIES.WARNING,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          maintenanceDate: '2024-12-15',
          startTime: '2:00 AM EST',
          endTime: '4:00 AM EST',
          affectedServices: ['Gallery Access', 'Booking System']
        })
      },
      {
        title: 'Payment Overdue',
        message: 'Payment for invoice #INV-2024-002 is now overdue. Please process payment to avoid service interruption.',
        type: NOTIFICATION_TYPES.PAYMENT,
        category: NOTIFICATION_CATEGORIES.WARNING,
        priority: NOTIFICATION_PRIORITIES.HIGH,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          invoiceNumber: 'INV-2024-002',
          amount: 85000,
          dueDate: '2024-12-01',
          daysOverdue: 5
        }),
        actionUrl: '/client-admin/invoices',
        actionText: 'Pay Now'
      },
      {
        title: 'Gallery Download Available',
        message: 'Your gallery images are ready for download. High-resolution files are available for 30 days.',
        type: NOTIFICATION_TYPES.GALLERY,
        category: NOTIFICATION_CATEGORIES.SUCCESS,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          downloadLink: 'https://gallery.example.com/download/abc123',
          expiryDate: '2025-01-10',
          fileSize: '2.3 GB',
          format: 'ZIP'
        }),
        actionUrl: '/client-admin/galleries',
        actionText: 'Download'
      },
      {
        title: 'Booking Confirmed',
        message: 'Your photography session for 789 Pine Street has been confirmed for December 20th at 10:00 AM.',
        type: NOTIFICATION_TYPES.BOOKING,
        category: NOTIFICATION_CATEGORIES.SUCCESS,
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        clientId: client?.id,
        tenantId: tenant.id,
        createdBy: user.id,
        data: JSON.stringify({
          property: '789 Pine Street',
          date: '2024-12-20',
          time: '10:00 AM',
          duration: '2 hours',
          photographer: 'Mike Wilson'
        }),
        actionUrl: '/client-admin/bookings',
        actionText: 'View Booking'
      }
    ];

    // Create notifications with different timestamps
    for (let i = 0; i < sampleNotifications.length; i++) {
      const notification = sampleNotifications[i];
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - i); // Spread over the last few days
      createdAt.setHours(createdAt.getHours() - Math.random() * 24); // Random time

      await prisma.notification.create({
        data: {
          ...notification,
          createdAt,
          updatedAt: createdAt,
          // Make some notifications read
          isRead: i % 3 === 0,
          readAt: i % 3 === 0 ? createdAt : null,
          status: i % 3 === 0 ? 'read' : 'unread'
        }
      });
    }

    console.log(`✅ Created ${sampleNotifications.length} sample notifications`);
    console.log('📊 Notification types created:');
    console.log(`   - Booking: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.BOOKING).length}`);
    console.log(`   - Gallery: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.GALLERY).length}`);
    console.log(`   - Invoice: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.INVOICE).length}`);
    console.log(`   - Payment: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.PAYMENT).length}`);
    console.log(`   - Reminder: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.REMINDER).length}`);
    console.log(`   - Assignment: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.ASSIGNMENT).length}`);
    console.log(`   - System: ${sampleNotifications.filter(n => n.type === NOTIFICATION_TYPES.SYSTEM).length}`);

  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedNotifications();
