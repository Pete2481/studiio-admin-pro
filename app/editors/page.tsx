"use client";
import { useState } from "react";
import { Search, Star, CheckCircle, User, Camera, Map } from "lucide-react";

interface Editor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  projects: number;
  isSelected: boolean;
  skills: string[];
}

const photoEditors: Editor[] = [
  {
    id: "pe1",
    name: "Sarah Chen",
    specialty: "Real Estate Photography",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    projects: 127,
    isSelected: false,
    skills: ["HDR Editing", "Color Correction", "Virtual Staging"]
  },
  {
    id: "pe2",
    name: "Marcus Rodriguez",
    specialty: "Architectural Photography",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    projects: 89,
    isSelected: false,
    skills: ["Interior Enhancement", "Lighting Effects", "Perspective Correction"]
  },
  {
    id: "pe3",
    name: "Emma Thompson",
    specialty: "Luxury Property Editing",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5.0,
    projects: 203,
    isSelected: false,
    skills: ["Luxury Enhancement", "Detail Retouching", "Atmospheric Effects"]
  },
  {
    id: "pe4",
    name: "David Kim",
    specialty: "Commercial Real Estate",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    projects: 156,
    isSelected: false,
    skills: ["Commercial Enhancement", "Space Optimization", "Professional Styling"]
  }
];

const floorPlanEditors: Editor[] = [
  {
    id: "fpe1",
    name: "Alexandra Park",
    specialty: "Residential Floor Plans",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    projects: 94,
    isSelected: false,
    skills: ["AutoCAD", "Space Planning", "3D Visualization"]
  },
  {
    id: "fpe2",
    name: "James Wilson",
    specialty: "Commercial Floor Plans",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    projects: 67,
    isSelected: false,
    skills: ["Revit", "Building Codes", "Technical Drawing"]
  },
  {
    id: "fpe3",
    name: "Sophie Anderson",
    specialty: "Luxury Home Plans",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5.0,
    projects: 112,
    isSelected: false,
    skills: ["Luxury Design", "Custom Layouts", "Interior Integration"]
  },
  {
    id: "fpe4",
    name: "Michael Chang",
    specialty: "Multi-Unit Developments",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    projects: 78,
    isSelected: false,
    skills: ["Multi-Unit Planning", "Efficiency Optimization", "Scale Drawing"]
  }
];

export default function EditorsPage() {
  const [photoEditorsList, setPhotoEditorsList] = useState<Editor[]>(photoEditors);
  const [floorPlanEditorsList, setFloorPlanEditorsList] = useState<Editor[]>(floorPlanEditors);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditorSelect = (editorId: string, section: 'photo' | 'floorplan') => {
    if (section === 'photo') {
      setPhotoEditorsList(prev => 
        prev.map(editor => 
          editor.id === editorId 
            ? { ...editor, isSelected: !editor.isSelected }
            : editor
        )
      );
    } else {
      setFloorPlanEditorsList(prev => 
        prev.map(editor => 
          editor.id === editorId 
            ? { ...editor, isSelected: !editor.isSelected }
            : editor
        )
      );
    }
  };

  const filteredPhotoEditors = photoEditorsList.filter(editor =>
    editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    editor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    editor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFloorPlanEditors = floorPlanEditorsList.filter(editor =>
    editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    editor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    editor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedPhotoEditors = photoEditorsList.filter(editor => editor.isSelected).length;
  const selectedFloorPlanEditors = floorPlanEditorsList.filter(editor => editor.isSelected).length;

  return (
    <div className="ml-68 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editors</h1>
          <p className="text-gray-600">Select the editors you want to work with for your projects</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search editors by name, specialty, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Photo Editors Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Photo Editors</h2>
                <p className="text-gray-600">Professional photo editing and enhancement specialists</p>
              </div>
            </div>
            {selectedPhotoEditors > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {selectedPhotoEditors} selected
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotoEditors.map((editor) => (
              <div
                key={editor.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
                  editor.isSelected 
                    ? 'border-teal-500 shadow-teal-100' 
                    : 'border-gray-200 hover:border-teal-300'
                }`}
                onClick={() => handleEditorSelect(editor.id, 'photo')}
              >
                {/* Editor Avatar */}
                <div className="relative p-6 pb-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={editor.avatar}
                        alt={editor.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl font-semibold text-gray-600 border-4 border-white shadow-lg">
                              ${editor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          `;
                        }}
                      />
                      {editor.isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editor Info */}
                <div className="px-6 pb-6">
                  <h3 className="font-semibold text-gray-900 text-center mb-1">{editor.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">{editor.specialty}</p>
                  
                  {/* Rating and Projects */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{editor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{editor.projects} projects</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {editor.skills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {editor.skills.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{editor.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Plan Editors Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Map className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Floor Plan Editors</h2>
                <p className="text-gray-600">Expert floor plan design and technical drawing specialists</p>
              </div>
            </div>
            {selectedFloorPlanEditors > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {selectedFloorPlanEditors} selected
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFloorPlanEditors.map((editor) => (
              <div
                key={editor.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
                  editor.isSelected 
                    ? 'border-teal-500 shadow-teal-100' 
                    : 'border-gray-200 hover:border-teal-300'
                }`}
                onClick={() => handleEditorSelect(editor.id, 'floorplan')}
              >
                {/* Editor Avatar */}
                <div className="relative p-6 pb-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={editor.avatar}
                        alt={editor.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-2xl font-semibold text-gray-600 border-4 border-white shadow-lg">
                              ${editor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          `;
                        }}
                      />
                      {editor.isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editor Info */}
                <div className="px-6 pb-6">
                  <h3 className="font-semibold text-gray-900 text-center mb-1">{editor.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">{editor.specialty}</p>
                  
                  {/* Rating and Projects */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{editor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{editor.projects} projects</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {editor.skills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {editor.skills.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{editor.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {(selectedPhotoEditors > 0 || selectedFloorPlanEditors > 0) && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3">Selected Editors Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  <strong>{selectedPhotoEditors}</strong> Photo Editor{selectedPhotoEditors !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  <strong>{selectedFloorPlanEditors}</strong> Floor Plan Editor{selectedFloorPlanEditors !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-teal-200">
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Continue with Selected Editors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
