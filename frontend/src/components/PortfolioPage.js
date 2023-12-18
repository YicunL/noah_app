import React, { useState, useMemo } from 'react';
import mockCompanies from '../data/mockData'; 

const PortfolioPage = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [columns, setColumns] = useState(['marketCap']); // Default column
  const [searchCompany, setSearchCompany] = useState('');
  const [searchInfo, setSearchInfo] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  // DIY
  const [diyVariable, setDiyVariable] = useState('');
  const [diyFormula, setDiyFormula] = useState('');

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
      setSearchCompany(''); // Clear the search field
    }
  };

  const handleSelectInfo = (info) => {
    if (!columns.includes(info)) {
      setColumns([...columns, info]);
      setSearchInfo(''); // Clear the search field
    }
  };

  const sortCompanies = (key) => {
    setSortConfig(currentConfig => {
      // If the current sort key is the same as the clicked key, toggle the direction
      if (currentConfig && currentConfig.key === key) {
        return {
          key: key,
          direction: currentConfig.direction === 'ascending' ? 'descending' : 'ascending'
        };
      }
      // Otherwise, set the new key and default to ascending order
      return {
        key: key,
        direction: 'ascending'
      };
    });
  };

  const sortedCompanies = useMemo(() => {
    let sortableCompanies = [...selectedCompanies];
    if (sortConfig !== null) {
      sortableCompanies.sort((a, b) => {
        const aValue = sortConfig.key in a.comp_basic ? a.comp_basic[sortConfig.key] : a.comp_market[sortConfig.key];
        const bValue = sortConfig.key in b.comp_basic ? b.comp_basic[sortConfig.key] : b.comp_market[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCompanies;
  }, [selectedCompanies, sortConfig]);


  const handleDiyFormulaChange = (event) => {
    setDiyFormula(event.target.value);
  };

  const applyDiyVariable = () => {
    try {
      setSelectedCompanies(currentCompanies =>
        currentCompanies.map(company => {
          const formula = diyFormula
            .replace(/marketCap/g, `(${company.comp_basic.marketCap})`)
            .replace(/open/g, `(${company.comp_market.open})`);
          const result = eval(formula);
          return { ...company, diyVariable: result };
        })
      );
      if (!columns.includes('diyVariable')) {
        setColumns([...columns, 'diyVariable']);
      }
    } catch (error) {
      console.error('Error in DIY formula:', error);
      alert('There was an error with your formula. Please check it and try again.');
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
        placeholder="Enter DIY formula..."
        value={diyFormula}
        onChange={handleDiyFormulaChange}
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
