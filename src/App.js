import React, { useEffect, useState, useRef } from "react";
import axiox from "axios";

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();

  const getResults = async () => {
    setLoading(true);
    try {
      const response = await axiox.get(`http://hn.algolia.com/api/v1/search?query=${query}`);
      setResults(response.data.hits);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getResults();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    getResults();
  };

  const handleClearSearch = () => {
    setQuery("");
    searchInputRef.current.focus();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={event => {
          setQuery(event.target.value);
        }} ref={searchInputRef}/>
        <button type='submit'>Search</button>
        <button type='button' onClick={handleClearSearch}>Clear</button>
      </form>

      {loading ? (<div>Loading results...</div>) :
        (
          <ul>
            {results.map(result => (
              <li key={result.objectID}>
                <a href={result.url}>{result.title}</a>
              </li>
            ))}
          </ul>
        )
      }
      {error && <div>{error.message}</div>}
    </>
  );
}