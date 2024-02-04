import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate'
import './films.css'

export default function Films() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const indexOfLastFilm = page * pageSize
    const indexOfFirstFilm = indexOfLastFilm - pageSize

    const paginate = ({ selected }) => {
        setPage(selected + 1)
    }
  
    useEffect(() => {
      axios.get(`/allfilms`)
        .then((response) => {
          console.log(response)
          setData(response.data.films)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error);
        });
    }, [page, pageSize])

    return(
        <div>
            <h1>All Films</h1>
            <table className="allFilms">
                <thead>
                    <tr>
                        <th key='id' scope='col'>ID</th>
                        <th key='title' scope='col'>Title</th>
                        <th key='genre' scope='col'>Genre</th>
                    </tr>
                </thead>
                <tbody>
                    {data.slice(indexOfFirstFilm, indexOfLastFilm).map(film => (
                        <tr>
                            <td key={film[0]}>{film[0]}</td>
                            <td key={film[1]}>{film[1]}</td>
                            <td key={film[2]}>{film[2]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                onPageChange={paginate}
                pageCount={Math.ceil(data.length / pageSize)}
                previousLabel={"<"}
                nextLabel={">"}
                containerClassName={'pagination'}
                pageLinkClassName={'page-number'}
                previousLinkClassName={'page-number'}
                nextLinkClassName={'page-number'}
                activeLinkClassName={'activePageNum'}
                breakClassName={'breakme'}
                breakLabel={'...'}
                disabledClassName={'disabled-page'}
                marginPagesDisplayed={2}
                nextClassName={'next'}
                pageClassName={'page-item'}
                pageRangeDisplayed={2}
                previousClassName={'previous'}
            />
        </div>
    )
}