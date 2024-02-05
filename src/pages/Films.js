import axios from "axios";
import { useEffect, useState } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./films.css";
import "./modal.css";
import "./pagination.css";
import "./tables.css";

export default function Films() {
	const [films, setFilms] = useState([]);

	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const indexOfLastFilm = page * pageSize;
	const indexOfFirstFilm = indexOfLastFilm - pageSize;
	const paginate = ({ selected }) => {
		setPage(selected + 1);
	};

	const [showM, set_Show_M] = useState(false);
	const [modalData, set_Modal_Data] = useState([]);
	const modalShow = () => {
		set_Show_M(true);
	};
	const closeModal = () => {
		set_Show_M(false);
	};
	const openModalHandle = () => {
		set_Modal_Data(modalData);
		modalShow();
	};

	useEffect(() => {
		axios
			.get(`/allfilms`)
			.then((response) => {
				setFilms(response.data.films);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [page, pageSize]);

	function getFilmDetails(film_id) {
		axios.get(`/film/${film_id}`).then((response) => {
			set_Modal_Data(response.data);
		});
		openModalHandle();
	}

	return (
		<>
			<h1 className="allFilmsHeader">All Films</h1>
			<table className="allFilms">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Title</th>
						<th scope="col">Genre</th>
					</tr>
				</thead>
				<tbody>
					{films.slice(indexOfFirstFilm, indexOfLastFilm).map((film) => (
						<tr
							key={film[0]}
							onClick={() => {
								getFilmDetails(film[0]);
							}}
						>
							<td>{film[0]}</td>
							<td>{film[1]}</td>
							<td>{film[2]}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="modal-container">
				<Modal show={showM} onHide={closeModal} className="modal">
					<Modal.Header className="modal-header">
						<Modal.Title className="modal-title">
							{modalData.map((film) => film[1])}
						</Modal.Title>
						<CloseButton className="closeBtn" onClick={closeModal}>
							X
						</CloseButton>
					</Modal.Header>
					<Modal.Body className="modal-body">
						{modalData.map((film) => (
							<ul key={film[0]}>
								<li>
									<b>Film ID:</b> {film[0]}
								</li>
								<li>
									<b>Description:</b> {film[2]}
								</li>
								<li>
									<b>Release Year:</b> {film[3]}
								</li>
								<li>
									<b>Rental Duration:</b> {film[6]} days
								</li>
								<li>
									<b>Rental Rate:</b> ${film[7]}
								</li>
								<li>
									<b>Length:</b> {film[8]} minutes
								</li>
								<li>
									<b>Replacement Cost:</b> ${film[9]}
								</li>
								<li>
									<b>Rating:</b> {film[10]}
								</li>
								<li>
									<b>Special Features:</b> {film[11]}
								</li>
								<li>
									<b>Last Updated:</b> {film[12]}
								</li>
							</ul>
						))}
					</Modal.Body>
					<Modal.Footer className="modal-footer">
						<Button className="primaryBtn" variant="primary">
							Primary Button
						</Button>
					</Modal.Footer>
				</Modal>
			</div>

			<ReactPaginate
				onPageChange={paginate}
				pageCount={Math.ceil(films.length / pageSize)}
				previousLabel={"<"}
				nextLabel={">"}
				containerClassName={"pagination"}
				pageLinkClassName={"page-number"}
				previousLinkClassName={"page-number"}
				nextLinkClassName={"page-number"}
				activeLinkClassName={"activePageNum"}
				breakClassName={"breakme"}
				breakLabel={"..."}
				disabledClassName={"disabled-page"}
				marginPagesDisplayed={2}
				nextClassName={"next"}
				pageClassName={"page-item"}
				pageRangeDisplayed={2}
				previousClassName={"previous"}
			/>
		</>
	);
}
