import { Delete } from "@mui/icons-material";
import {
	Card,
	CardContent,
	Grid,
	Typography,
	Stack,
	Link,
	Divider,
	Button,
} from "@mui/material";
import { API, destroyEndpoint } from "../services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RateGauge from "./RateGuage";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { createConsumer } from "@rails/actioncable";

const HomeCard = ({ endpoint }) => {
	const subRef = useRef();
	const [lastBeat, setLastBeat] = useState(endpoint);
	const qClient = useQueryClient();
	const deleteEndpoint = useMutation({
		mutationFn: destroyEndpoint,
		mutationKey: ["delete-endpoint"],
		onSuccess: () => {
			qClient.invalidateQueries(["get-endpoints"]);
		},
	});

	const cable = createConsumer(`${API}/cable`);

	useEffect(() => {
		if (!subRef.current) {
			subRef.current = cable.subscriptions.create(
				{
					channel: "EndpointChannel",
					id: endpoint.id,
				},
				{
					connected() {
						console.log("Connected");
					},
					received(data) {
						setLastBeat(data);
					},
				}
			);
		}
		return () =>
			subRef.current && subRef.current.unsubscribe() && (subRef.current = null);
	}, [cable, subRef, endpoint]);

	return (
		<Card
			key={endpoint.id}
			sx={{ borderRadius: 4, px: 2, py: 4, bgcolor: "primary.light" }}
		>
			<CardContent>
				<Card sx={{ borderRadius: 4, px: 2, py: 4 }}>
					<CardContent>
						<Grid container>
							<Grid size={{ xs: 12, sm: 12, md: 6 }}>
								<Grid container gap={2}>
									<Grid size={{ xs: 12, sm: 12, md: 4 }}>
										<Stack spacing={3}>
											<Typography variant="h5"> {endpoint.name}</Typography>
											<Divider />
											<Stack spacing={2}>
												<Typography variant="h4" fontWeight="bold">
													{lastBeat.uptime}%
												</Typography>
												<Typography variant="h6">uptime</Typography>
											</Stack>
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, sm: 12, md: 4 }}>
										<Stack spacing={3}>
											<Typography variant="h5">Last heartbeat</Typography>
											<Divider />
											<Stack spacing={2}>
												<Typography variant="h4" fontWeight="bold">
													{dayjs(lastBeat.last_updated).format("hh:mm:ss a")}
												</Typography>
												<Typography variant="h6">
													{dayjs(lastBeat.last_updated).format("ddd MMM YYYY")}
												</Typography>
											</Stack>
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, sm: 12, md: 3 }}>
										<Stack spacing={3}>
											<Typography variant="h5">URL</Typography>
											<Divider />
											<Stack spacing={2}>
												<Typography
													variant="h4"
													component={Link}
													href={endpoint.url}
													fontWeight="bold"
												>
													{endpoint.name}
												</Typography>
												<Typography variant="h6">Response: 200</Typography>
											</Stack>
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, sm: 12, md: 3 }}>
										<Stack spacing={3} py={3}>
											<Button
												endIcon={<Delete />}
												onClick={() => deleteEndpoint.mutate(endpoint.id)}
												variant="outlined"
											>
												Remove
											</Button>
										</Stack>
									</Grid>
								</Grid>
							</Grid>
							<Grid size={{ xs: 12, sm: 12, md: 6 }} textAlign="center">
								<RateGauge uptime={lastBeat.uptime} />
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

export default HomeCard;
