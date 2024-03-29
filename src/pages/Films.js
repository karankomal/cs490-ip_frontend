import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { AwesomeButtonProgress } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { CloseButton, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./aws-btn.css";
import "./films.css";
import "./modal.css";
import "./pagination.css";
import "./search.css";
import "./tables.css";

export default function Films() {
	const [films, setFilms] = useState([]);

	const [filteredFilms, setFilteredFilms] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState(3);
	const [searchValue, setSearchValue] = useState("");

	const [customer_id, setCustomerID] = useState("");
	const [film_id, setFilmID] = useState("");

	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const indexOfLastFilm = page * pageSize;
	const indexOfFirstFilm = indexOfLastFilm - pageSize;
	const paginate = ({ selected }) => {
		setPage(selected + 1);
	};

	const [showM, setShowM] = useState(false);
	const [modalData, set_Modal_Data] = useState([]);
	const modalShow = () => {
		setShowM(true);
	};
	const closeModal = () => {
		setShowM(false);
		setCustomerID("");
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
				setFilteredFilms(response.data.films);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		var filteredFilms = [];
		// eslint-disable-next-line eqeqeq
		if (selectedFilter == 0) {
			filteredFilms = films.filter((value) =>
				value[1].toLowerCase().includes(searchValue.toLowerCase())
			);
			// eslint-disable-next-line eqeqeq
		} else if (selectedFilter == 1) {
			filteredFilms = films.filter((value) =>
				value[2].toLowerCase().includes(searchValue.toLowerCase())
			);
			// eslint-disable-next-line eqeqeq
		} else if (selectedFilter == 2) {
			filteredFilms = films.filter((value) =>
				value[3].toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		setFilteredFilms(filteredFilms);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, selectedFilter]);

	function getFilmDetails(film_id) {
		axios.get(`/film/${film_id}`).then((response) => {
			set_Modal_Data(response.data);
		});
		openModalHandle();
		setFilmID(film_id);
	}

	return (
		<>
			<h1 className="allFilmsHeader">All Films</h1>
			<div className="searchComp">
				<select
					className="searchSelect"
					placeholder=""
					onChange={(e) => {
						setSelectedFilter(e.target.value);
					}}
					defaultValue={"DEFAULT"}
				>
					<option value="DEFAULT" disabled>
						Select Search Filter
					</option>
					<option value="0">Film Title</option>
					<option value="1">Film Genre</option>
					<option value="2">Actor</option>
				</select>
				<div className="search-box">
					<button className="btn-search">
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							style={{ color: "#ffffff" }}
						/>
					</button>
					<input
						className="input-search"
						type="text"
						onChange={(e) => setSearchValue(e.target.value)}
						value={searchValue}
						placeholder="Type To Search"
					/>
				</div>
			</div>
			<table className="allFilms">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Title</th>
						<th scope="col">Genre</th>
						<th scope="col">Featured Actors</th>
					</tr>
				</thead>
				<tbody>
					{filteredFilms
						.slice(indexOfFirstFilm, indexOfLastFilm)
						.map((film) => (
							<tr
								key={film[0]}
								onClick={() => {
									getFilmDetails(film[0]);
								}}
							>
								<td>{film[0]}</td>
								<td>{film[1]}</td>
								<td>{film[2]}</td>
								<td>
									{film[3].split(", ")[0]} & {film[3].split(", ")[1]}
								</td>
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
									<b>Starring:</b> {film[13]}
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
						<div className="rentFilm">
							<input
								className="rentFilmInput"
								type="number"
								min="0"
								placeholder="Enter Customer ID"
								value={customer_id}
								onChange={(e) => setCustomerID(e.target.value)}
							/>
							<AwesomeButtonProgress
								type="primary"
								onPress={async (call, next) => {
									const custID = { customer_id };
									const fID = { film_id };
									const response = await fetch("/rentfilm", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify([custID, fID]),
									});
									if (response.ok) {
										setTimeout(() => {
											next(true, "Rental Confirmed!");
										}, 1000);
									} else {
										setTimeout(() => {
											next(false, response.headers.get("error"));
										}, 1000);
									}
								}}
							>
								Rent Out Movie
							</AwesomeButtonProgress>
						</div>
					</Modal.Footer>
				</Modal>
			</div>
			<ReactPaginate
				onPageChange={paginate}
				pageCount={Math.ceil(filteredFilms.length / pageSize)}
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
