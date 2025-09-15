import { type Service } from "@/components/ServiceModal";

// All services from the database (seeded data) - Based on MediaDrive pricing guide
export const ALL_SERVICES: Service[] = [
  // INDIVIDUAL PHOTOGRAPHY SERVICES
  {
    id: "photo-10",
    name: "PHOTOGRAPHY - Up to 10 Images",
    description: "Professional ground-level photography with up to 10 high-quality images. Perfect for smaller properties or quick shoots.",
    icon: "📸",
    status: "Active",
    cost: "$225",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: false,
    displayPrice: true,
    active: true,
  },
  {
    id: "photo-20",
    name: "PHOTOGRAPHY - Up to 20 Images",
    description: "Comprehensive ground-level photography with up to 20 high-quality images. Ideal for standard residential properties.",
    icon: "📸",
    status: "Active",
    cost: "$350",
    date: new Date().toDateString(),
    durationMinutes: 90,
    favorite: true,
    displayPrice: true,
    active: true,
  },
  {
    id: "photo-35",
    name: "PHOTOGRAPHY - Up to 35 Images",
    description: "Extensive ground-level photography with up to 35 high-quality images. Perfect for larger properties or detailed showcases.",
    icon: "📸",
    status: "Active",
    cost: "$500",
    date: new Date().toDateString(),
    durationMinutes: 120,
    favorite: false,
    displayPrice: true,
    active: true,
  },
  {
    id: "photo-additional",
    name: "ADDITIONAL PHOTOGRAPHY IMAGES",
    description: "Additional high-quality images beyond the base package. $15 per image.",
    icon: "📸",
    status: "Active",
    cost: "$15",
    date: new Date().toDateString(),
    durationMinutes: 15,
    favorite: false,
    displayPrice: true,
    active: true,
  },

  // DUSK PHOTOGRAPHY
  {
    id: "dusk-10",
    name: "DUSK PHOTOGRAPHY - Up to 10 Images",
    description: "Stunning twilight photography with up to 10 high-quality images. Captures the property in beautiful evening light.",
    icon: "🌆",
    status: "Active",
    cost: "$245",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: false,
    displayPrice: true,
    active: true,
  },
  {
    id: "dusk-additional",
    name: "ADDITIONAL DUSK IMAGES",
    description: "Additional dusk photography images beyond the base package. $15 per image.",
    icon: "🌆",
    status: "Active",
    cost: "$15",
    date: new Date().toDateString(),
    durationMinutes: 15,
    favorite: false,
    displayPrice: true,
    active: true,
  },

  // DRONE PHOTOGRAPHY
  {
    id: "drone-10",
    name: "DRONE PHOTOGRAPHY - Up to 10 Images",
    description: "Aerial drone photography with up to 10 high-quality images. Showcases your property from stunning high angles.",
    icon: "🚁",
    status: "Active",
    cost: "$225",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: true,
    displayPrice: true,
    active: true,
  },
  {
    id: "drone-additional",
    name: "ADDITIONAL DRONE IMAGES",
    description: "Additional drone photography images beyond the base package. $15 per image.",
    icon: "🚁",
    status: "Active",
    cost: "$15",
    date: new Date().toDateString(),
    durationMinutes: 15,
    favorite: false,
    displayPrice: true,
    active: true,
  },

  // FLOOR PLANS
  {
    id: "floorplan-studio",
    name: "FLOOR PLAN - Studio Only",
    description: "Professional floor plan for studio apartments. Detailed layout showing space utilization and flow.",
    icon: "📐",
    status: "Active",
    cost: "$155",
    date: new Date().toDateString(),
    durationMinutes: 45,
    favorite: false,
    displayPrice: true,
    active: true,
  },
  {
    id: "floorplan-standard",
    name: "FLOOR PLAN - Standard with Site",
    description: "Comprehensive floor plan with site plan. Includes property layout and surrounding area details.",
    icon: "📐",
    status: "Active",
    cost: "$195",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: true,
    displayPrice: true,
    active: true,
  },
  {
    id: "floorplan-large",
    name: "FLOOR PLAN - Large (2 Dwellings)",
    description: "Detailed floor and site plan for large properties with multiple dwellings. Comprehensive layout documentation.",
    icon: "📐",
    status: "Active",
    cost: "$255",
    date: new Date().toDateString(),
    durationMinutes: 90,
    favorite: false,
    displayPrice: true,
    active: true,
  },

  // VIDEOGRAPHY
  {
    id: "video-cinematic",
    name: "CINEMATIC PROPERTY VIDEO",
    description: "Professional cinematic property video showcasing the property in motion. High-quality production with smooth transitions.",
    icon: "🎥",
    status: "Active",
    cost: "$600",
    date: new Date().toDateString(),
    durationMinutes: 120,
    favorite: true,
    displayPrice: true,
    active: true,
  },
  {
    id: "video-social",
    name: "SOCIAL MEDIA VIDEO (30-45sec)",
    description: "Short-form social media video perfect for Instagram, Facebook, and other social platforms. 30-45 second duration.",
    icon: "📸🎥",
    status: "Active",
    cost: "$350",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: false,
    displayPrice: true,
    active: true,
  },

  // SERVICE PACKAGES
  {
    id: "package-studio",
    name: "STUDIO PACKAGE",
    description: "Perfect for 2 bedroom properties. Includes up to 15 images, branded floor plan & site plan, drone photography, AI decluttering ($10 per image), and additional images at $15 each.",
    icon: "📸",
    status: "Active",
    cost: "$425",
    date: new Date().toDateString(),
    durationMinutes: 120,
    favorite: true,
    displayPrice: true,
    active: true,
    imageQuotaEnabled: true,
    imageQuota: 15,
  },
  {
    id: "package-essential",
    name: "ESSENTIAL PACKAGE",
    description: "Ideal for 3-5 bedroom properties. Includes up to 35 images, branded floor plan & site plan, drone photography, AI decluttering ($10 per image), and additional images at $15 each.",
    icon: "📷",
    status: "Active",
    cost: "$550",
    date: new Date().toDateString(),
    durationMinutes: 180,
    favorite: true,
    displayPrice: true,
    active: true,
    imageQuotaEnabled: true,
    imageQuota: 35,
  },
  {
    id: "package-premium",
    name: "PREMIUM PACKAGE",
    description: "Comprehensive package with up to 50 images, branded floor plan & site plan, drone photography, 1-2min cinematic property tour, AI decluttering ($10 per image), and additional images at $15 each.",
    icon: "🎥",
    status: "Active",
    cost: "$1100",
    date: new Date().toDateString(),
    durationMinutes: 300,
    favorite: true,
    displayPrice: true,
    active: true,
    imageQuotaEnabled: true,
    imageQuota: 50,
  },
  {
    id: "package-dusk",
    name: "DUSK PACKAGE",
    description: "Golden hour to dusk photography package. Includes up to 35 images, branded floor plan & site plan, drone photography, AI decluttering ($10 per image), and additional images at $15 each.",
    icon: "🌆",
    status: "Active",
    cost: "$650",
    date: new Date().toDateString(),
    durationMinutes: 120,
    favorite: false,
    displayPrice: true,
    active: true,
    imageQuotaEnabled: true,
    imageQuota: 35,
  },

  // ADDITIONAL SERVICES
  {
    id: "ai-decluttering",
    name: "AI DECLUTTERING",
    description: "Professional AI-powered image enhancement to remove clutter and improve visual appeal. $10 per image.",
    icon: "🎨",
    status: "Active",
    cost: "$10",
    date: new Date().toDateString(),
    durationMinutes: 5,
    favorite: false,
    displayPrice: true,
    active: true,
  },
  {
    id: "virtual-tour",
    name: "VIRTUAL TOUR",
    description: "Interactive 360-degree virtual tour of the property. Perfect for online listings and remote viewing.",
    icon: "🖼️",
    status: "Active",
    cost: "$200",
    date: new Date().toDateString(),
    durationMinutes: 90,
    favorite: false,
    displayPrice: true,
    active: true,
  },
];

