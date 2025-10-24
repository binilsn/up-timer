import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
ChartJS.register(ArcElement, Tooltip, Legend, annotationPlugin);

const RateGauge = ({ uptime }) => {	
	const downTime = 100 - uptime;
	const annotation = {
		type: "doughnutLabel",
		content: () => [`${uptime}` + " %", "Total uptime"],
		drawTime: "beforeDraw",
		position: {
			y: "-50%",
		},
		font: [{ size: 30, weight: "bold" }, { size: 20 }],
		color: () => ["green", "black"],
	};

	const datas = {
		labels: ["Success", "Failed"],
		datasets: [
			{
				data: [uptime, downTime],
				backgroundColor: ["rgba(6, 243, 61, 0.2)", "rgba(241, 7, 7, 0.2)"],
				borderColor: ["rgba(112, 252, 112, 0.99)", "rgba(203, 93, 93, 1)"],
				borderWidth: 1,
			},
		],
	};
	return (
		<Doughnut
			data={datas}
			options={{
				aspectRatio: 2,
				circumference: 180,
				rotation: -90,
				cutout: "80%",
				responsive: true,
				plugins: {
					legend: {
						display: false,
					},
					annotation: {
						annotations: {
							annotation,
						},
					},
				},
			}}
		/>
	);
};

export default RateGauge;
