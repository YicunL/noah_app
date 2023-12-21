import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const biodiveristyPolicyData = [
  {
    indicator: 'Signatory',
    description: '1) UN Convention on Biological Diversity. 2) UN Sustainable Development Goal 15 "Life on Land", 3) the International Finance Corporation’s Performance Standard 6, 4) the environmental principles of the UN Global Compact',
    category: 'Biodiversity',
    weight: '',
    sectors: 'All'
  },
  {
    indicator: 'Assessment',
    description: 'Companies should assess their direct and indirect dependencies and impacts on biodiversity and ecosystems and incorporate such assessments into their policies',
    category: 'Biodiversity',
    weight: '',
    sectors: 'All'
  },
  {
    indicator: 'Strategy',
    description: 'understand the state of ecosystems they depend on for natural resources and services and assess the potential business implications of overexploitation or degradation. Companies should have a strategy to address these implications, including the business opportunities arising from more sustainable uses of natural resources',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Habitat',
    description: 'a policy concerning the management of critical habitats4 when involved in activities that may significantly impact ecosystems, with the ambition of no net loss of biodiversity ',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Agriculture',
    description: 'a policy for sustainable farming, and a plan for implementation, considering elements such as integrated pest management, erosion control or other relevant agroecological practices',    
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Preservation',
    description: 'preserve biodiversity and ecosystems, and exercise due care in protected areas and critical habitats. They should avoid disruptive operations in internationally recognised areas such as natural UNESCO World Heritage Sites, and have adequate oversight in place to secure the impact of operations in the vicinity of such areas. Companies should avoid contributing to reductions of any Critically Endangered or Endangered Species on the IUCN Red List of Threatened Species.',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  // ... additional policy data
];

const climatePolicyData = [
  {
    indicator: 'Signatory',
    description: '1) UN Convention on Biological Diversity. 2) UN Sustainable Development Goal 15 "Life on Land", 3) the International Finance Corporation’s Performance Standard 6, 4) the environmental principles of the UN Global Compact',
    category: 'Biodiversity',
    weight: '',
    sectors: 'All'
  },
  {
    indicator: 'Assessment',
    description: 'Companies should assess their direct and indirect dependencies and impacts on biodiversity and ecosystems and incorporate such assessments into their policies',
    category: 'Biodiversity',
    weight: '',
    sectors: 'All'
  },
  {
    indicator: 'Strategy',
    description: 'understand the state of ecosystems they depend on for natural resources and services and assess the potential business implications of overexploitation or degradation. Companies should have a strategy to address these implications, including the business opportunities arising from more sustainable uses of natural resources',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Habitat',
    description: 'a policy concerning the management of critical habitats4 when involved in activities that may significantly impact ecosystems, with the ambition of no net loss of biodiversity ',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Agriculture',
    description: 'a policy for sustainable farming, and a plan for implementation, considering elements such as integrated pest management, erosion control or other relevant agroecological practices',    
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Preservation',
    description: 'preserve biodiversity and ecosystems, and exercise due care in protected areas and critical habitats. They should avoid disruptive operations in internationally recognised areas such as natural UNESCO World Heritage Sites, and have adequate oversight in place to secure the impact of operations in the vicinity of such areas. Companies should avoid contributing to reductions of any Critically Endangered or Endangered Species on the IUCN Red List of Threatened Species.',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  // ... additional policy data
];

const waterPolicyData = [
  {
    indicator: 'Signatory',
    description: '1) UN Convention on Biological Diversity. 2) UN Sustainable Development Goal 15 "Life on Land", 3) the International Finance Corporation’s Performance Standard 6, 4) the environmental principles of the UN Global Compact',
    category: 'Biodiversity',
    weight: '',
    sectors: 'All'
  },
  {
    indicator: 'Assessment',
    description: 'Companies should assess their direct and indirect dependencies and impacts on biodiversity and ecosystems and incorporate such assessments into their policies',
    category: 'Biodiversity',
    weight: '',
    sectors: 'All'
  },
  {
    indicator: 'Strategy',
    description: 'understand the state of ecosystems they depend on for natural resources and services and assess the potential business implications of overexploitation or degradation. Companies should have a strategy to address these implications, including the business opportunities arising from more sustainable uses of natural resources',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Habitat',
    description: 'a policy concerning the management of critical habitats4 when involved in activities that may significantly impact ecosystems, with the ambition of no net loss of biodiversity ',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Agriculture',
    description: 'a policy for sustainable farming, and a plan for implementation, considering elements such as integrated pest management, erosion control or other relevant agroecological practices',    
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  {
    indicator: 'Preservation',
    description: 'preserve biodiversity and ecosystems, and exercise due care in protected areas and critical habitats. They should avoid disruptive operations in internationally recognised areas such as natural UNESCO World Heritage Sites, and have adequate oversight in place to secure the impact of operations in the vicinity of such areas. Companies should avoid contributing to reductions of any Critically Endangered or Endangered Species on the IUCN Red List of Threatened Species.',
    category: 'Biodiversity',
    weight: '',
    sectors: ''
  },
  // ... additional policy data
];

const BiodiversityPage = () => {
  return (
    <div>
      <h1>Policy: Biodiversity</h1>
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
              <td>{policy.weight}</td>
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
      <h1>Policy: Biodiversity</h1>
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
      <h1>Policy: Biodiversity</h1>
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
  return (
    <div>
      <h1>Expectations</h1>
      <nav>
        <ul>
          <li><Link to="biodiversity">Biodiversity</Link></li>
          <li><Link to="climate">Climate</Link></li>
          <li><Link to="water">Water</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="biodiversity" element={<BiodiversityPage />} />
        <Route path="climate" element={<ClimatePage />} />
        <Route path="water" element={<WaterPage />} />
      </Routes>
    </div>
  );
};

export default ExpectationPage;
