import React, { useState, useMemo } from 'react';
import mockCompanies from '../data/mockData'; // Make sure the path is correct
import { evaluate } from 'mathjs';

const PortfolioPage = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [columns, setColumns] = useState(['marketCap']); // Default column
  const [searchCompany, setSearchCompany] = useState('');
  const [searchInfo, setSearchInfo] = useState('');
  const [diyFormula, setDiyFormula] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const filteredCompanies = useMemo(() => {
    return searchCompany
      ? mockCompanies.filter(company =>
          company.comp_basic.shortName.toLowerCase().includes(searchCompany.toLowerCase())
        )
      : [];
  }, [searchCompany]);

  const infoFields = ['marketCap', 'dayLow', 'dayHigh', 'open', 'close']; // Extend with more fields as needed
  const filteredInfoFields = useMemo(() => {
    return searchInfo
      ? infoFields.filter(field => field.toLowerCase().includes(searchInfo.toLowerCase()))
      : [];
  }, [searchInfo, infoFields]);

  const handleSelectCompany = (company) => {
    if (!selectedCompanies.some(selected => selected.comp_key === company.comp_key)) {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleSelectInfo = (info) => {
    if (!columns.includes(info)) {
      setColumns([...columns, info]);
    }
  };

  const sortCompanies = (key) => {
    setSortConfig(currentConfig => {
      // Toggle the direction or set new key and default to ascending
      return {
        key: key,
        direction:
          currentConfig && currentConfig.key === key && currentConfig.direction === 'ascending'
            ? 'descending'
            : 'ascending'
      };
    });
  };

  const applyDiyVariable = () => {
    try {
      // Update selected companies with evaluated DIY variable
      setSelectedCompanies(currentCompanies =>
        currentCompanies.map(company => {
          // Prepare the scope with all available variables for the formula
          const scope = {
            marketCap: company.comp_basic.marketCap,
            open: company.comp_market.open,
            // Add more variables from company data if needed
          };

          // Evaluate the formula using the scope
          const result = evaluate(diyFormula, scope);
          return { ...company, diyVariable: result };
        })
      );

      // Add the DIY variable column if it's not already present
      if (!columns.includes('diyVariable')) {
        setColumns([...columns, 'diyVariable']);
      }
    } catch (error) {
      alert('Invalid formula. Please check your input.');
    }
  };

  const sortedCompanies = useMemo(() => {
    if (sortConfig !== null) {
      return [...selectedCompanies].sort((a, b) => {
        // Adjust the sorting logic to handle different data structures
        // and potentially the new DIY variable
        // ...sorting logic here
      });
    }
    return selectedCompanies;
  }, [selectedCompanies, sortConfig]);

  return (
    <div>
      <h1>Portfolio</h1>
      <input
        type="text"
        placeholder="Search company..."
        value={searchCompany}
        onChange={(e) => setSearchCompany(e.target.value)}
      />
      {searchCompany && filteredCompanies.map(company => (
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
      {searchInfo && filteredInfoFields.map(info => (
        <div key={info} onClick={() => handleSelectInfo(info)}>
          {info}
        </div>
      ))}
      <input
        type="text"
        placeholder="0.5*marketCap+0.5*open"
        value={diyFormula}
        onChange={(e) => setDiyFormula(e.target.value)}
      />
      <button onClick={applyDiyVariable}>Apply DIY Variable</button>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            {columns.map(column => (
              <th key={column} onClick={() => sortCompanies(column)}>
                {column}
                {sortConfig && sortConfig.key === column ? (
                  sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedCompanies.map(company => (
            <tr key={company.comp_key}>
              <td>{company.comp_basic.shortName}</td>
              {columns.map(column => (
                <td key={`${company.comp_key}-${column}`}>
                  {column in company.comp_basic
                    ? company.comp_basic[column]
                    : column === 'diyVariable'
                    ? company.diyVariable
                    : company.comp_market[column]}
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
