import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { CloseButton, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./customers.css";
import "./modal.css";
import "./pagination.css";
import "./tables.css";

export default function Customers() {
	const [customers, setCustomers] = useState([]);
	const [customerName, setCustomerName] = useState("");
	const [currentlyRenting, setCurrentlyRenting] = useState(0);
	const [previouslyRented, setPreviouslyRented] = useState(0);

	const [filteredCustomers, setFilteredCustomers] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState(3);
	const [searchValue, setSearchValue] = useState("");

	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const indexOfLastCustomer = page * pageSize;
	const indexOfFirstCustomer = indexOfLastCustomer - pageSize;
	const paginate = ({ selected }) => {
		setPage(selected + 1);
	};

	const [showM, setShowM] = useState(false);
	const [modalData, setModalData] = useState([]);
	const modalShow = () => {
		setShowM(true);
	};
	const closeModal = () => {
		setShowM(false);
	};
	const openModalHandle = () => {
		setModalData(modalData);
		modalShow();
	};

	useEffect(() => {
		axios
			.get(`/allcustomers`)
			.then((response) => {
				setCustomers(response.data);
				setFilteredCustomers(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [page, pageSize]);

	useEffect(() => {
		var filteredCustomers = [];
		// eslint-disable-next-line eqeqeq
		if (selectedFilter == 0) {
			filteredCustomers = customers.filter((value) =>
				(value[0] + "").includes((searchValue + "").toLowerCase())
			);
			// eslint-disable-next-line eqeqeq
		} else if (selectedFilter == 1) {
			filteredCustomers = customers.filter((value) =>
				value[2].toLowerCase().includes(searchValue.toLowerCase())
			);
			// eslint-disable-next-line eqeqeq
		} else if (selectedFilter == 2) {
			filteredCustomers = customers.filter((value) =>
				value[3].toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		setFilteredCustomers(filteredCustomers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, selectedFilter]);

	function getCustomerDetails(customer_id) {
		axios.get(`/customer/${customer_id}`).then((response) => {
			setModalData(response.data);
		});
		getCurrentRentalCount(customer_id);
		getPreviousRentalCount(customer_id);
		openModalHandle();
	}

	function getCurrentRentalCount(customer_id) {
		axios.get(`/customer/${customer_id}/currentlyrenting`).then((response) => {
			response.data[0] === undefined
				? setCurrentlyRenting(0)
				: setCurrentlyRenting(response.data[0][1]);
		});
	}

	function getPreviousRentalCount(customer_id) {
		axios.get(`/customer/${customer_id}/previouslyrented`).then((response) => {
			response.data[0] === undefined
				? setPreviouslyRented(0)
				: setPreviouslyRented(response.data[0][1]);
		});
	}

	return (
		<>
			<h1 className="customersHeader">Customers</h1>
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
					<option value="0">Customer ID</option>
					<option value="1">First Name</option>
					<option value="2">Last Name</option>
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
			<table className="allCustomers">
				<thead>
					<tr>
						<th scope="col">Customer ID</th>
						<th scope="col">Store ID</th>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						{/* <th scope="col">Email</th> */}
						{/* <th scope="col">Address ID</th> */}
						<th scope="col">Currently Active</th>
						{/* <th scope="col">Created</th>
						<th scope="col">Last Updated</th> */}
					</tr>
				</thead>
				<tbody>
					{filteredCustomers
						.slice(indexOfFirstCustomer, indexOfLastCustomer)
						.map((customer) => (
							<tr
								key={customer[0]}
								onClick={() => {
									setCustomerName(
										`${
											customer[2].charAt(0) + customer[2].slice(1).toLowerCase()
										} ${
											customer[3].charAt(0) + customer[3].slice(1).toLowerCase()
										}`
									);
									getCustomerDetails(customer[0]);
								}}
							>
								<td>{customer[0]}</td>
								<td>{customer[1]}</td>
								<td>
									{customer[2].charAt(0) + customer[2].slice(1).toLowerCase()}
								</td>
								<td>
									{customer[3].charAt(0) + customer[3].slice(1).toLowerCase()}
								</td>
								{/* <td>{customer[4]}</td>
								<td>{customer[5]}</td> */}
								<td>{customer[6] === 1 ? "Yes" : "No"}</td>
								{/* <td>{customer[7]}</td>
								<td>{customer[8]}</td> */}
							</tr>
						))}
				</tbody>
			</table>
			<div className="modal-container">
				<Modal show={showM} onHide={closeModal} className="modal">
					<Modal.Header className="modal-header">
						<Modal.Title className="modal-title">
							{modalData.map((customer) => `${customerName}'s Details`)}
						</Modal.Title>
						<CloseButton className="closeBtn" onClick={closeModal}>
							X
						</CloseButton>
					</Modal.Header>
					<Modal.Body className="modal-body">
						{modalData.map((customer) => (
							<ul key={customer[0]}>
								<li>
									<b>Customer ID:</b> {customer[0]}
								</li>
								<li>
									<b>Email:</b> {customer[4]}
								</li>
								<li>
									<b>Currently Renting:</b> {currentlyRenting}
								</li>
								<li>
									<b>Rented Previously:</b> {previouslyRented}
								</li>
								<li>
									<b>Created:</b> {customer[7]}
								</li>
								<li>
									<b>Last Updated:</b> {customer[8]}
								</li>
							</ul>
						))}
					</Modal.Body>
				</Modal>
			</div>
			<ReactPaginate
				onPageChange={paginate}
				pageCount={Math.ceil(filteredCustomers.length / pageSize)}
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
