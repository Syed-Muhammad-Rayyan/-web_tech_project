import {
    Box,
    Container,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";

export const Footer:React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box className="bg-slate-900 text-white mt-16">
      <Container maxWidth="lg" className="py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                NH
              </div>

              <Typography variant="h6" fontWeight="bold">
                Neighbour Hub
              </Typography>
            </div>

            <Typography
              variant="body2"
              className="text-gray-400 mt-4 leading-7"
            >
              Connecting neighbours with trusted local services and making
              communities stronger.
            </Typography>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>

            <ul className="space-y-3 text-gray-400">
              <li onClick={() => navigate("/home")} className="hover:text-white cursor-pointer transition">
                Home
              </li>
              <li onClick={() => navigate("/services")} className="hover:text-white cursor-pointer transition">
                Services
              </li>
              <li onClick={() => navigate("/myrequests")} className="hover:text-white cursor-pointer transition">
                My Requests
              </li>
              <li onClick={() => navigate("/profile")} className="hover:text-white cursor-pointer transition">
                Profile
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact
            </Typography>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-2">
                <LocationOnIcon fontSize="small" />
                Karachi, Pakistan
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon fontSize="small" />
                +92 300 1234567
              </div>

              <div className="flex items-center gap-2">
                <EmailIcon fontSize="small" />
                support@neighbourhub.com
              </div>

            </div>
          </div>

          {/* Social */}
          <div>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>

            <Typography
              variant="body2"
              className="text-gray-400 mb-3"
            >
              Stay connected with us.
            </Typography>

            <div>

              <IconButton sx={{ color: "white" }}>
                <FacebookIcon />
              </IconButton>

              <IconButton sx={{ color: "white" }}>
                <InstagramIcon />
              </IconButton>

              <IconButton sx={{ color: "white" }}>
                <LinkedInIcon />
              </IconButton>

            </div>
          </div>

        </div>

        <Divider sx={{ bgcolor: "#475569", my: 5 }} />

        <Typography
          align="center"
          className="text-gray-400"
        >
          © {new Date().getFullYear()} Neighbour Hub. All Rights Reserved.
        </Typography>

      </Container>
    </Box>
  );
};

export default Footer;