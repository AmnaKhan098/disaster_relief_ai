
import { useEffect, useRef } from "react";

interface DamageMapProps {
  areaName: string | null;
  damageScore: number;
}

const DamageMap = ({ areaName, damageScore }: DamageMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create a simple map visualization
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Create map element
    const mapElement = document.createElement('div');
    mapElement.className = 'w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden';
    
    // Add map content
    mapElement.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-green-200/50"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h3 class="font-semibold text-slate-900 mb-1">
              ${areaName || 'Affected Area'}
            </h3>
            <p class="text-sm text-slate-600">
              Damage Score: ${damageScore}/10
            </p>
            <div class="mt-2 w-24 h-2 bg-gray-200 rounded-full mx-auto">
              <div class="h-2 rounded-full ${damageScore >= 8 ? 'bg-red-500' : damageScore >= 6 ? 'bg-orange-500' : damageScore >= 4 ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${(damageScore / 10) * 100}%"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 text-xs text-slate-600">
        <div class="flex items-center space-x-1">
          <div class="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Damage Location</span>
        </div>
      </div>
    `;

    mapContainer.appendChild(mapElement);
  }, [areaName, damageScore]);

  return (
    <div className="w-full">
      <div ref={mapRef} className="w-full"></div>
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600">
          {areaName 
            ? `Showing damage assessment for ${areaName}`
            : 'Geographic visualization of affected area'
          }
        </p>
      </div>
    </div>
  );
};

export default DamageMap;
