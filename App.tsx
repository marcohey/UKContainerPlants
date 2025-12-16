import React, { useState, useMemo } from 'react';
import { plants } from './data';
import PlantCard from './components/PlantCard';
import AboutPanel from './components/AboutPanel';
import { PlantCategory, LightRequirement, FoliageType, SoilType } from './types';
import { Search, Filter, Leaf, X, Info, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'All'>('All');
  const [filterNative, setFilterNative] = useState<boolean | 'All'>('All');
  const [filterLight, setFilterLight] = useState<LightRequirement | 'All'>('All');
  const [filterFoliage, setFilterFoliage] = useState<FoliageType | 'All'>('All');
  const [filterSoil, setFilterSoil] = useState<SoilType | 'All'>('All');

  const categories = Object.values(PlantCategory);
  const lightReqs = Object.values(LightRequirement);
  const foliageTypes = Object.values(FoliageType);
  const soilTypes = Object.values(SoilType);

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      // Text Search
      const searchMatch = 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!searchMatch) return false;

      // Category Filter
      if (selectedCategory !== 'All' && plant.category !== selectedCategory) return false;

      // Native Filter
      if (filterNative !== 'All' && plant.native !== filterNative) return false;

      // Light Filter
      if (filterLight !== 'All' && !plant.lightTags.includes(filterLight)) return false;

      // Foliage Filter
      if (filterFoliage !== 'All' && plant.foliage !== filterFoliage) return false;

      // Soil Filter
      if (filterSoil !== 'All' && plant.soilTags && !plant.soilTags.includes(filterSoil)) return false;

      return true;
    });
  }, [searchTerm, selectedCategory, filterNative, filterLight, filterFoliage, filterSoil]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setFilterNative('All');
    setFilterLight('All');
    setFilterFoliage('All');
    setFilterSoil('All');
    setSearchTerm('');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title & Metadata
    doc.setTextColor(22, 101, 52); // leaf-800
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Plant Palette for Containers (UK)", 14, 20);

    doc.setTextColor(87, 83, 78); // stone-600
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Plant Selection Export | ${new Date().toLocaleDateString()}`, 14, 28);

    
    // Add filtering context info if filters are active
    const activeFilters = [];
    if (selectedCategory !== 'All') activeFilters.push(`Category: ${selectedCategory}`);
    if (filterNative !== 'All') activeFilters.push(`Origin: ${filterNative ? 'Native' : 'Non-native'}`);
    if (filterLight !== 'All') activeFilters.push(`Light: ${filterLight}`);
    if (filterSoil !== 'All') activeFilters.push(`Soil: ${filterSoil}`);
    
    if (activeFilters.length > 0) {
        doc.text(`Filters: ${activeFilters.join(', ')}`, 14, 34);
    } else {
        doc.text("Full Catalogue", 14, 34);
    }

    let currentY = 40;

    // Define categories to loop through (either all or just the selected one)
    const categoriesToExport = selectedCategory === 'All' ? Object.values(PlantCategory) : [selectedCategory];

    categoriesToExport.forEach(category => {
      // Get plants for this category from the CURRENT filtered list
      // This ensures we respect other filters (like Sun, Soil) within the categories
      const categoryPlants = filteredPlants.filter(p => p.category === category);

      if (categoryPlants.length === 0) return;

      // Check for page break space for the header
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      // Category Header Table (used just for styling the header row easily)
      autoTable(doc, {
        startY: currentY,
        head: [[category.toUpperCase()]],
        body: [],
        theme: 'plain',
        headStyles: { 
            fontSize: 12, 
            fontStyle: 'bold', 
            textColor: [22, 101, 52], // leaf-800
            fillColor: [240, 253, 244], // leaf-50
            halign: 'left'
        },
        margin: { left: 14, right: 14 },
      });
      
      // Calculate Y for the data table
      const headerTable = (doc as any).lastAutoTable;
      const tableStartY = headerTable.finalY + 2;

      // Plants Data Table
      autoTable(doc, {
        startY: tableStartY,
        head: [['Name', 'Native', 'Light', 'Soil', 'Dimensions', 'Ecological Value']],
        body: categoryPlants.map(p => [
          `${p.name}\n(${p.scientificName})${p.notRecommended ? '\n[NOT RECOMMENDED]' : ''}`,
          p.native ? 'Yes' : 'No',
          p.lightTags.join(', '),
          p.soilTags ? p.soilTags.join(', ') : '-',
          p.dimensions,
          p.ecologicalImportance
        ]),
        headStyles: { 
            fillColor: [22, 163, 74], // leaf-600
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: { 
            fontSize: 9, 
            overflow: 'linebreak',
            cellPadding: 3,
            valign: 'top'
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 }, // Name
            1: { cellWidth: 12, halign: 'center' }, // Native
            2: { cellWidth: 25 }, // Light
            3: { cellWidth: 25 }, // Soil
            4: { cellWidth: 25 }, // Dimensions
            5: { cellWidth: 'auto' } // Eco
        },
        alternateRowStyles: {
            fillColor: [250, 250, 249] // stone-50
        },
        // Color the text red if the plant is not recommended
        didParseCell: (data) => {
            if (data.section === 'body') {
                const plant = categoryPlants[data.row.index];
                if (plant && plant.notRecommended) {
                    data.cell.styles.textColor = [185, 28, 28]; // red-700
                }
            }
        },
        margin: { left: 14, right: 14 }
      });

      // Update Y for next category
      currentY = (doc as any).lastAutoTable.finalY + 10;
    });
    
    // Add page numbers footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Container Garden Palette. Plant list by Denis J Vickers. App by Marco Mak`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save('container-garden-palette.pdf');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-leaf-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-leaf-300" />
            <h1 className="text-xl font-bold font-serif tracking-wide hidden sm:block">Plant Palette for Containers</h1>
            <h1 className="text-xl font-bold font-serif tracking-wide sm:hidden">Plant Palette</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-leaf-700/50 hover:bg-leaf-700 rounded-lg text-sm transition-colors border border-leaf-600/50"
              title="Export Selection as PDF"
            >
              <Download className="w-4 h-4 text-leaf-200" />
              <span className="hidden sm:inline text-leaf-50 font-medium">Export</span>
            </button>

            <button 
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-leaf-700/50 hover:bg-leaf-700 rounded-lg text-sm transition-colors border border-leaf-600/50"
              title="About & Guide"
            >
              <Info className="w-4 h-4 text-leaf-200" />
              <span className="hidden sm:inline text-leaf-50 font-medium">Guide</span>
            </button>

            <button 
              className="md:hidden p-2 hover:bg-leaf-700 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Filter className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        
        {/* Sidebar Filter - Desktop & Mobile Drawer */}
        <aside className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:block
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          overflow-y-auto pt-16 md:pt-0
        `}>
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between md:hidden mb-4">
              <h2 className="font-bold text-stone-800 text-lg">Filters</h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search plants..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === 'All'}
                    onChange={() => setSelectedCategory('All')}
                    className="accent-leaf-600"
                  />
                  <span className={`text-sm ${selectedCategory === 'All' ? 'text-leaf-700 font-medium' : 'text-stone-600 group-hover:text-stone-900'}`}>All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-leaf-600"
                    />
                    <span className={`text-sm ${selectedCategory === cat ? 'text-leaf-700 font-medium' : 'text-stone-600 group-hover:text-stone-900'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Native Status */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Origin</label>
              <select 
                className="w-full bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-leaf-500 focus:border-leaf-500 block p-2.5 outline-none"
                value={filterNative.toString()}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterNative(val === 'All' ? 'All' : val === 'true');
                }}
              >
                <option value="All">Any Origin</option>
                <option value="true">Native to Britain</option>
                <option value="false">Non-Native</option>
              </select>
            </div>

            {/* Light */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Sunlight</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilterLight('All')}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${filterLight === 'All' ? 'bg-leaf-600 text-white border-leaf-600' : 'bg-white text-stone-600 border-stone-200 hover:border-leaf-300'}`}
                >
                  Any
                </button>
                {lightReqs.map(light => (
                  <button 
                    key={light}
                    onClick={() => setFilterLight(light)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${filterLight === light ? 'bg-leaf-600 text-white border-leaf-600' : 'bg-white text-stone-600 border-stone-200 hover:border-leaf-300'}`}
                  >
                    {light}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Soil & Compost</label>
              <select 
                className="w-full bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-leaf-500 focus:border-leaf-500 block p-2.5 outline-none"
                value={filterSoil}
                onChange={(e) => setFilterSoil(e.target.value as SoilType | 'All')}
              >
                <option value="All">Any Soil Condition</option>
                {soilTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Foliage */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Foliage</label>
              <select 
                className="w-full bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-leaf-500 focus:border-leaf-500 block p-2.5 outline-none"
                value={filterFoliage}
                onChange={(e) => setFilterFoliage(e.target.value as FoliageType | 'All')}
              >
                <option value="All">Any Foliage</option>
                {foliageTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={resetFilters}
              className="w-full py-2 px-4 border border-stone-300 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition-colors"
            >
              Reset Filters
            </button>
            
            <div className="pt-6 border-t border-stone-100">
               <p className="text-xs text-stone-400 italic">
                 Plant list developed by Denis J Vickers BSc(Hons), FLS, CBiol, MRSB, MCIEEM Consultant Ecologist/Chartered Biologist.
               </p>
            </div>
            <div className="pt-6 border-t border-stone-100">
              <p className="text-xs text-stone-400 italic">
                 Webapp by Marco Mak.
               </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-stone-50/50">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 font-serif">Plant Selection</h2>
              <p className="text-stone-500 mt-1 text-sm">Showing {filteredPlants.length} varieties</p>
            </div>
          </div>

          {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredPlants.map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <Leaf className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-800">No plants found</h3>
              <p className="text-stone-500 mt-2 max-w-md">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button 
                onClick={resetFilters}
                className="mt-6 text-leaf-600 font-medium hover:text-leaf-800 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
      
      {/* About Panel Modal */}
      <AboutPanel isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};

export default App;