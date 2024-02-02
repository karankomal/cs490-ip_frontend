import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const lastPage = useRef(0)

  useEffect(() => {
    // Fetch data from the API based on the current page and page size
    axios.get(`/films?page=${page}&page_size=${pageSize}`)
      .then((response) => {
        console.log(response)
        setData(response.data.films)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page, pageSize])

  return (
    <div>
      <h1>Paginated Data</h1>
      <ul>
        {data.map((film) => (
          <li key={film}>{film}</li>
        ))}
      </ul>
      <button onClick={() => setPage(1)} disabled={page === 1}>First Page</button>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous Page</button>
      <button onClick={() => setPage(page + 1)} disabled={page === 100}>Next Page</button>
      <button onClick={() => setPage(100)} disabled={page === 100}>Last Page</button>
    </div>
  );
}

export default App;