// Create a mutable copy of services
let currentServices = [...ALL_SERVICES];

// Get all services
export function getAllServices(): Service[] {
  console.log("ServiceManager: Getting all services, current count:", currentServices.length);
  return [...currentServices];
}

// Get favorited services
export function getFavoritedServices(): Service[] {
  return currentServices.filter(service => service.favorite === true);
}

// Toggle favorite status and save to localStorage for persistence
export function toggleServiceFavorite(serviceId: string): void {
  console.log("Toggling favorite for service:", serviceId);
  
  // Find and update the service
  const serviceIndex = currentServices.findIndex(s => s.id === serviceId);
  if (serviceIndex !== -1) {
    // Create a new array to trigger React re-renders
    currentServices = currentServices.map((service, index) => 
      index === serviceIndex 
        ? { ...service, favorite: !service.favorite }
        : service
    );
    
    console.log("Service updated:", currentServices[serviceIndex]);
    
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("studiio.serviceFavorites", JSON.stringify(
          currentServices.map(s => ({ id: s.id, favorite: s.favorite }))
        ));
        console.log("Favorites saved to localStorage");
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
      }
    }
    
    // Dispatch event to notify other components
    if (typeof window !== "undefined") {
      console.log("Dispatching servicesUpdated event");
      window.dispatchEvent(new Event("studiio:servicesUpdated"));
    }
  } else {
    console.error("Service not found:", serviceId);
  }
}

