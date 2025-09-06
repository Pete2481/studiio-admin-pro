'use server';

import { NewsletterRepo, CreateNewsletterData, CreateContentBlockData, CreateRecipientData } from '../repos/newsletter.repo';

const newsletterRepo = new NewsletterRepo();

export async function createNewsletter(data: CreateNewsletterData) {
  try {
    const newsletter = await newsletterRepo.createNewsletter(data);
    return { success: true, data: newsletter };
  } catch (error) {
    console.error('Error creating newsletter:', error);
    return { success: false, error: 'Failed to create newsletter' };
  }
}

export async function getNewsletterById(id: string) {
  try {
    const newsletter = await newsletterRepo.getNewsletterById(id);
    return { success: true, data: newsletter };
  } catch (error) {
    console.error('Error getting newsletter:', error);
    return { success: false, error: 'Failed to get newsletter' };
  }
}

export async function updateNewsletter(id: string, data: Partial<CreateNewsletterData>) {
  try {
    const newsletter = await newsletterRepo.updateNewsletter(id, data);
    return { success: true, data: newsletter };
  } catch (error) {
    console.error('Error updating newsletter:', error);
    return { success: false, error: 'Failed to update newsletter' };
  }
}

export async function deleteNewsletter(id: string) {
  try {
    await newsletterRepo.deleteNewsletter(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    return { success: false, error: 'Failed to delete newsletter' };
  }
}

export async function addContentBlock(data: CreateContentBlockData) {
  try {
    const contentBlock = await newsletterRepo.addContentBlock(data);
    return { success: true, data: contentBlock };
  } catch (error) {
    console.error('Error adding content block:', error);
    return { success: false, error: 'Failed to add content block' };
  }
}

export async function updateContentBlock(id: string, data: Partial<CreateContentBlockData>) {
  try {
    const contentBlock = await newsletterRepo.updateContentBlock(id, data);
    return { success: true, data: contentBlock };
  } catch (error) {
    console.error('Error updating content block:', error);
    return { success: false, error: 'Failed to update content block' };
  }
}

export async function deleteContentBlock(id: string) {
  try {
    await newsletterRepo.deleteContentBlock(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting content block:', error);
    return { success: false, error: 'Failed to delete content block' };
  }
}

export async function addRecipients(data: CreateRecipientData[]) {
  try {
    await newsletterRepo.addRecipients(data);
    return { success: true };
  } catch (error) {
    console.error('Error adding recipients:', error);
    return { success: false, error: 'Failed to add recipients' };
  }
}

export async function getNewslettersByTenant(tenantId: string) {
  try {
    const newsletters = await newsletterRepo.getNewslettersByTenant(tenantId);
    return { success: true, data: newsletters };
  } catch (error) {
    console.error('Error getting newsletters:', error);
    return { success: false, error: 'Failed to get newsletters' };
  }
}

export async function getClientsByTenant(tenantId: string) {
  try {
    const clients = await newsletterRepo.getClientsByTenant(tenantId);
    return { success: true, data: clients };
  } catch (error) {
    console.error('Error getting clients:', error);
    return { success: false, error: 'Failed to get clients' };
  }
}

export async function markNewsletterAsSent(id: string) {
  try {
    await newsletterRepo.markNewsletterAsSent(id);
    return { success: true };
  } catch (error) {
    console.error('Error marking newsletter as sent:', error);
    return { success: false, error: 'Failed to mark newsletter as sent' };
  }
}
