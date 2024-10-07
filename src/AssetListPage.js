import React, { useState, useEffect } from 'react';
import { assetData } from './data'; 

const AssetListPage = () => {
  const [data, setData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [minPrice, setMinPrice] = useState(''); 
  const [maxPrice, setMaxPrice] = useState(''); 
  const [minPERatio, setMinPERatio] = useState(''); 
  const [maxPERatio, setMaxPERatio] = useState(''); 
  const [selectedSector, setSelectedSector] = useState(''); 
  const [sortConfig, setSortConfig] = useState({ key: 'ticker', direction: 'descending' }); 
  const [priceError, setPriceError] = useState(''); 
  const [showAdvanced, setShowAdvanced] = useState(false); 

  // Parse market cap strings into numerical values (in billions)
  const parseMarketCap = (marketCapStr) => {
    if (!marketCapStr) return 0; 
    const units = {
      M: 0.001, // Million 
      B: 1,     // Billion
      T: 1000,  // Trillion
    };
    const unit = marketCapStr.slice(-1).toUpperCase(); 
    const value = parseFloat(marketCapStr.slice(0, -1)); 
    return value * (units[unit] || 0);
  };

  // Function to sort data 
  const sortData = (dataToSort, config) => {
    if (!config || !config.key) return dataToSort; 
    const sortedData = [...dataToSort]; // Create a copy of the data to avoid mutating the original array
    const { key, direction } = config;
    const order = direction === 'ascending' ? 1 : -1; 

    sortedData.sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'marketCap') {
        aValue = parseMarketCap(aValue);
        bValue = parseMarketCap(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Reverse sorting for letter-based categories
      if (key === 'category' || key === 'sector' || key === 'ticker') {
        if (aValue > bValue) return -order; 
        if (aValue < bValue) return order;
        return 0; 
      } else {
        if (aValue > bValue) return order;
        if (aValue < bValue) return -order;
        return 0; 
      }
    });

    return sortedData; 
  };

  useEffect(() => {
    const initialSortedData = sortData(assetData, sortConfig);
    setData(initialSortedData);
  }, []); 

  useEffect(() => {
    const sortedData = sortData(assetData, sortConfig);
    setData(sortedData); 
  }, [sortConfig]); // Runs whenever sortConfig changes

  // Handler function for sorting when a column header is clicked
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'; 
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending'; 
    }
    setSortConfig({ key, direction }); 
  };

  // Handler function for minimum price input change
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    if (maxPrice && value > maxPrice) {
      setPriceError('Min price cannot be greater than Max price'); 
    } else {
      setPriceError(''); 
    }
  };

  // Handler function for maximum price input change
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    if (minPrice && value < minPrice) {
      setPriceError('Max price cannot be less than Min price');
    } else {
      setPriceError(''); 
    }
  };

  // Filter the data based on search term and selected filters
  const filteredData = data.filter((item) => {
    // Check if the item matches the search term (ticker or category)
    const matchesSearchTerm =
      item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the item matches the selected category
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

    // Function to check if the item matches the price range
    const matchesPrice = () => {
      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;
      return true;
    };

    // Function to check if the item matches the P/E ratio range
    const matchesPERatio = () => {
      if (!showAdvanced) return true; 
      if (minPERatio && item.peRatio < Number(minPERatio)) return false;
      if (maxPERatio && item.peRatio > Number(maxPERatio)) return false;
      return true;
    };

    // Check if the item matches the selected sector
    const matchesSector = () => {
      if (!showAdvanced) return true; 
      return selectedSector ? item.sector === selectedSector : true;
    };

    // Return true if the item matches all conditions
    return (
      matchesSearchTerm &&
      matchesCategory &&
      matchesPrice() &&
      matchesPERatio() &&
      matchesSector()
    );
  });


  return (
    <div
      className="min-h-screen bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: "url('/images/lighthouse.jpg')", 
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg w-full md:w-3/5 mx-auto mt-16 h-[70vh] flex flex-col">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Asset List</h1>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by ticker or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2"
          />
          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">All Categories</option>

            {[...new Set(assetData.map((item) => item.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {/* Minimum Price Input */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={handleMinPriceChange}
            className="border rounded-lg p-2"
          />
          {/* Maximum Price Input */}
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            className="border rounded-lg p-2"
          />
        </div>

        {/* Advanced Filters Section */}
        {showAdvanced && (
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {/* Sector Filter Dropdown */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="">All Sectors</option>
              {[...new Set(assetData.map((item) => item.sector))].map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>

            {/* Minimum P/E Ratio Input */}
            <input
              type="number"
              placeholder="Min P/E Ratio"
              value={minPERatio}
              onChange={(e) => setMinPERatio(e.target.value)}
              className="border rounded-lg p-2"
            />
            {/* Maximum P/E Ratio Input */}
            <input
              type="number"
              placeholder="Max P/E Ratio"
              value={maxPERatio}
              onChange={(e) => setMaxPERatio(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>
        )}

        {/* Toggle for Advanced Filters */}
        <div className="flex justify-center mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              className="form-checkbox"
            />
            <span className="text-white">Show Advanced Categories</span>
          </label>
        </div>

        {priceError && <p className="text-red-500 text-center">{priceError}</p>}

        {/* Asset Table */}
        <div className="flex-grow overflow-y-auto border border-gray-300 rounded-lg shadow-lg bg-white">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {/* Ticker Column Header */}
                <th
                  onClick={() => handleSort('ticker')}
                  className="p-4 bg-blue-500 text-white font-bold text-left cursor-pointer"
                >
                  Ticker{' '}
                  {sortConfig?.key === 'ticker' &&
                    (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                {/* Price Column Header */}
                <th
                  onClick={() => handleSort('price')}
                  className="p-4 bg-blue-500 text-white font-bold text-left cursor-pointer"
                >
                  Price{' '}
                  {sortConfig?.key === 'price' &&
                    (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                {/* Category Column Header */}
                <th
                  onClick={() => handleSort('category')}
                  className="p-4 bg-blue-500 text-white font-bold text-left cursor-pointer"
                >
                  Category{' '}
                  {sortConfig?.key === 'category' &&
                    (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>

                {/* Additional Columns for Advanced Filters */}
                {showAdvanced && (
                  <>
                    {/* Market Cap Column Header */}
                    <th
                      onClick={() => handleSort('marketCap')}
                      className="p-4 bg-blue-500 text-white font-bold text-left cursor-pointer"
                    >
                      Market Cap{' '}
                      {sortConfig?.key === 'marketCap' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    {/* Sector Column Header */}
                    <th
                      onClick={() => handleSort('sector')}
                      className="p-4 bg-blue-500 text-white font-bold text-left cursor-pointer"
                    >
                      Sector{' '}
                      {sortConfig?.key === 'sector' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    {/* P/E Ratio Column Header */}
                    <th
                      onClick={() => handleSort('peRatio')}
                      className="p-4 bg-blue-500 text-white font-bold text-left cursor-pointer"
                    >
                      P/E Ratio{' '}
                      {sortConfig?.key === 'peRatio' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Display filtered data */}
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.ticker} className="hover:bg-gray-100">
                    <td className="p-4 border-b">{item.ticker}</td>
                    <td className="p-4 border-b">${item.price.toFixed(2)}</td>
                    <td className="p-4 border-b">{item.category}</td>

                    {/* Additional Cells for Advanced Filters */}
                    {showAdvanced && (
                      <>
                        <td className="p-4 border-b">{item.marketCap}</td>
                        <td className="p-4 border-b">{item.sector}</td>
                        <td className="p-4 border-b">{item.peRatio}</td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showAdvanced ? 6 : 3} className="text-center p-4">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetListPage;
