import React, { useState, useMemo, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { evaluate } from 'mathjs';
import { mockCompanies } from '../data/mockData'; 
import styles from './PortfolioPage.module.css';

const PortfolioPage = () => {
  const [portfolioID, setPortfolioID] = useState('unique-portfolio-id'); 
  const [portfolioName, setPortfolioName] = useState('NPF Equities All');
  const [creationDate, setCreationDate] = useState(new Date().toISOString());
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [status, setStatus] = useState('Active'); // Archived,Draft etc...

  // savePortfolio
  const savePortfolio = async () => {
    const portfolioData = {
      PortfolioID: portfolioID,
      PortfolioName: portfolioName,
      CreationDate: creationDate,
      LastUpdated: new Date().toISOString(),
      Content: {
        customFormulas,
        scale,
      },
      Comments: '',
      Status: status,
    };

    //API call here, wait implementation
  };


  const [data, setData] = useState(mockCompanies);
  const [customFormulas, setCustomFormulas] = useState(['']);
  const [customResults, setCustomResults] = useState({});
  const [customFormulaErrors, setCustomFormulaErrors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [returnDeltas, setReturnDeltas] = useState([]);
  const [rowWeights, setRowWeights] = useState({});
  const [scale, setScale] = useState(1);

  const adjustScale = (newScale) => {
    setScale(newScale);
  };

  const initialColumnVisibility = {
    comp_key: true,
    ISIN: true,
    name: true,
    country: true,
    sector: true,
  };
  
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleVisibilityChange = (column) => {
    setColumnVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };


  const applyCustomFormulas = () => {
    const newCustomResults = {};
    const newErrors = Array(customFormulas.length).fill('');

    data.forEach(company => {
      customFormulas.forEach((formula, index) => {
        try {
          const scope = {
            ...company.quantitative,
            ...company.qualitative,
            ...newCustomResults[company.comp_key],
          };
          if (!newCustomResults[company.comp_key]) {
            newCustomResults[company.comp_key] = {};
          }
          newCustomResults[company.comp_key][`score${index + 1}`] = evaluate(formula, scope);
        } catch (error) {
          newErrors[index] = 'Error in formula. Please check syntax.';
        }
      });
    });

    setCustomResults(newCustomResults);
    setCustomFormulaErrors(newErrors);
  };


  const addCustomFormula = () => {
    setCustomFormulas([...customFormulas, '']);
  };

  const removeCustomFormula = index => {
    const newFormulas = customFormulas.filter((_, i) => i !== index);
    setCustomFormulas(newFormulas);
    const newCustomResults = { ...customResults };
    for (const key in newCustomResults) {
      delete newCustomResults[key][`score${index + 1}`];
    }
    setCustomResults(newCustomResults);
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[`score${index + 1}`];
      return newRow;
    });
    setData(newData);
  };

  const updateCustomFormula = (index, newFormula) => {
    setCustomFormulas(customFormulas.map((formula, i) => i === index ? newFormula : formula));
  };

  useEffect(() => {
    applyCustomFormulas();
  }, [customFormulas]);
  

  const CustomFormulaInput = ({ index, initialFormula, onFormulaChange, onRemove }) => {
    const [formula, setFormula] = useState(initialFormula);
  
    const handleInputChange = (e) => {
      e.stopPropagation();
      setFormula(e.target.value);
    };
  
    const handleBlur = () => {
      onFormulaChange(index, formula);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onFormulaChange(index, e.target.value); 
      }
    };

    const handleClick = (e) => {
      e.stopPropagation();
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleClick}>
        <input
          type="text"
          placeholder={`Score ${index + 1}`}
          value={formula}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onClick={handleClick}
        />
        <button onClick={(e) => { e.stopPropagation(); onRemove(index); }}>Remove</button>
      </div>
    );
  };

  const handleWeightChange = (key, e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the header
    const newValue = e.target.value; // Correctly get the current value of the input
    setWeights(prevWeights => ({ ...prevWeights, [key]: newValue }));
  };
  
  const handleReturnDeltaChange = (key, e) => {
    e.stopPropagation(); 
    const newValue = e.target.value; 
    setReturnDeltas(prevReturnDeltas => ({ ...prevReturnDeltas, [key]: newValue }));
  };

  const handleWeightChangeCompany = (comp_key, newValue) => {
    setRowWeights(prevWeights => ({
      ...prevWeights,
      [comp_key]: newValue
    }));
  };

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter') {
      applyCustomFormulas();
      event.preventDefault(); 
    }
  };

  const getCustomFormulaColumns = () => {
    return customFormulas.map((formula, index) => ({
      Header: () => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{`Custom Score ${index + 1}`}</div>
          <CustomFormulaInput
            key={`custom-formula-${index}`}
            index={index}
            initialFormula={formula}
            onFormulaChange={updateCustomFormula}
            onRemove={removeCustomFormula}
          />
        </div>
      ),
      accessor: `score${index + 1}`,
      Cell: ({ row }) => customResults[row.original.comp_key]?.[`score${index + 1}`] || '',
      disableSortBy: false,
    }));
  };


  
  


  const keyToHeaderMapping = {
    S1: 'Scope 1',
    S2: 'Scope 2',
    S3: 'Scope 3',
    TotalS: 'Total S1-3',
    Energy: 'Energy Cons.',
    Renewables: '% Renewables',
    SBTI: 'SBTI Year',
    SBTI_Plan: 'SBTI Plan',
    Bio: 'Bio Diversity',
    Climate: 'Climate Change',
    Tax: 'Tax Transp.',
    Water: 'Water Mgt.',
    Right: 'Human Rgts.',
    Ocean: 'Ocean Sustain.',
    Capital: 'Human Capital',
    Consumer: 'Consumer Interests',
    Children: "Children's Rgts.",
    Corruption: 'Anti Corruption',
  };

  

  const columns = useMemo(() => [
    {
      Header: 'Basic',
      columns: [
        {
          Header: 'No',
          accessor: 'comp_key',
          show: columnVisibility['comp_key'],
        },
        {
          Header: 'ISIN',
          accessor: 'ISIN',
          show: columnVisibility['ISIN'],
        },
        {
          Header: 'Name',
          accessor: 'name',
          show: columnVisibility['name'],
        },
        {
          Header: 'Country',
          accessor: 'country',
          show: columnVisibility['country'],
        },
        {
          Header: 'Sector',
          accessor: 'sector',
        },
        {
          Header: 'Notional',
          id: 'notional',
          Cell: () => null
        },
        {
          Header: 'Weights',
          id: 'weights',
          // Use comp_key as a unique identifier
          accessor: row => rowWeights[row.comp_key] || '',
          Cell: ({ row }) => (
            <input
              type="number"
              value={rowWeights[row.comp_key] || ''}
              onChange={e => {
                // Prevent sorting when changing the weight
                e.stopPropagation();
                // Update the weight for this row using comp_key
                handleWeightChange(row.comp_key, e.target.value);
              }}
              style={{ width: '100%' }}
            />
          )
        }
      ],
    },
    {
      Header: 'Return',
      columns: [
        {
          Header: '3m $',
          id: '3r',
          Cell: () => null
        },
        {
          Header: '6m $',
          id: '6r',
          Cell: () => null
        }
      ]
    },
    {
      Header: 'Volatility',
      columns: [
        {
          Header: '3m $',
          id: '3v',
          Cell: () => null
        },
        {
          Header: '6m $',
          id: '6v',
          Cell: () => null
        }
      ]
    },
    {
      Header: () => <>&nbsp;</>, 
      id: 'emptyHeader', 
      columns: [
        {
          Header: 'Adj Weight',
          accessor: 'adjWeight', 
          Cell: () => null
        }
      ]
    },
    {
      Header: 'Quantitative',
      columns: Object.keys(mockCompanies[0].quantitative).map(key => {
        const weightKey = `weight_quantitative_${key}`;
        const deltaKey = `delta_quantitative_${key}`;
        return {
          Header: () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {keyToHeaderMapping[key] || key}
              {/* Weight input */}
              <input
                type="number"
                value={weights[weightKey] || ''}
                onChange={(e) => handleWeightChange(weightKey, e)}
                style={{ width: '100%', padding: '2px', margin: '2px 0' }}
                placeholder={`Weight for ${key}`}
                onClick={(e) => e.stopPropagation()}
              />
              {/* Return Delta input */}
              <input
                type="number"
                value={returnDeltas[deltaKey] || ''}
                onChange={(e) => handleReturnDeltaChange(deltaKey, e)}
                style={{ width: '100%', padding: '2px', margin: '2px 0' }}
                placeholder={`Delta for ${key}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ),
          accessor: `quantitative.${key}`,
          id: weightKey,
        };
      }),
    },

    // Columns for Qualitative data
    {
      Header: 'Qualitative',
      columns: Object.keys(mockCompanies[0].qualitative).map(key => {
        const weightKey = `weight_qualitative_${key}`;
        const deltaKey = `delta_qualitative_${key}`;
        return {
          Header: () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {keyToHeaderMapping[key] || key}
              {/* Weight input */}
              <input
                type="number"
                value={weights[weightKey] || ''}
                onChange={(e) => handleWeightChange(weightKey, e)}
                style={{ width: '100%', padding: '2px', margin: '2px 0' }}
                placeholder={`Weight for ${key}`}
                onClick={(e) => e.stopPropagation()}
              />
              {/* Return Delta input */}
              <input
                type="number"
                value={returnDeltas[deltaKey] || ''}
                onChange={(e) => handleReturnDeltaChange(deltaKey, e)}
                style={{ width: '100%', padding: '2px', margin: '2px 0' }}
                placeholder={`Delta for ${key}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ),
          accessor: `qualitative.${key}`,
          id: weightKey,
        };
      }),
    },
    // Custom Scores column
    ...getCustomFormulaColumns(),
  ], [customFormulas, customResults, weights, returnDeltas, rowWeights, columnVisibility]);

  

  const tableInstance = useTable({ columns, data }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div>Portfolio: NPF Equities All</div>
            <div>Gross Return: </div>
          </div>
          <div>
            <div>Currency: USD</div>
            <div>Year: 2021</div>
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Custom</span>
          <button onClick={addCustomFormula} style={{ marginLeft: '10px' }}>Add Custom Score</button>
        </div>
        <div>
          {Object.keys(columnVisibility).map((column, index) => (
            <div key={index}>
              <input
                type="checkbox"
                checked={columnVisibility[column]}
                onChange={() => handleVisibilityChange(column)}
              />
              {column}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="scaleSlider">Adjust Table Size:</label>
          <input
            id="scaleSlider"
            type="range"
            min="0.5" // Minimum scale
            max="1.5" // Maximum scale
            step="0.1" // Step size
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className={styles.scaledTable}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default PortfolioPage;