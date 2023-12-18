import React, { useState } from 'react';
import mockCompanies from '../data/mockData'; 

const PortfolioPage = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [columns, setColumns] = useState(['marketCap']); // Default column
  const [searchCompany, setSearchCompany] = useState('');
  const [searchInfo, setSearchInfo] = useState('');

  // Filters companies based on search input
  const filteredCompanies = searchCompany
    ? mockCompanies.filter(company =>
        company.comp_basic.shortName.toLowerCase().includes(searchCompany.toLowerCase())
      )
    : [];

  // Information fields that could be added as columns
  const infoFields = ['dayLow', 'dayHigh', 'open', 'close']; // Extend with more fields as needed

  // Filters information fields based on search input
  const filteredInfoFields = searchInfo
    ? infoFields.filter(field => field.toLowerCase().includes(searchInfo.toLowerCase()))
    : [];

  const handleSelectCompany = (company) => {
    if (!selectedCompanies.some(selected => selected.comp_key === company.comp_key)) {
      setSelectedCompanies([...selectedCompanies, company]);
      setSearchCompany(''); // Clear the search field
    }
  };

  const handleSelectInfo = (info) => {
    if (!columns.includes(info)) {
      setColumns([...columns, info]);
      setSearchInfo(''); // Clear the search field
    }
  };

  return (
    <div>
      <h1>Portfolio</h1>
      <input
        type="text"
        placeholder="Search company..."
        value={searchCompany}
        onChange={(e) => setSearchCompany(e.target.value)}
      />
      {filteredCompanies.map(company => (
        <div key={company.comp_key} onClick={() => handleSelectCompany(company)}>
          {company.comp_basic.shortName}
        </div>
      ))}
      <input
        type="text"
        placeholder="Search info..."
        value={searchInfo}
        onChange={(e) => setSearchInfo(e.target.value)}
      />
      {filteredInfoFields.map(info => (
        <div key={info} onClick={() => handleSelectInfo(info)}>
          {info}
        </div>
      ))}
      <table>
        <thead>
          <tr>
            <th>Company</th>
            {columns.map(column => <th key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {selectedCompanies.map(company => (
            <tr key={company.comp_key}>
              <td>{company.comp_basic.shortName}</td>
              {columns.map(column => (
                <td key={`${company.comp_key}-${column}`}>
                  {/* Check if the column is from comp_basic or comp_market */}
                  {column in company.comp_basic ? company.comp_basic[column] : company.comp_market[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioPage;
