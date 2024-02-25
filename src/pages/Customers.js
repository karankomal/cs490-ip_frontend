import {
	faMagnifyingGlass,
	faPencil,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { AwesomeButton, AwesomeButtonProgress } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { CloseButton, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./aws-btn.css";
import "./customers.css";
import "./modal.css";
import "./pagination.css";
import "./search.css";
import "./tables.css";

export default function Customers() {
	const [customers, setCustomers] = useState([]);
	const [customerName, setCustomerName] = useState("");
	const [currentlyRenting, setCurrentlyRenting] = useState(0);
	const [previouslyRented, setPreviouslyRented] = useState(0);

	const [filteredCustomers, setFilteredCustomers] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState(3);
	const [searchValue, setSearchValue] = useState("");

	const [customer_id, setCustomerID] = useState("");
	const [film_id, setFilmID] = useState("");
	const [address_id, setAddressID] = useState("");
	const [city_id, setCityID] = useState("");
	const [country_id, setCountryID] = useState("");

	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [address2, setAddress2] = useState("");
	const [city, setCity] = useState("");
	const [district, setDistrict] = useState("");
	const [country, setCountry] = useState("");
	const [postal_code, setPostalCode] = useState("");
	const [phone, setPhone] = useState("");

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
		setFilmID("");
	};
	const openModalHandle = () => {
		setModalData(modalData);
		modalShow();
	};

	const [showM2, setShowM2] = useState(false);
	const modalShow2 = () => {
		setShowM2(true);
	};
	const closeModal2 = () => {
		setShowM2(false);
		setFirstName("");
		setLastName("");
		setEmail("");
	};
	const openModalHandle2 = () => {
		modalShow2();
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
		setCustomerID(customer_id);
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
	const [modal2Type, setModal2Type] = useState("");
	const editButtonClick = (e, customer) => {
		e.stopPropagation();

		setModal2Type("edit");
		setCustomerName(
			`${customer[2].charAt(0) + customer[2].slice(1).toLowerCase()} ${
				customer[3].charAt(0) + customer[3].slice(1).toLowerCase()
			}`
		);

		setCustomerID(customer[0]);
		setFirstName(customer[2]);
		setLastName(customer[3]);
		setEmail(customer[4]);
		setAddressID(customer[5]);
		setAddress(customer[9]);
		setAddress2(customer[10]);
		setDistrict(customer[11]);
		setCityID(customer[12]);
		setPostalCode(customer[13]);
		setPhone(customer[14]);
		setCity(customer[15]);
		setCountryID(customer[16]);
		setCountry(customer[17]);

		openModalHandle2();
	};

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const deleteButtonClick = (e, customer) => {
		e.stopPropagation();
		setSelectedCustomer(customer);
		setShowDeleteModal(true);
	};

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
						<th scope="col">Edit</th>
						<th scope="col">Delete</th>
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
								<td>
									<button
										className="editButton"
										onClick={(e) => editButtonClick(e, customer)}
									>
										<FontAwesomeIcon icon={faPencil} />
									</button>
								</td>
								<td>
									<button
										className="deleteButton"
										onClick={(e) => deleteButtonClick(e, customer)}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</td>
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
									<b>Address:</b> <br />
									{customer[9]}
									<br />
									{customer[10] && customer[10].trim() !== "" && (
										<>
											{customer[10]} <br />
										</>
									)}
									{customer[15] +
										", " +
										customer[11] +
										", " +
										customer[17] +
										" " +
										customer[13]}
								</li>
								<li>
									<b>Phone Number:</b> {customer[14]}
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
					<Modal.Footer className="modal-footer">
						<div className="returnFilm">
							<input
								className="returnFilmInput"
								type="number"
								min="0"
								placeholder="Enter Film ID"
								value={film_id}
								onChange={(e) => setFilmID(e.target.value)}
							/>
							<AwesomeButtonProgress
								type="primary"
								onPress={async (call, next) => {
									const custID = { customer_id };
									const fID = { film_id };
									const response = await fetch("/returnfilm", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify([custID, fID]),
									});
									if (response.ok) {
										setTimeout(() => {
											next(true, "Rental Returned!");
										}, 1000);
									} else {
										setTimeout(() => {
											next(false, response.headers.get("error"));
										}, 1000);
									}
								}}
							>
								Return Film
							</AwesomeButtonProgress>
						</div>
					</Modal.Footer>
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
			<AwesomeButton
				type="primary"
				className="addNewCustomerHeader"
				onPress={() => {
					setModal2Type("add");
					openModalHandle2();
				}}
			>
				Add New Customer
			</AwesomeButton>
			<div className="modal-container">
				<Modal show={showM2} onHide={closeModal2} className="modal">
					<Modal.Header className="modal-header">
						<Modal.Title className="modal-title">
							{modal2Type === "add"
								? "Adding New Customer"
								: `Editing ${customerName}'s Details`}
						</Modal.Title>
						<CloseButton className="closeBtn" onClick={closeModal2}>
							X
						</CloseButton>
					</Modal.Header>
					<Modal.Body className="modal-body">
						<div className="registrationForm">
							<input
								className="firstNameInput"
								type="text"
								placeholder="Enter First Name"
								value={first_name}
								onChange={(e) =>
									setFirstName(e.target.value.replace(/[^a-zA-Z]/gi, ""))
								}
								required
							/>
							<input
								className="lastNameInput"
								type="text"
								placeholder="Enter Last Name"
								value={last_name}
								onChange={(e) =>
									setLastName(e.target.value.replace(/[^a-zA-Z]/gi, ""))
								}
								required
							/>
							<input
								className="emailInput"
								type="email"
								name="Email"
								placeholder="Enter Email"
								value={email}
								onChange={(e) =>
									setEmail(e.target.value.replace(/[^a-zA-Z0-9\-+~_@.]/gi, ""))
								}
								required
							/>
							<input
								className="addressLine1Input"
								type="text"
								name="Address Line 1"
								placeholder="Enter Address Line 1"
								value={address}
								onChange={(e) =>
									setAddress(e.target.value.replace(/[^a-zA-Z0-9 ]/gi, ""))
								}
								required
							/>
							<input
								className="addressLine2Input"
								type="text"
								name="Address Line 2"
								placeholder="Enter Address Line 2 (Optional)"
								value={address2}
								onChange={(e) =>
									setAddress2(e.target.value.replace(/[^a-zA-Z0-9 ]/gi, ""))
								}
							/>
							<input
								className="cityInput"
								type="text"
								name="City"
								placeholder="Enter City"
								value={city}
								onChange={(e) =>
									setCity(e.target.value.replace(/[^a-zA-Z ]/gi, ""))
								}
								required
							/>
							<input
								className="districtInput"
								type="text"
								name="District"
								placeholder="Enter State/District"
								value={district}
								onChange={(e) =>
									setDistrict(e.target.value.replace(/[^a-zA-Z ]/gi, ""))
								}
								required
							/>
							<input
								className="countryInput"
								type="text"
								name="Country"
								placeholder="Enter Country"
								value={country}
								onChange={(e) =>
									setCountry(e.target.value.replace(/[^a-zA-Z ]/gi, ""))
								}
								required
							/>
							<input
								className="postalCodeInput"
								type="number"
								name="Postal Code"
								placeholder="Enter Postal Code"
								value={postal_code}
								onChange={(e) =>
									setPostalCode(e.target.value.replace(/[^0-9- ]/gi, ""))
								}
								required
							/>
							<input
								className="phoneInput"
								type="text"
								name="Phone"
								placeholder="Enter Phone Number"
								value={phone}
								onChange={(e) =>
									setPhone(e.target.value.replace(/[^0-9-()]/gi, ""))
								}
								required
							/>
						</div>
					</Modal.Body>
					<Modal.Footer className="modal-footer">
						<AwesomeButtonProgress
							type="primary"
							onPress={async (call, next) => {
								const firstName = { first_name };
								const lastName = { last_name };
								const emailInput = { email };
								const custID = { customer_id };
								const addressLine1 = { address };
								const addressLine2 = { address2 };
								const cityInput = { city };
								const districtInput = { district };
								const countryInput = { country };
								const postalCodeInput = { postal_code };
								const phoneInput = { phone };
								const addressID = { address_id };
								const cityID = { city_id };
								const countryID = { country_id };
								if (modal2Type === "add") {
									const response = await fetch("/addcustomer", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify([
											firstName,
											lastName,
											emailInput,
											addressLine1,
											addressLine2,
											cityInput,
											districtInput,
											countryInput,
											postalCodeInput,
											phoneInput,
										]),
									});
									if (response.ok) {
										setTimeout(() => {
											next(true, "Added!");
										}, 1000);
									} else {
										setTimeout(() => {
											next(false, response.headers.get("error"));
										}, 1000);
									}
								} else {
									const response = await fetch("/editcustomer", {
										method: "PATCH",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify([
											firstName,
											lastName,
											emailInput,
											addressLine1,
											addressLine2,
											cityInput,
											districtInput,
											countryInput,
											postalCodeInput,
											phoneInput,
											custID,
											addressID,
											cityID,
											countryID,
										]),
									});
									if (response.ok) {
										setTimeout(() => {
											next(true, "Edited!");
										}, 1000);
									} else {
										setTimeout(() => {
											next(false, response.headers.get("error"));
										}, 1000);
									}
								}
							}}
						>
							{modal2Type === "add" ? "Add Customer" : "Edit Customer Details"}
						</AwesomeButtonProgress>
					</Modal.Footer>
				</Modal>
			</div>
			<div className="modal-container">
				<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
					<Modal.Header>
						<Modal.Title>Delete Customer</Modal.Title>
						<CloseButton
							className="closeBtn"
							onClick={() => setShowDeleteModal(false)}
						>
							X
						</CloseButton>
					</Modal.Header>
					<Modal.Body>
						<p>
							Are you sure you want to delete the customer? This is{" "}
							<b>PERMANENT.</b>
						</p>
						{selectedCustomer && (
							<div>
								<p>Customer ID: {selectedCustomer[0]}</p>
								<p>First Name: {selectedCustomer[2]}</p>
								<p>Last Name: {selectedCustomer[3]}</p>
							</div>
						)}
					</Modal.Body>
					<Modal.Footer>
						<AwesomeButtonProgress
							type="primary"
							onPress={async (call, next) => {
								setCustomerID(selectedCustomer[0]);
								const custID = { customer_id };
								const response = await fetch("/deletecustomer", {
									method: "DELETE",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify([custID]),
								});
								if (response.ok) {
									setTimeout(() => {
										next(true, "Deleted!");
									}, 1000);
								} else {
									setTimeout(() => {
										next(false, response.headers.get("error"));
									}, 1000);
								}
							}}
						>
							Delete Customer
						</AwesomeButtonProgress>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	);
}
