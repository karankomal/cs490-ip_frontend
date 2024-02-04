import {useState, useEffect} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate'
import { Modal, Button } from "react-bootstrap"
import './films.css'

export default function Films() {
    const [data, setData] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const indexOfLastFilm = page * pageSize
    const indexOfFirstFilm = indexOfLastFilm - pageSize
    const paginate = ({ selected }) => {
        setPage(selected + 1)
    }

    const [showM, set_Show_M] = useState(false); 
    const [modalData, set_Modal_Data] = useState([]);  
    const modalShow = () => { set_Show_M(true);}; 
    const closeModal = () => { set_Show_M(false);}; 
    const openModalHandle = () => { 
        set_Modal_Data(modalData); 
        modalShow();
    }; 
  
    useEffect(() => {
        axios.get(`/allfilms`)
            .then((response) => {
                setData(response.data.films)
            })
                .catch((error) => {
                console.error(error);
            });
    }, [page, pageSize])

    function getFilmDetails(film_id) {
        axios.get(`/film/${film_id}`)
            .then((response) => {
                set_Modal_Data(response.data)
            })
        openModalHandle()
    }

    return(
        <div>
            <h1 className="allFilmsHeader">All Films</h1>
            <table className="allFilms">
                <thead>
                    <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>Title</th>
                        <th scope='col'>Genre</th>
                    </tr>
                </thead>
                <tbody>
                    {data.slice(indexOfFirstFilm, indexOfLastFilm).map(film => (
                        <tr key={film[0]} onClick={() => {getFilmDetails(film[0])}}>
                            <td>{film[0]}</td>
                            <td>{film[1]}</td>
                            <td>{film[2]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal-container">
                <Modal 
                    show={showM} 
                    onHide={closeModal}
                    className="modal"> 
                    <Modal.Header className="modal-header"> 
                        <Modal.Title> 
                            {modalData.map((film) =>(film[1]))}
                        </Modal.Title> 
                    </Modal.Header> 
                    <Modal.Body className="modal-content"> 
                    {modalData.map((film) => (
                        <ul key={film[0]}>
                            <li>Film ID: {film[0]}</li>
                            <li>Description: {film[2]}</li>
                            <li>Release Year: {film[3]}</li>
                            <li>Rental Duration: {film[6]} days</li>
                            <li>Rental Rate: ${film[7]}</li>
                            <li>Length: {film[8]} minutes</li>
                            <li>Replacement Cost: ${film[9]}</li>
                            <li>Rating: {film[10]}</li>
                            <li>Special Features: {film[11]}</li>
                            <li>Last Updated: {film[12]}</li>
                        </ul>
                        ))}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer"> 
                        <Button 
                            className="close"
                            variant="secondary"
                            onClick={ 
                                closeModal} > 
                            X
                        </Button> 
                    </Modal.Footer> 
                </Modal>
            </div>

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