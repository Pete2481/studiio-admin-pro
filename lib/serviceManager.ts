import { type Service } from "@/components/ServiceModal";

// All services from the database (seeded data)
export const ALL_SERVICES: Service[] = [
  {
    id: "1",
    name: "SUNRISE SHOOT",
    description: "Capture your project in its most serene and flattering light. Our sunrise sessions take advantage of the soft, golden hour lighting to showcase your property at its absolute best.",
    icon: "🌅",
    status: "Active",
    cost: "$300",
    date: new Date().toDateString(),
    durationMinutes: 90,
    favorite: true,
  },
  {
    id: "2",
    name: "UPDATE FLOOR PLAN",
    description: "Professional floor plan updates and modifications for existing properties.",
    icon: "🏠",
    status: "Active",
    cost: "$50",
    date: new Date().toDateString(),
    durationMinutes: 30,
    favorite: false,
  },
  {
    id: "3",
    name: "STUDIO PACKAGE",
    description: "• Up to 15 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour",
    icon: "📸",
    status: "Active",
    cost: "$425",
    date: new Date().toDateString(),
    durationMinutes: 120,
    favorite: true,
  },
  {
    id: "4",
    name: "ESSENTIAL PACKAGE",
    description: "• Up to 35 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour",
    icon: "📷",
    status: "Active",
    cost: "$550",
    date: new Date().toDateString(),
    durationMinutes: 180,
    favorite: true,
  },
  {
    id: "5",
    name: "BASIC VIDEO PACKAGE",
    description: "• Up to 20 Images • 45-60 sec Walkthrough Video (Basic edit - no agent or voiceover) • Branded Floor Plan & Site Plan • Drone Photography",
    icon: "🎬",
    status: "Active",
    cost: "$850",
    date: new Date().toDateString(),
    durationMinutes: 240,
    favorite: false,
  },
  {
    id: "6",
    name: "PREMIUM PACKAGE (VIDEO PACKAGE)",
    description: "• Up to 50 Images • Branded Floor Plan & Site Plan • Drone Photography • 1-2min Cinematic Property Tour • AI Decluttering $10 (Per Image) • Professional Editing",
    icon: "🎥",
    status: "Active",
    cost: "$1100",
    date: new Date().toDateString(),
    durationMinutes: 300,
    favorite: true,
  },
  {
    id: "7",
    name: "RENTAL PACKAGE",
    description: "Our RENTAL PACKAGE includes up to 15 high-quality images, a branded floor plan, and stunning drone photography to showcase your rental property effectively.",
    icon: "🏘️",
    status: "Active",
    cost: "$285",
    date: new Date().toDateString(),
    durationMinutes: 90,
    favorite: false,
  },
  {
    id: "8",
    name: "STUDIO PHOTOGRAPHY (RENTAL)",
    description: "Our STUDIO PHOTOGRAPHY (RENTAL) package includes 10 high-quality images, capturing your rental property in the best possible light.",
    icon: "📸",
    status: "Active",
    cost: "$225",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: false,
  },
  {
    id: "9",
    name: "ESSENTIAL PHOTOGRAPHY",
    description: "Our ESSENTIAL PHOTOGRAPHY package delivers up to 20 high-quality ground images, capturing the property from all angles with professional equipment.",
    icon: "📷",
    status: "Active",
    cost: "$350",
    date: new Date().toDateString(),
    durationMinutes: 120,
    favorite: false,
  },
  {
    id: "10",
    name: "DUSK PHOTOGRAPHY",
    description: "DUSK PHOTOGRAPHY captures stunning twilight visuals with 10 high-quality images, taken from ground level to showcase your property in beautiful evening light.",
    icon: "🌆",
    status: "Active",
    cost: "$245",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: false,
  },
  {
    id: "11",
    name: "FLOOR PLAN",
    description: "Our FLOOR PLAN service provides a detailed and accurate layout of the property, helping buyers visualize the space and flow of your property.",
    icon: "📐",
    status: "Active",
    cost: "$195",
    date: new Date().toDateString(),
    durationMinutes: 45,
    favorite: false,
  },
  {
    id: "12",
    name: "AERIAL DRONE PHOTOGRAPHY",
    description: "Our AERIAL DRONE PHOTOGRAPHY package delivers stunning high-angle shots with up to 10 high-quality drone images showcasing your property from above.",
    icon: "🚁",
    status: "Active",
    cost: "$225",
    date: new Date().toDateString(),
    durationMinutes: 60,
    favorite: false,
  },
];

// Create a mutable copy of services
let currentServices = [...ALL_SERVICES];

// Get all services
export function getAllServices(): Service[] {
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

// Initialize favorites from localStorage
loadFavoritesFromStorage();
