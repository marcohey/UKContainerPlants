import React from 'react';
import { X, Sprout, Info } from 'lucide-react';

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 p-4 sm:p-6 flex items-center justify-between z-10 rounded-t-xl">
          <h2 className="text-2xl font-serif font-bold text-stone-800 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-leaf-600" />
            Garden Guide Info
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-800"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto text-stone-700 leading-relaxed space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-leaf-800 font-serif mb-3 border-b border-leaf-100 pb-2">
              Introduction: Container Plants and Ecology
            </h3>
            <p className="mb-4">
              Container and planter cultivation offers both aesthetic and ecological value within urban and domestic spaces. By using suitable species—matched to light, moisture, and soil conditions—you can create living structures that enrich biodiversity while providing seasonal colour and form. Containers extend planting opportunities to paved areas, balconies, and courtyards, supporting pollinators, improving air quality, and softening hard landscapes.
            </p>
            <p>
              Selecting the right plant for the right place is essential. Species chosen for their tolerance of restricted root zones, varying exposures, and limited water availability will thrive, reducing maintenance and resource use. Combining native and non-native plants can create resilient and ecologically diverse displays that remain attractive year-round.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-leaf-800 font-serif mb-3 border-b border-leaf-100 pb-2">
              Preamble
            </h3>
            <p>
              This catalogue presents a curated selection of both native and non-native plant species suited to container and planter use across Britain’s temperate maritime climate. It is intended as a reference for gardeners, designers, and community landscapers who wish to combine sustainability with visual appeal. Each entry summarises growth habit, appearance, and ecological value, helping users choose plants that contribute both beauty and biodiversity.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-leaf-800 font-serif mb-3 border-b border-leaf-100 pb-2">
              General Guidance
            </h3>
            <p className="mb-4">
              Successful container planting depends upon sound horticultural practice. Use high-quality, peat-free compost and ensure adequate drainage. Combine soil-based media with grit or perlite to improve aeration and stability. Regular watering and feeding sustain growth, while annual top-dressing refreshes fertility.
            </p>
            
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
              <h4 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-leaf-600" />
                General Tips
              </h4>
              <ul className="space-y-3 list-disc pl-5 text-sm sm:text-base">
                <li>
                  <strong className="text-stone-900">Containers:</strong> Choose appropriately sized pots with drainage holes. Terracotta dries quickly; plastic or fibre-glass retains moisture longer. Raise pots slightly off the ground to aid drainage.
                </li>
                <li>
                  <strong className="text-stone-900">Compost:</strong> Use a peat-free, loam-based mix such as John Innes No. 3. Drought-tolerant herbs prefer freer-draining media.
                </li>
                <li>
                  <strong className="text-stone-900">Watering:</strong> Containers dry out rapidly. Water frequently in summer, sparingly in winter. Once established, drought-tolerant species require less frequent watering.
                </li>
                <li>
                  <strong className="text-stone-900">Feeding:</strong> Apply a balanced liquid fertiliser every few weeks during active growth.
                </li>
                <li>
                  <strong className="text-stone-900">Location:</strong> Position planters to match species’ light requirements. Sheltered spots reduce wind stress and moisture loss.
                </li>
              </ul>
            </div>
          </section>

          <div className="pt-6 border-t border-stone-200 text-sm text-stone-500 italic">
            <p>Based on "Suggested plants for container and planter use in Britain" developed by Denis J Vickers BSc(Hons), FLS, CBiol, MRSB, MCIEEM. Consultant Ecologist/Chartered Biologist.</p>
            <p className="mt-1">Adapted into webapp by Marco Mak.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPanel;