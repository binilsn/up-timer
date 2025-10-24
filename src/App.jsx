import {
	Typography,
	Card,
	CardContent,
	Stack,
	CardActions,
	Grid,
	IconButton,
	Link,
	Divider,
	CardActionArea,
} from "@mui/material";
import "./App.css";
import { useCommon } from "./stores/common";
import {
	ArrowBackIosNewSharp,
	ArrowForwardIosSharp,
	TroubleshootSharp,
	VisibilitySharp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEndpoints } from "./services";
import RateGauge from "./canvas/RateGuage";
import HomeCard from "./canvas/HomeCard";
function App() {
	const { setSelectedEndpoint, selectedEndpoint } = useCommon((state) => state);

	const navigate = useNavigate();

	const { data } = useQuery({
		queryKey: ["get-endpoints"],
		queryFn: getEndpoints,
		select: (data) => data.data,
		refetchOnWindowFocus: false,
	});
	return (
		<>
			<Stack spacing={4}>
				<section id="active-endpoints">
					<Card
						sx={{ borderRadius: 4, px: 2, py: 4, bgcolor: "primary.light" }}
					>
						<CardContent>
							<Grid container>
								{data?.length ? (
									data.map((item) => (
										<Grid size={{xm: 12, sm: 6, md: 4}}  key={item.id}>
											<Card sx={{ p: 2, borderRadius: 4 }}>
												<CardContent>
													<Stack spacing={2}>
														<Typography variant="overline" fontWeight="bold">
															{item.name}
														</Typography>
														<Divider />
														<Typography component={Link} variant="title1">
															{item.url}
														</Typography>
													</Stack>
												</CardContent>
												<CardActions>
													<Stack
														direction="row"
														spacing={3}
														justifyContent="flex-end"
													>
														<IconButton
															onClick={() => setSelectedEndpoint(item)}
														>
															<TroubleshootSharp />
														</IconButton>
														<IconButton>
															<VisibilitySharp />
														</IconButton>
													</Stack>
												</CardActions>
											</Card>
										</Grid>
									))
								) : (
									<Grid size={4}>
										<Card sx={{ p: 2, borderRadius: 4, height: "120px" }}>
											<CardActionArea
												sx={{ height: "100%" }}
												onClick={() => navigate("new")}
											>
												<CardContent
													sx={{
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}
												>
													<Typography variant="h5">Add new endpoint</Typography>
												</CardContent>
											</CardActionArea>
										</Card>
									</Grid>
								)}
							</Grid>
						</CardContent>
						{data?.length !== 0 && (
							<CardActions>
								<Grid container>
									<Grid size={6}>
										<IconButton sx={{ color: "white" }}>
											<ArrowBackIosNewSharp />
										</IconButton>
									</Grid>
									<Grid size={6}>
										<IconButton sx={{ color: "white" }}>
											<ArrowForwardIosSharp />
										</IconButton>
									</Grid>
								</Grid>
							</CardActions>
						)}
					</Card>
				</section>
				<section id="overview" style={{ height: "100%" }}>
					{selectedEndpoint && <HomeCard endpoint={selectedEndpoint} />}
				</section>
			</Stack>
		</>
	);
}

export default App;
