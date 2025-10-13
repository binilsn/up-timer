import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardActions,
	Divider,
	Paper,
	Stack,
	Typography,
	Grid,
	IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { destroyEndpoint, getEndpoints } from "../services";
import { useCommon } from "../stores/common";
import { useEffect } from "react";
const Home = () => {
	const { setSelectedEndpoint, setEndpoints } = useCommon();
	const qClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["get-endpoints"],
		queryFn: getEndpoints,
		select: (data) => data.data,
	});
	const deleteEndpoint = useMutation({
		mutationFn: destroyEndpoint,
		mutationKey: ["delete-endpoint"],
		onSuccess: () => {
			setEndpoints(data.data);
			qClient.invalidateQueries(["get-endpoints"]);
		},
	});
	useEffect(() => {
		if (data) setEndpoints(data);
	}, [data, setEndpoints]);

	const selectEndpoint = (id) => setSelectedEndpoint(id);
	return (
		<Stack my={3} spacing={3}>
			{data?.map((item) => (
				<Card variant="outlined" key={item.id}>
					<CardContent>
						<CardActionArea onClick={() => selectEndpoint(item.id)}>
							<CardHeader
								title={
									<Grid container wrap="wrap">
										<Grid size={12}>
											<Typography
												variant="title1"
												fontWeight="bold"
												letterSpacing={2}
											>
												{item.name}
											</Typography>
										</Grid>
										<Grid size={6}>
											<Typography variant="overline">{item.url}</Typography>
										</Grid>
									</Grid>
								}
							/>
						</CardActionArea>
					</CardContent>
					<CardActions>
						<IconButton
							onClick={() => deleteEndpoint.mutate(item.id)}
							size="small"
							variant="contained"
						>
							<Delete />
						</IconButton>
					</CardActions>
				</Card>
			))}
		</Stack>
	);
};

export default Home;
