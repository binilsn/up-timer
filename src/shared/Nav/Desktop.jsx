import { Drafts, Inbox } from "@mui/icons-material";
import {
	Box,
	List,
	Paper,
	ListItem,
	ListItemIcon,
	ListItemButton,
	ListItemText,
	Divider,
} from "@mui/material";
const Desktop = () => {
	return (
		<Box
			sx={{ display: { xs: "none", sm: "none", md: "block", width: "30%" } }}
		>
			<Paper elevation={12} sx={{ p: 1 }}>
				<List>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<Inbox />
							</ListItemIcon>
							<ListItemText primary="Inbox" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<Drafts />
							</ListItemIcon>
							<ListItemText primary="Drafts" />
						</ListItemButton>
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="Trash" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton component="a" href="#simple-list">
							<ListItemText primary="Spam" />
						</ListItemButton>
					</ListItem>
				</List>
			</Paper>
		</Box>
	);
};

export default Desktop;
