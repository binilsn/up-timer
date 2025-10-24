import { Paper, Stack, Typography } from "@mui/material";
import { useCommon } from "../stores/common";
import { useQuery } from "@tanstack/react-query";
import { getLogs } from "../services";
import dayjs from "dayjs";

const Output = () => {
	const id = useCommon((state) => state.selectedEndpoint);

	const { data } = useQuery({
		queryKey: [`logs-${id}`],
		queryFn: () => getLogs(id),
		enabled: Boolean(id),
		select: (data) => data.data,
	});

	return (
		<Stack spacing={2}>
			{data?.map((item) => (
				<Stack direction="row" justifyContent="space-between" component={Paper} p={3}>
					<Typography variant="overline" fontWeight="bold">
						{item.response_code}
					</Typography>
					<Typography variant="overline" fontWeight="bold">
						{dayjs(item.created_at).format('hh:mm:ss a dddd MMM YYYY ')}
					</Typography>
				</Stack>
			))}
		</Stack>
	);
};

export default Output;
