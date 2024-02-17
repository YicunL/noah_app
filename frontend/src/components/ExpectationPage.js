import React, {useState} from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import biodiveristyPolicyData from '../data/biodiversity';
import climatePolicyData from '../data/climate';
import waterPolicyData from '../data/water';


const BiodiversityPage = ({ weights, onWeightChange }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Indicators -&gt; Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Sectors</th>
          </tr>
        </thead>
        <tbody>
          {biodiveristyPolicyData.map((policy, index) => (
            <tr key={index}>
              <td>{policy.indicator}</td>
              <td>{policy.description}</td>
              <td>{policy.category}</td>
              <td>
                <input
                  type="number"
                  value={weights[index] || ''}
                  onChange={(e) => onWeightChange(index, e.target.value)}
                />
              </td>
              <td>{policy.sectors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClimatePage = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Indicators -&gt; Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Sectors</th>
          </tr>
        </thead>
        <tbody>
          {climatePolicyData.map((policy, index) => (
            <tr key={index}>
              <td>{policy.indicator}</td>
              <td>{policy.description}</td>
              <td>{policy.category}</td>
              <td>{policy.weight}</td>
              <td>{policy.sectors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const WaterPage = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Indicators -&gt; Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Sectors</th>
          </tr>
        </thead>
        <tbody>
          {waterPolicyData.map((policy, index) => (
            <tr key={index}>
              <td>{policy.indicator}</td>
              <td>{policy.description}</td>
              <td>{policy.category}</td>
              <td>{policy.weight}</td>
              <td>{policy.sectors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExpectationPage = () => {
  const [biodiversityWeights, setBiodiversityWeights] = useState({});

  const handleBiodiversityWeightChange = (index, value) => {
    setBiodiversityWeights({...biodiversityWeights, [index]: value});
  }

  const saveData = () => {
    console.log('Saving data', {biodiversityWeights});
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="biodiversity">Biodiversity</Link></li>
          <li><Link to="climate">Climate</Link></li>
          <li><Link to="water">Water</Link></li>
        </ul>
      </nav>
      <button onClick={saveData}>Save Data</button>
      <Routes>
        <Route path="biodiversity" element={<BiodiversityPage weights={biodiversityWeights} onWeightChange={handleBiodiversityWeightChange} />} />
        <Route path="climate" element={<ClimatePage />} />
        <Route path="water" element={<WaterPage />} />
      </Routes>
    </div>
  );
};

export default ExpectationPage;
