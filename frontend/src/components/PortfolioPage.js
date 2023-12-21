import React, { useState, useMemo } from 'react';
import { useTable , useSortBy } from 'react-table';
import { evaluate } from 'mathjs';
import { mockCompanies } from '../data/mockData'; // Make sure this import path is correct

const PortfolioPage = () => {
  const [data, setData] = useState(mockCompanies); // State for your data
  const [customFormula, setCustomFormula] = useState(''); // State for the custom formula
  const [customFormulaError, setCustomFormulaError] = useState(''); // State for custom formula error message
  const [customResults, setCustomResults] = useState({}); // State for storing custom formula results

  // Function to apply the custom formula
  const applyCustomFormula = () => {
    try {
      const newCustomResults = {};
      data.forEach(company => {
        const scope = { ...company.quantitative };
        newCustomResults[company.comp_key] = evaluate(customFormula, scope);
      });

      setCustomResults(newCustomResults);
      setCustomFormulaError('');
    } catch (error) {
      console.error('Error evaluating custom formula', error);
      setCustomFormulaError('Error evaluating formula. Please check your syntax.');
    }
  };

  // useMemo for columns
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
        // ... other columns
      ],
    },
    {
      Header: 'Quantitative',
      columns: Object.keys(mockCompanies[0].quantitative).map(key => ({
        Header: key,
        accessor: d => d.quantitative[key],
      })),
    },
    {
      Header: 'Qualitative',
      columns: Object.keys(mockCompanies[0].qualitative).map(key => ({
        Header: key,
        accessor: d => d.qualitative[key],
      })),
    },
    {
      Header: 'Custom',
      columns: [
        {
          Header: 'Score 1',
          accessor: company => customResults[company.comp_key] || '',
        },
      ],
    },
  ], [customResults]); // Depend on customResults to update the table

  // useTable hook
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  // JSX for rendering the table
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
                // Apply sorting props and render sort direction indicators
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
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
  );
};

export default PortfolioPage;
