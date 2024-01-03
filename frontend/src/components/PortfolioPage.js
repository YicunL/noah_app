import React, { useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { evaluate } from 'mathjs';
import { mockCompanies } from '../data/mockData'; 

const PortfolioPage = () => {
  const [data, setData] = useState(mockCompanies);
  const [customFormulas, setCustomFormulas] = useState(['']);
  const [customResults, setCustomResults] = useState({});
  const [customFormulaErrors, setCustomFormulaErrors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [returnDeltas, setReturnDeltas] = useState([]);
  const [rowWeights, setRowWeights] = useState({});


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
  };

  const updateCustomFormula = (index, value) => {
    const newFormulas = [...customFormulas];
    newFormulas[index] = value;
    setCustomFormulas(newFormulas);
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


  const keyToHeaderMapping = {
    S1: 'Scope 1',
    S2: 'Scope 2',
    S3: 'Scope 3',
    TotalS: 'Total S1-3',
    Energy: 'Energy Cons.',
    Renewables: '% Renewables',
    SBTI: 'SBTI Year',
    SBTI_Plan: 'SBTI Plan',
    Bio: 'BioDiversity',
    Climate: 'Climate Change',
    Tax: 'Tax Transp.',
    Water: 'Water Mgt',
    Right: 'Human Rgts.',
    Human: 'Human Capital',
    Consumer: 'Consumer Interests',
    Children: "Children's Rgts",
    Corruption: 'Anti Corruption',
  };

  

  const columns = useMemo(() => [
    {
      Header: 'Basic',
      columns: [
        {
          Header: 'No',
          accessor: 'comp_key',
        },
        {
          Header: 'ISIN',
          accessor: 'ISIN',
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Country',
          accessor: 'country',
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
              // You can add additional styles or classes as needed
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
    {
      Header: 'Custom',
      columns: customFormulas.map((_, index) => ({
        Header: `Score ${index + 1}`,
        accessor: d => customResults[d.comp_key]?.[`score${index + 1}`] || '',
      })),
    },
  ], [customFormulas, customResults, weights, returnDeltas, rowWeights]);

  

  const tableInstance = useTable({ columns, data }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div>Portfolio: NPF Equities All</div>
            <div>Gross Return: </div>
          </div>
          <div>
            <div> &nbsp; </div>
            <div>Factor Weights -{'>'} </div>
            <div>Return Delta -{'>'}</div>
          </div>
          <div>
            <div>Return</div>
          </div>
          <div>
            <div>Volatility</div>
          </div>
          <div>
            <div>Currency: USD</div>
            <div>Year: 2021</div>
          </div>
        </div>
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
          <tbody {...getTableBodyProps()}>
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
      <div style={{ minWidth: '300px', padding: '10px' }}> 
        {customFormulas.map((formula, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder={`Enter custom formula for Score ${index + 1}...`}
              value={formula}
              onChange={e => updateCustomFormula(index, e.target.value)}
              style={{ width: '100%', marginBottom: '5px' }}
            />
            <button onClick={() => removeCustomFormula(index)}>Remove</button>
            {customFormulaErrors[index] && <div style={{ color: 'red' }}>{customFormulaErrors[index]}</div>}
          </div>
        ))}
        <button onClick={addCustomFormula} style={{ marginRight: '5px' }}>Add Custom Score</button>
        <button onClick={applyCustomFormulas}>Apply Custom Formulas</button>
      </div>
    </div>
  );
}

export default PortfolioPage;