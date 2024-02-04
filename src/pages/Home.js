import {useState, useEffect} from 'react';
import axios from 'axios';
import { Modal, Button } from "react-bootstrap"
import './home.css'

export default function Home() {
    const [data, setData] = useState([])

    const [showM, set_Show_M] = useState(false); 
    const [modalData, set_Modal_Data] = useState([]);  
    const modalShow = () => { set_Show_M(true);}; 
    const closeModal = () => { set_Show_M(false);}; 
    const openModalHandle = () => { 
        set_Modal_Data(modalData); 
        modalShow();
    }; 

    useEffect(() => {
        axios.get(`/top5Rented`)
        .then((response) => {
            console.log(response)
            setData(response.data)
        })
            .catch((error) => {
            console.error(error);
        });
    }, [])

    return(
        <div>
            <h1 className='top5RentedHeader'>Top 5 Rented Movies</h1>
            <table className="top5Rented">
                <thead>
                    <tr>
                        <th key='id' scope='col'>ID</th>
                        <th key='title' scope='col'>Title</th>
                        <th key='genre' scope='col'>Genre</th>
                        <th key='rentalCount' scope='col'>Rental Count</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(film => (
                        <tr onClick={() => {
                            axios.get(`/film/${film[0]}`)
                            .then((response) => {
                                set_Modal_Data(response.data)
                            })
                            openModalHandle()
                        }}>
                            <td key={film[0]}>{film[0]}</td>
                            <td key={film[1]}>{film[1]}</td>
                            <td key={film[2]}>{film[2]}</td>
                            <td key={film[3]}>{film[3]}</td>
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
                        <ul>
                            <li key={film[0]}>Film ID: {film[0]}</li>
                            <li key={film[2]}>Description: {film[2]}</li>
                            <li key={film[3]}>Release Year: {film[3]}</li>
                            <li key={film[6]}>Rental Duration: {film[6]} days</li>
                            <li key={film[7]}>Rental Rate: ${film[7]}</li>
                            <li key={film[8]}>Length: {film[8]} minutes</li>
                            <li key={film[9]}>Replacement Cost: ${film[9]}</li>
                            <li key={film[10]}>Rating: {film[10]}</li>
                            <li key={film[11]}>Special Features: {film[11]}</li>
                            <li key={film[12]}>Last Updated: {film[12]}</li>
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
        </div>
    )
}

