import { NewsletterRepo, CreateNewsletterData, CreateContentBlockData, CreateRecipientData } from '../../server/repos/newsletter.repo';

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  status: 'DRAFT' | 'SENT' | 'SCHEDULED';
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  scheduledFor?: string;
  content: NewsletterContent[];
  recipients: NewsletterRecipient[];
}

export interface NewsletterContent {
  id: string;
  newsletterId: string;
  type: 'text' | 'image' | 'heading' | 'button' | 'divider';
  content: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  order: number;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterRecipient {
  id: string;
  newsletterId: string;
  clientId?: string;
  email?: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'BOUNCED';
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  createdAt: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    company?: {
      id: string;
      name: string;
    };
  };
}

export const newsletterApi = {
  async createNewsletter(data: CreateNewsletterData): Promise<{ success: boolean; data?: Newsletter; error?: string }> {
    try {
      console.log('Sending newsletter data:', data);
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to create newsletter: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Response data:', result);
      
      // Check if the API returns the data directly or wrapped in a success object
      if (result.id && result.title) {
        // API returned the newsletter data directly
        return { success: true, data: result };
      } else if (result.success !== undefined) {
        // API returned a success object
        return result;
      } else {
        // Unknown response format
        console.warn('Unknown response format:', result);
        return { success: false, error: 'Invalid response format' };
      }
    } catch (error) {
      console.error('Error in createNewsletter:', error);
      throw error;
    }
  },

  async getNewsletterById(id: string): Promise<{ success: boolean; data?: Newsletter; error?: string }> {
    const response = await fetch(`/api/newsletters/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to get newsletter');
    }
    
    return response.json();
  },

  async updateNewsletter(id: string, data: Partial<CreateNewsletterData>): Promise<{ success: boolean; data?: Newsletter; error?: string }> {
    const response = await fetch(`/api/newsletters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update newsletter');
    }
    
    return response.json();
  },

  async deleteNewsletter(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/newsletters/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete newsletter');
    }
    
    return response.json();
  },

  async addContentBlock(data: CreateContentBlockData): Promise<{ success: boolean; data?: NewsletterContent; error?: string }> {
    const response = await fetch('/api/newsletters/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add content block');
    }
    
    return response.json();
  },

  async updateContentBlock(id: string, data: Partial<CreateContentBlockData>): Promise<{ success: boolean; data?: NewsletterContent; error?: string }> {
    const response = await fetch(`/api/newsletters/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update content block');
    }
    
    return response.json();
  },

  async deleteContentBlock(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/newsletters/content/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete content block');
    }
    
    return response.json();
  },

  async addRecipients(data: CreateRecipientData[]): Promise<{ success: boolean; error?: string }> {
    const response = await fetch('/api/newsletters/recipients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add recipients');
    }
    
    return response.json();
  },

  async getNewslettersByTenant(tenantId: string): Promise<{ success: boolean; data?: Newsletter[]; error?: string }> {
    try {
      console.log('🔄 Fetching newsletters for tenant:', tenantId);
      const response = await fetch(`/api/newsletters?tenantId=${tenantId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get newsletters');
      }
      
      const data = await response.json();
      console.log('📡 Raw API response:', data);
      
      // The API returns the data directly, so wrap it in success format
      return { success: true, data: data };
    } catch (error: any) {
      console.error('❌ Error in getNewslettersByTenant:', error);
      return { success: false, error: error.message };
    }
  },

  async getClientsByTenant(tenantId: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    const response = await fetch(`/api/newsletters/clients?tenantId=${tenantId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get clients');
    }
    
    return response.json();
  },

  async markNewsletterAsSent(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/newsletters/${id}/send`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark newsletter as sent');
    }
    
    return response.json();
  },

  async scheduleNewsletter(id: string, scheduledFor: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/newsletters/${id}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scheduledFor }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule newsletter');
    }
    
    return response.json();
  },
};
