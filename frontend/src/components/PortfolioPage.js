import React, { useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { evaluate } from 'mathjs';
import { mockCompanies } from '../data/mockData'; // Adjust this import to your file structure

const PortfolioPage = () => {
  const [data, setData] = useState(mockCompanies);
  const [customFormulas, setCustomFormulas] = useState(['']);
  const [customResults, setCustomResults] = useState({});
  const [customFormulaErrors, setCustomFormulaErrors] = useState([]);

  const applyCustomFormulas = () => {
    const newCustomResults = {};
    const newErrors = Array(customFormulas.length).fill('');

    customFormulas.forEach((formula, index) => {
      data.forEach(company => {
        try {
          const scope = { ...company.quantitative };
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
    // Custom Scores columns
    ...customFormulas.map((_, index) => ({
      Header: `Custom Score ${index + 1}`,
      columns: [
        {
          Header: `Score ${index + 1}`,
          accessor: d => customResults[d.comp_key]?.[`score${index + 1}`] || '',
        },
      ],
    })),
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
    <div>
      {customFormulas.map((formula, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Enter custom formula for Score ${index + 1}...`}
            value={formula}
            onChange={e => updateCustomFormula(index, e.target.value)}
          />
          <button onClick={() => removeCustomFormula(index)}>Remove</button>
          {customFormulaErrors[index] && <div>{customFormulaErrors[index]}</div>}
        </div>
      ))}
      <button onClick={addCustomFormula}>Add Custom Score</button>
      <button onClick={applyCustomFormulas}>Apply Custom Formulas</button>

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
  );
};

export default PortfolioPage;