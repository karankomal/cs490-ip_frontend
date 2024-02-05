import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Customers from "./pages/Customers";
import Films from "./pages/Films";
import Home from "./pages/Home";

function App() {
	return (
		<>
			<Navbar />
			<div className="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/films" element={<Films />} />
					<Route path="/customers" element={<Customers />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
