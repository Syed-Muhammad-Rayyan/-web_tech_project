import { Container, Grid, Typography } from "@mui/material";

import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PetsIcon from "@mui/icons-material/Pets";
import { CategoryCards } from "../Components/CategoryCards";
import { Footer } from "../Components/Footer";
import { HeroSection } from "../Components/HeroSection";
import { Navbar } from "../Components/Navbar";

// Dummy Data

const services = [
  {
    id: 1,
    title: "Home Repair",
    icon: <HomeRepairServiceIcon fontSize="large" color="primary" />,
  },
  {
    id: 2,
    title: "Delivery",
    icon: <LocalShippingIcon fontSize="large" color="primary" />,
  },
  {
    id: 3,
    title: "Healthcare",
    icon: <LocalHospitalIcon fontSize="large" color="primary" />,
  },
  {
    id: 4,
    title: "Pet Care",
    icon: <PetsIcon fontSize="large" color="primary" />,
  },
  {
    id: 5,
    title: "Cleaning",
    icon: <CleaningServicesIcon fontSize="large" color="primary" />,
  },
  {
    id: 6,
    title: "Car Wash",
    icon: <DirectionsCarIcon fontSize="large" color="primary" />,
  },
];

export const Home: React.FC = () => {
  return (
    <>
      {/* Nav  */}
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <HeroSection />
        {/* Services */}
        <Container maxWidth="lg" className="py-16">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Popular Services
          </Typography>

          <Typography align="center" color="text.secondary" className="mb-10">
            Find trusted services available in your neighbourhood.
          </Typography>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                {" "}
                <CategoryCards
                  id={service.id}
                  icon={service.icon}
                  title={service.title}
                  desc={service.title}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
      {/* Footer  */}
      <Footer />
    </>
  );
};
