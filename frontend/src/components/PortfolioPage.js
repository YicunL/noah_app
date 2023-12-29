import React, { useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { evaluate } from 'mathjs';
import { mockCompanies } from '../data/mockData'; 

const PortfolioPage = () => {
  const [data, setData] = useState(mockCompanies);
  const [customFormulas, setCustomFormulas] = useState(['']);
  const [customResults, setCustomResults] = useState({});
  const [customFormulaErrors, setCustomFormulaErrors] = useState([]);


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
      Header: 'Portfolio',
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
      ],
    },
    {
      Header: 'Quantitative',
      columns: Object.keys(mockCompanies[0].quantitative).map(key => ({
        Header: keyToHeaderMapping[key] || key,
        accessor: d => d.quantitative[key],
      })),
    },
    {
      Header: 'Qualitative',
      columns: Object.keys(mockCompanies[0].qualitative).map(key => ({
        Header: keyToHeaderMapping[key] || key,
        accessor: d => d.qualitative[key],
      })),
    },
    // Custom Scores column
    {
      Header: 'Custom',
      columns: customFormulas.map((_, index) => ({
        Header: `Score ${index + 1}`,
        accessor: d => customResults[d.comp_key]?.[`score${index + 1}`] || '',
      })),
    },
  ], [customFormulas, customResults]);

  

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
      <div style={{ minWidth: '300px', padding: '10px' }}> {/* Adjust the width and padding as needed */}
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