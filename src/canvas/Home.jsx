import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getEndpoints } from "../services";
import { useCommon } from "../stores/common";
import { useEffect } from "react";
import HomeCard from "./HomeCard";

const Home = () => {
	const { setEndpoints } = useCommon();
	const { data } = useQuery({
		queryKey: ["get-endpoints"],
		queryFn: getEndpoints,
		refetchOnWindowFocus: false,
		select: (data) => data.data,
	});

	useEffect(() => {
		if (data) setEndpoints(data);
	}, [data, setEndpoints]);

	return (
		<Stack my={3} spacing={3}>
			{data?.map((item) => (
				<HomeCard endpoint={item} />
			))}
		</Stack>
	);
};

export default Home;