// Get service by ID
export function getServiceById(serviceId: string): Service | undefined {
  return currentServices.find(s => s.id === serviceId);
}

// Load favorites from localStorage on initialization
export function loadFavoritesFromStorage(): void {
  if (typeof window !== "undefined") {
    try {
      const savedFavorites = localStorage.getItem("studiio.serviceFavorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        console.log("Loading favorites from localStorage:", favorites);
        
        // Update current services with saved favorites
        currentServices = currentServices.map(service => {
          const saved = favorites.find((f: any) => f.id === service.id);
          return saved ? { ...service, favorite: saved.favorite } : service;
        });
        
        console.log("Favorites loaded from localStorage");
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
  }
}

// Add a new service
export function addService(service: Omit<Service, 'id' | 'date'>): Service {
  const newService: Service = {
    ...service,
    id: crypto.randomUUID(),
    date: new Date().toDateString(),
  };
  
  currentServices = [...currentServices, newService];
  
  // Save to localStorage
  saveServicesToStorage();
  
  // Dispatch event to notify other components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("studiio:servicesUpdated"));
  }
  
  return newService;
}

// Update an existing service
export function updateService(serviceId: string, updates: Partial<Service>): Service | null {
  const serviceIndex = currentServices.findIndex(s => s.id === serviceId);
  if (serviceIndex === -1) {
    console.error("Service not found:", serviceId);
    return null;
  }
  
  const updatedService = { ...currentServices[serviceIndex], ...updates };
  currentServices = currentServices.map((service, index) => 
    index === serviceIndex ? updatedService : service
  );
  
  // Save to localStorage
  saveServicesToStorage();
  
  // Dispatch event to notify other components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("studiio:servicesUpdated"));
  }
  
  return updatedService;
}

// Delete a service
export function deleteService(serviceId: string): boolean {
  const serviceIndex = currentServices.findIndex(s => s.id === serviceId);
  if (serviceIndex === -1) {
    console.error("Service not found:", serviceId);
    return false;
  }
  
  currentServices = currentServices.filter(s => s.id !== serviceId);
  
  // Save to localStorage
  saveServicesToStorage();
  
  // Dispatch event to notify other components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("studiio:servicesUpdated"));
  }
  
  return true;
}

// Save services to localStorage
function saveServicesToStorage(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("studiio.services", JSON.stringify(currentServices));
      console.log("Services saved to localStorage");
    } catch (error) {
      console.error("Failed to save services to localStorage:", error);
    }
  }
}

// Load services from localStorage
function loadServicesFromStorage(): void {
  if (typeof window !== "undefined") {
    try {
      const savedServices = localStorage.getItem("studiio.services");
      console.log("ServiceManager: Checking localStorage for services:", savedServices);
      if (savedServices) {
        const services = JSON.parse(savedServices);
        console.log("ServiceManager: Loading services from localStorage:", services.length, "services");
        currentServices = services;
        console.log("ServiceManager: Services loaded from localStorage");
      } else {
        console.log("ServiceManager: No services found in localStorage, using default services");
        // Ensure we always have the default services
        currentServices = [...ALL_SERVICES];
        // Save the default services to localStorage
        saveServicesToStorage();
      }
    } catch (error) {
      console.error("ServiceManager: Failed to load services from localStorage:", error);
      // Fallback to default services
      currentServices = [...ALL_SERVICES];
    }
  } else {
    // Server-side: use default services
    currentServices = [...ALL_SERVICES];
  }
}

// Initialize services from localStorage
loadServicesFromStorage();
loadFavoritesFromStorage();
