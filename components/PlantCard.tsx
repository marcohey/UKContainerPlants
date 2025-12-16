import React from 'react';
import { Plant, LightRequirement, FoliageType, SoilType } from '../types';
import { Sun, CloudSun, Cloud, AlertTriangle, Sprout, Ban, Layers } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  // Use a dynamic search query to fetch a relevant image for the specific plant species
  // Using scientific name ensures accuracy
  const imageQuery = encodeURIComponent(`${plant.scientificName} ${plant.name} plant`);
  const imageUrl = `https://tse2.mm.bing.net/th?q=${imageQuery}&w=500&h=400&c=7&rs=1&p=0`;

  const getLightIcon = (tags: LightRequirement[]) => {
    if (tags.includes(LightRequirement.Sun)) return <Sun className="w-4 h-4 text-amber-500" />;
    if (tags.includes(LightRequirement.PartialShade)) return <CloudSun className="w-4 h-4 text-orange-400" />;
    return <Cloud className="w-4 h-4 text-slate-400" />;
  };

  const getFoliageColor = (type: FoliageType) => {
    switch (type) {
      case FoliageType.Evergreen: return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case FoliageType.SemiEvergreen: return "bg-green-100 text-green-800 border-green-200";
      case FoliageType.Deciduous: return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getSoilColor = (type: SoilType) => {
    switch (type) {
      case SoilType.Moist: return "bg-blue-50 text-blue-700 border-blue-200";
      case SoilType.WellDrained: return "bg-stone-50 text-stone-600 border-stone-200";
      case SoilType.Gritty: return "bg-orange-50 text-orange-800 border-orange-200";
      case SoilType.Ericaceous: return "bg-purple-50 text-purple-800 border-purple-200";
      case SoilType.Fertile: return "bg-lime-50 text-lime-800 border-lime-200";
      default: return "bg-stone-50 text-stone-600 border-stone-200";
    }
  };

  const borderColor = plant.notRecommended ? "border-red-300 ring-1 ring-red-100" : "border-stone-100";
  const shadowHover = plant.notRecommended ? "hover:shadow-red-100" : "hover:shadow-md";

  return (
    <div className={`bg-white rounded-xl shadow-sm ${shadowHover} transition-shadow duration-300 overflow-hidden border ${borderColor} flex flex-col h-full relative group`}>
      {plant.notRecommended && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-red-600 text-white text-xs font-bold py-1 px-3 text-center uppercase tracking-wide">
          Not Recommended for Containers
        </div>
      )}
      
      <div className="h-48 overflow-hidden bg-stone-200 relative">
        <img 
          src={imageUrl} 
          alt={`${plant.name} - ${plant.scientificName}`}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${plant.notRecommended ? 'grayscale-[0.5]' : ''}`}
          loading="lazy"
          onError={(e) => {
            // Fallback to a placeholder if the search image fails
            e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(plant.name)}`;
          }}
        />
        <div className="absolute top-3 right-3 flex gap-2 flex-col items-end mt-6">
           {plant.native && (
            <span className="px-2 py-1 bg-leaf-600 text-white text-xs font-bold rounded-full shadow-sm" title="Native to Britain">
              UK Native
            </span>
           )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <p className="text-xs text-stone-500 font-serif italic mb-1">{plant.scientificName}</p>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold text-stone-800 leading-tight">{plant.name}</h3>
            {plant.notRecommended && <Ban className="w-5 h-5 text-red-500 shrink-0" />}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded border ${getFoliageColor(plant.foliage)}`}>
            {plant.foliage}
          </span>
          <span className="text-xs px-2 py-0.5 rounded border bg-stone-50 border-stone-200 text-stone-600 flex items-center gap-1">
             {getLightIcon(plant.lightTags)}
             {plant.lightTags[0]}
          </span>
        </div>
        
        {/* Soil Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
           {plant.soilTags && plant.soilTags.map((soil, idx) => (
             <span key={idx} className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${getSoilColor(soil)}`}>
               <Layers className="w-3 h-3 opacity-70" />
               {soil}
             </span>
           ))}
        </div>

        <div className="space-y-3 text-sm text-stone-600 flex-1">
          <div>
            <span className="font-semibold text-stone-800">Dimensions:</span> {plant.dimensions}
          </div>
          <p className="line-clamp-3" title={plant.appearance}>{plant.appearance}</p>
          
          <div className="pt-2 border-t border-stone-100 mt-2">
            <div className="flex items-start gap-2">
              <Sprout className="w-4 h-4 text-leaf-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600">{plant.ecologicalImportance}</p>
            </div>
          </div>

          {plant.limitations && (
             <div className="pt-2 mt-auto">
              <div className={`flex items-start gap-2 p-2 rounded text-xs border ${plant.notRecommended ? 'bg-red-50 text-red-800 border-red-100' : 'bg-amber-50 text-amber-800 border-amber-100'}`}>
                {plant.notRecommended ? <Ban className="w-3 h-3 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />}
                <p>{plant.limitations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;