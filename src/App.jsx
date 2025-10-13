import { Box, Typography, Tab } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import "./App.css";
import { useCommon } from "./stores/common";
import { useState } from "react";
import NewEndpoint from "./canvas/NewEndpoint";
import Home from "./canvas/Home";
import Output from "./canvas/Output";
function App() {
	const endpoints = useCommon((state) => state.endpoints);
	const setSelectedEndpoint = useCommon((state) => state.setSelectedEndpoint);
	const [value, setValue] = useState("1");
	const handleChange = (event, newValue) => {
		setSelectedEndpoint(newValue);
		setValue(newValue);
	};

	return (
		<>
			<Typography mb={3} textTransform="uppercase" variant="h4" textAlign="center" letterSpacing={1}>
				up timer
			</Typography>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList
						centered
						onChange={handleChange}
						aria-label="lab API tabs example"
					>
						<Tab label="Home" value="home" />
						<Tab label="New Endpoint" value="new" />
						{/* <Tab label="About" value="about" />
						<Tab label="Help" value="help" /> */}
						{endpoints &&
							endpoints.map((item) => (
								<Tab label={item.name} value={item.id} />
							))}
					</TabList>
				</Box>
				<TabPanel value="home">
					<Home />
				</TabPanel>
				<TabPanel value="new">
					<NewEndpoint />
				</TabPanel>
				<TabPanel value="about">Item Three</TabPanel>
				<TabPanel value="help">Item Three</TabPanel>
				{endpoints &&
					endpoints.map((item) => (
						<TabPanel value={item.id}>
							<Output />
						</TabPanel>
					))}
			</TabContext>
		</>
		// <Grid container>
		// 	<Grid size={6}>
		// 		<Stack width="100%" height="100%">
		// 			<Dashboard />
		// 		</Stack>
		// 	</Grid>
		// 	<Grid size={6}>
		// 		<Stack p={3}>
		// 			{id ? (
		// 				<Output />
		// 			) : (
		// 				<Typography>Select a URL from the list.</Typography>
		// 			)}
		// 		</Stack>
		// 	</Grid>
		// </Grid>
	);
}

export default App;
