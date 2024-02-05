import axios from "axios";
import { useEffect, useState } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import "./home.css";
import "./modal.css";
import "./tables.css";

export default function Home() {
	const [top5Rented, setTop5Rented] = useState([]);
	const [top5Actors, setTop5Actors] = useState([]);

	const [showM, setShowM] = useState(false);
	const [modalData, setModalData] = useState([]);
	const modalShow = () => {
		setShowM(true);
	};
	const closeModal = () => {
		setShowM(false);
		setModalType("");
		setModalData([]);
	};
	const openModalHandle = () => {
		modalShow();
	};
	const [modalType, setModalType] = useState("");
	const [actorName, setActorName] = useState("");

	useEffect(() => {
		axios
			.get(`/top5Rented`)
			.then((response) => {
				setTop5Rented(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		axios
			.get(`/top5Actors`)
			.then((response2) => {
				setTop5Actors(response2.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	function getFilmDetails(film_id) {
		axios.get(`/film/${film_id}`).then((response) => {
			setModalData(response.data);
		});
		setModalType("filmDetails");
		openModalHandle();
	}
	function getTop5Films(actor_id) {
		axios.get(`/top5/actor/${actor_id}`).then((response) => {
			setModalData(response.data);
		});
		setModalType("actorTop5Films");
		openModalHandle();
	}

	return (
		<div>
			<h1 className="top5RentedHeader">Top 5 Rented Movies</h1>
			<table className="top5Rented">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Title</th>
						<th scope="col">Genre</th>
						<th scope="col">Rental Count</th>
					</tr>
				</thead>
				<tbody>
					{top5Rented.map((film) => (
						<tr
							key={film[0]}
							onClick={() => {
								getFilmDetails(film[0]);
							}}
						>
							<td>{film[0]}</td>
							<td>{film[1]}</td>
							<td>{film[2]}</td>
							<td>{film[3]}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="modal-container">
				<Modal show={showM} onHide={closeModal} className="modal">
					<Modal.Header className="modal-header">
						<Modal.Title className="modal-title">
							{modalType === "filmDetails"
								? modalData.map((film) => film[1])
								: `${actorName}'s Top 5 Movies`}
						</Modal.Title>
						<CloseButton className="closeBtn" onClick={closeModal}>
							X
						</CloseButton>
					</Modal.Header>
					<Modal.Body className="modal-body">
						{console.log(modalData)}
						{modalType === "filmDetails"
							? modalData.map((film) => (
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
							  ))
							: modalData.map((actor) => (
									<ul key={actor[0]}>
										<li>
											{actor[1]} (ID: {actor[0]})
										</li>
									</ul>
							  ))}
					</Modal.Body>
				</Modal>
			</div>
			<h1 className="top5ActorsHeader">Top 5 Actors</h1>
			<table className="top5Actors">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Name</th>
						<th scope="col">Movie Count</th>
					</tr>
				</thead>
				<tbody>
					{top5Actors.map((actor) => (
						<tr
							key={actor[0]}
							onClick={() => {
								setActorName(
									`${actor[1].charAt(0) + actor[1].slice(1).toLowerCase()} ${
										actor[2].charAt(0) + actor[2].slice(1).toLowerCase()
									}`
								);
								getTop5Films(actor[0]);
							}}
						>
							<td>{actor[0]}</td>
							<td>
								{actor[1].charAt(0) + actor[1].slice(1).toLowerCase()}{" "}
								{actor[2].charAt(0) + actor[2].slice(1).toLowerCase()}
							</td>
							<td>{actor[3]}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
