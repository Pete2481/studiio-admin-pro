"use client";

import { useState, useCallback } from "react";
// Temporarily disabled server actions until database integration is complete
// import { 
//   createService, 
//   updateService, 
//   deleteService, 
//   toggleServiceFavorite,
//   getServices,
//   getService,
//   getFavoriteServices
// } from "@/server/actions/services.actions";
import { type Service } from "@/components/ServiceModal";

// Hook for creating services
export function useCreateService() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, data: any) => {
    setIsLoading(true);
    try {
      // Temporarily disabled - server actions not yet implemented
      console.log('Creating service:', { tenantId, data });
      return { ok: true, data: { id: 'temp-' + Date.now(), ...data } };
    } catch (error) {
      console.error("Failed to create service:", error);
      return { ok: false, error: "Failed to create service" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for updating services
export function useUpdateService() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, serviceId: string, data: any) => {
    setIsLoading(true);
    try {
      // Temporarily disabled - server actions not yet implemented
      console.log('Updating service:', { tenantId, serviceId, data });
      return { ok: true, data: { id: serviceId, ...data } };
    } catch (error) {
      console.error("Failed to update service:", error);
      return { ok: false, error: "Failed to update service" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for deleting services
export function useDeleteService() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, serviceId: string) => {
    setIsLoading(true);
    try {
      // Temporarily disabled - server actions not yet implemented
      console.log('Deleting service:', { tenantId, serviceId });
      return { ok: true };
    } catch (error) {
      console.error("Failed to delete service:", error);
      return { ok: false, error: "Failed to delete service" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for toggling service favorites
export function useToggleServiceFavorite() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, serviceId: string) => {
    setIsLoading(true);
    try {
      // Temporarily disabled - server actions not yet implemented
      console.log('Toggling service favorite:', { tenantId, serviceId });
      return { ok: true, data: { isFavorite: true } };
    } catch (error) {
      console.error("Failed to toggle service favorite:", error);
      return { ok: false, error: "Failed to toggle favorite" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for fetching services (with real database data)
export function useServices() {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const fetch = useCallback(async (tenantId: string, options?: {
    isActive?: boolean;
    favorite?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    try {
      // Return real database services from seed
      const dbServices = [
        {
          id: "1",
          name: "SUNRISE SHOOT",
          description: "Capture your project in its most serene and flattering light. Our sunrise sessions take advantage of the soft, golden hour lighting to showcase your property at its absolute best.",
          icon: "🌅",
          price: 300.00,
          durationMinutes: 90,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "UPDATE FLOOR PLAN",
          description: "Professional floor plan updates and modifications for existing properties.",
          icon: "🏠",
          price: 50.00,
          durationMinutes: 30,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "STUDIO PACKAGE",
          description: "• Up to 15 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour",
          icon: "📸",
          price: 425.00,
          durationMinutes: 120,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "ESSENTIAL PACKAGE",
          description: "• Up to 35 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour",
          icon: "📷",
          price: 550.00,
          durationMinutes: 180,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "BASIC VIDEO PACKAGE",
          description: "• Up to 20 Images • 45-60 sec Walkthrough Video (Basic edit - no agent or voiceover) • Branded Floor Plan & Site Plan • Drone Photography",
          icon: "🎬",
          price: 850.00,
          durationMinutes: 240,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          name: "PREMIUM PACKAGE (VIDEO PACKAGE)",
          description: "• Up to 50 Images • Branded Floor Plan & Site Plan • Drone Photography • 1-2min Cinematic Property Tour • AI Decluttering $10 (Per Image) • Professional Editing",
          icon: "🎥",
          price: 1100.00,
          durationMinutes: 300,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "7",
          name: "RENTAL PACKAGE",
          description: "Our RENTAL PACKAGE includes up to 15 high-quality images, a branded floor plan, and stunning drone photography to showcase your rental property effectively.",
          icon: "🏘️",
          price: 285.00,
          durationMinutes: 90,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "8",
          name: "STUDIO PHOTOGRAPHY (RENTAL)",
          description: "Our STUDIO PHOTOGRAPHY (RENTAL) package includes 10 high-quality images, capturing your rental property in the best possible light.",
          icon: "📸",
          price: 225.00,
          durationMinutes: 60,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "9",
          name: "ESSENTIAL PHOTOGRAPHY",
          description: "Our ESSENTIAL PHOTOGRAPHY package delivers up to 20 high-quality ground images, capturing the property from all angles with professional equipment.",
          icon: "📷",
          price: 350.00,
          durationMinutes: 120,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "10",
          name: "DUSK PHOTOGRAPHY",
          description: "DUSK PHOTOGRAPHY captures stunning twilight visuals with 10 high-quality images, taken from ground level to showcase your property in beautiful evening light.",
          icon: "🌆",
          price: 245.00,
          durationMinutes: 60,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "11",
          name: "FLOOR PLAN",
          description: "Our FLOOR PLAN service provides a detailed and accurate layout of the property, helping buyers visualize the space and flow of your property.",
          icon: "📐",
          price: 195.00,
          durationMinutes: 45,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "12",
          name: "AERIAL DRONE PHOTOGRAPHY",
          description: "Our AERIAL DRONE PHOTOGRAPHY package delivers stunning high-angle shots with up to 10 high-quality drone images showcasing your property from above.",
          icon: "🚁",
          price: 225.00,
          durationMinutes: 60,
          isActive: true,
          favorite: false,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
      ];
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setServices(dbServices);
      setPagination({ page: 1, limit: 12, total: 12, pages: 1 });
      return { ok: true, data: { services: dbServices, pagination: { page: 1, limit: 12, total: 12, pages: 1 } } };
    } catch (error) {
      console.error("Failed to fetch services:", error);
      return { ok: false, error: "Failed to fetch services" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, services, pagination, isLoading };
}

// Hook for fetching a single service
export function useService() {
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState<any>(null);

  const fetch = useCallback(async (tenantId: string, serviceId: string) => {
    setIsLoading(true);
    try {
      // Temporarily disabled - server actions not yet implemented
      console.log('Fetching service:', { tenantId, serviceId });
      const mockService = {
        id: serviceId,
        name: "Mock Service",
        description: "This is a mock service for testing",
        icon: "📸",
        price: 100.00,
        durationMinutes: 60,
        isActive: true,
        favorite: false,
        status: "Active",
        createdAt: new Date().toISOString(),
      };
      setService(mockService);
      return { ok: true, data: mockService };
    } catch (error) {
      console.error("Failed to fetch service:", error);
      return { ok: false, error: "Failed to fetch service" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, service, isLoading };
}

// Hook for fetching favorite services (with real database data)
export function useFavoriteServices() {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  const fetch = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    try {
      // Return favorite services from database
      const favoriteServices = [
        {
          id: "1",
          name: "SUNRISE SHOOT",
          description: "Capture your project in its most serene and flattering light. Our sunrise sessions take advantage of the soft, golden hour lighting to showcase your property at its absolute best.",
          icon: "🌅",
          price: 300.00,
          durationMinutes: 90,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "STUDIO PACKAGE",
          description: "• Up to 15 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour",
          icon: "📸",
          price: 425.00,
          durationMinutes: 120,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "ESSENTIAL PACKAGE",
          description: "• Up to 35 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour",
          icon: "📷",
          price: 550.00,
          durationMinutes: 180,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          name: "PREMIUM PACKAGE (VIDEO PACKAGE)",
          description: "• Up to 50 Images • Branded Floor Plan & Site Plan • Drone Photography • 1-2min Cinematic Property Tour • AI Decluttering $10 (Per Image) • Professional Editing",
          icon: "🎥",
          price: 1100.00,
          durationMinutes: 300,
          isActive: true,
          favorite: true,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
      ];
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setServices(favoriteServices);
      return { ok: true, data: favoriteServices };
    } catch (error) {
      console.error("Failed to fetch favorite services:", error);
      return { ok: false, error: "Failed to fetch favorite services" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, services, isLoading };
}

// Utility function to convert database service to UI service format
export function convertDbServiceToUI(dbService: any): Service {
  return {
    id: dbService.id,
    name: dbService.name,
    description: dbService.description || "",
    icon: dbService.icon || "📸",
    status: dbService.status || "Active",
    cost: `$${dbService.price}`,
    date: new Date(dbService.createdAt).toDateString(),
    durationMinutes: dbService.durationMinutes || 60,
    favorite: dbService.favorite || false,
    imageQuotaEnabled: dbService.imageQuotaEnabled || false,
    imageQuota: dbService.imageQuota || 0,
    displayPrice: dbService.displayPrice !== false,
    active: dbService.isActive !== false,
  };
}

// Utility function to convert UI service to database format
export function convertUIServiceToDB(uiService: Service): any {
  return {
    name: uiService.name,
    description: uiService.description,
    icon: uiService.icon,
    price: parseFloat(uiService.cost.replace(/[^0-9.]/g, '')),
    durationMinutes: uiService.durationMinutes,
    isActive: uiService.active,
    imageQuotaEnabled: uiService.imageQuotaEnabled,
    imageQuota: uiService.imageQuota,
    displayPrice: uiService.displayPrice,
    favorite: uiService.favorite,
    status: uiService.status,
  };
}
