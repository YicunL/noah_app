import React, { useState, useEffect } from 'react';

const PortfolioPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('/api/data/comp_basic');
        if (response.ok) {
          const jsonData = await response.json();
          console.log(jsonData);
          setData(jsonData);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while data is being fetched
  }

  // Check if the data array is not empty and create table headers
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div>
      <h1>Comp Basic Data</h1>
      <table border="1">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={`${index}_${header}`}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioPage;
