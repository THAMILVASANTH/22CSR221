import { useState } from 'react';
import './App.css';

function App() {
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleFetchNumbers = async (numberId) => {
    setIsLoading(true); 
    try {
      const response = await fetch(`http://localhost:9876/numbers/${numberId}`);
      const data = await response.json();

      setWindowPrevState(data.windowPrevState);
      setWindowCurrState(data.windowCurrState);
      setNumbers(data.numbers);
      setAvg(data.avg);
    } catch (err) {
      setError('Failed to fetch data from the server.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>

      {error && <p>{error}</p>}

      <div className="buttons">
        <button onClick={() => handleFetchNumbers('e')}>Even Numbers</button>
        <button onClick={() => handleFetchNumbers('p')}>Prime Numbers</button>
        <button onClick={() => handleFetchNumbers('f')}>Fibonacci Numbers</button>
        <button onClick={() => handleFetchNumbers('r')}>Random Numbers</button>
      </div>

      {}
      {isLoading && <div className="spinner">Loading...</div>}

      <div className="results">
        <h2>Previous State</h2>
        <p>{JSON.stringify(windowPrevState)}</p>

        <h2>Current State</h2>
        <p>{JSON.stringify(windowCurrState)}</p>

        <h2>Fetched Numbers</h2>
        <p>{JSON.stringify(numbers)}</p>

        <h2>Average</h2>
        <p>{avg}</p>
      </div>
    </div>
  );
}

export default App;
