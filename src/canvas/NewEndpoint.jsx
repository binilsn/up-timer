import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addEndpoint } from "../services";
import {
	FormControl,
	MenuItem,
	Select,
	TextField,
	Button,
	InputLabel,
	Grid,
	Card,
	CardContent,
	Typography,
} from "@mui/material";
import { useCommon } from "../stores/common";
import { useNavigate } from "react-router-dom";

const NewEndpoint = () => {
	const setSelectedEndpoint = useCommon((state) => state.setSelectedEndpoint);
	const minutes = [];
	const hours = [];
	const navigate = useNavigate();
	for (let index = 1; index < 61; index++) {
		minutes.push(index);
		if (index > 10) continue;
		hours.push(index);
	}

	const [durationType, setDurationType] = useState(0);

	const { handleSubmit, reset, control, subscribe } = useForm({
		mode: "onChange",
	});
	const { mutate } = useMutation({
		mutationFn: addEndpoint,
		mutationKey: ["add-endpoint"],
		onSettled: () => reset(),
		onSuccess: (data) => {
			setSelectedEndpoint(data.data.id);
			navigate("/", { replace: true });
		},
	});
	useEffect(() => {
		const callback = subscribe({
			formState: {
				values: true,
			},
			callback: ({ values }) => setDurationType(values.duration_type),
		});
		return () => callback();
	}, [subscribe]);

	const onSubmit = (data) => mutate({ endpoint: data });

	return (
		<Card sx={{ borderRadius: 4, p: 3, m: 2 }}>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container>
						<Grid size={12} p={2}>
							<Typography variant="h4">New Endpoint</Typography>
						</Grid>
						<Grid size={12} p={2}>
							<Controller
								name="name"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										fullWidth
										title="Name"
										label="Name"
										{...field}
										variant="filled"
									/>
								)}
							/>
						</Grid>
						<Grid size={12} p={2}>
							<Controller
								name="url"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										fullWidth
										title="URL"
										label="URL"
										{...field}
										variant="filled"
									/>
								)}
							/>
						</Grid>
						<Grid size={12} p={2}>
							<Controller
								control={control}
								name="request"
								defaultValue="get"
								render={({ field }) => (
									<FormControl fullWidth variant="filled">
										<InputLabel id="demo-simple-select-label">
											Request type
										</InputLabel>
										<Select {...field} label="Age">
											<MenuItem value={"get"}>GET</MenuItem>
											<MenuItem value={"post"}>POST</MenuItem>
											<MenuItem value={"patch"}>PATCH</MenuItem>
										</Select>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={12} p={2}>
							<Controller
								control={control}
								name="duration_type"
								defaultValue="0"
								render={({ field }) => (
									<FormControl fullWidth variant="filled">
										<InputLabel id="demo-simple-select-label">
											Duration type
										</InputLabel>
										<Select {...field} label="duration_type">
											<MenuItem value={0}>Minute</MenuItem>
											<MenuItem value={1}>Hour</MenuItem>
										</Select>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={12} p={2}>
							<Controller
								control={control}
								name="duration"
								defaultValue="1"
								render={({ field }) => (
									<FormControl fullWidth variant="filled">
										<InputLabel id="demo-simple-select-label">
											Duration
										</InputLabel>
										<Select {...field} label="duration">
											{durationType == 0
												? minutes.map((i) => (
														<MenuItem value={i}>{`${i} Minutes`}</MenuItem>
												  ))
												: hours.map((i) => (
														<MenuItem value={i}>{`${i} Hour`}</MenuItem>
												  ))}
										</Select>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={12} textAlign="center" p={2}>
							<Button variant="contained" type="submit">
								Monitor
							</Button>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
};

export default NewEndpoint;
