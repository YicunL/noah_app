import React, { useState, useMemo } from 'react';
import { useTable } from 'react-table';
import { evaluate } from 'mathjs';
import { mockCompanies } from '../data/mockData'; // Adjust this import to your file structure

const PortfolioPage = () => {
  // useState hooks
  const [data, setData] = useState(mockCompanies); // State for your data
  const [customFormula, setCustomFormula] = useState(''); // State for the custom formula
  const [customFormulaError, setCustomFormulaError] = useState(''); // State for custom formula error message
  const [customResults, setCustomResults] = useState({});

  const applyCustomFormula = () => {
    try {
      const newCustomResults = {};
      mockCompanies.forEach(company => {
        const scope = { ...company.quantitative};
        newCustomResults[company.comp_key] = evaluate(customFormula, scope);
      });

      setCustomResults(newCustomResults);
      setCustomFormulaError('');
    } catch (error) {
      console.error('Error evaluating custom formula', error);
      setCustomFormulaError('Error evaluating formula. Please check your syntax.')
    }
  }

  // useMemo hook for defining columns
  const columns = useMemo(() => [
    {
      Header: ' ',
      columns: [
        { 
          Header: ' ',
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
              Header: 'shortName',
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
            // ... other top-level headers
          ], 
        },
    
        {
          Header: ' ',
          columns: [ {
            Header: 'Factor Weights',
            columns: [
              {
                Header: 'Return Delta',
              }
            ]
          }
          ]
        },
    
        {
          Header: 'Quantitative',
          columns: Object.keys(mockCompanies[0].quantitative).map(key => ({
            Header: key,
            accessor: d => d.quantitative[key], // Accessor is a function when dealing with nested data
          })),
        },
        {
          Header: 'Qualitative',
          columns: Object.keys(mockCompanies[0].qualitative).map(key => ({
            Header: key,
            accessor: d => d.qualitative[key], // Same as above for nested data
          })),
        },
        {
          Header: 'Custom',
          columns: [
            {
              Header: 'Score 1',
              id: 'customFormulaResult',
              accessor: company => customResults[company.comp_key] || '',
            },
          ],
        },
      ]
    }
    // ... other grouped headers
  ], []);

  // useTable hook
  const tableInstance = useTable({ columns, data });

  // Destructure the necessary properties and methods from tableInstance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;


  // JSX for rendering your table and other UI elements
  return (
    <div>
      <input
        type="text"
        placeholder="Enter custom formula..."
        value={customFormula}
        onChange={e => setCustomFormula(e.target.value)}
      />
      <button onClick={applyCustomFormula}>Apply Custom Formula</button>
      {customFormulaError && <div>{customFormulaError}</div>}

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
  );
};

export default PortfolioPage;
