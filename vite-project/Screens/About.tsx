import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export const About: React.FC = () => {
  return (
    <>
    {/* Nav  */}
    <Navbar/>
      <Box className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <Box className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white py-20">
          <Container maxWidth="lg" className="text-center">
            <Typography variant="h3" fontWeight="bold">
              About Neighbour Hub
            </Typography>

            <Typography sx={{ mt: 3, maxWidth: 700, mx: "auto" }}>
              Connecting neighbours with trusted local services and helping
              communities grow stronger together.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" className="py-16">
          {/* Mission */}
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"
                alt="Community"
                className="rounded-3xl shadow-xl w-full"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Our Mission
              </Typography>

              <Typography color="text.secondary" sx={{ lineHeight: 2 }}>
                Neighbour Hub is designed to make finding trusted local services
                simple and convenient. Whether you need home repairs,
                healthcare, pet care, cleaning, or delivery services, we connect
                you with reliable people from your own community.
              </Typography>
            </Grid>
          </Grid>

          {/* Features */}

          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ mt: 12, mb: 6 }}
          >
            Why Choose Us?
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: "Trusted Services",
                icon: (
                  <VerifiedUserIcon color="primary" sx={{ fontSize: 45 }} />
                ),
                desc: "Verified professionals from your local area.",
              },
              {
                title: "Easy Search",
                icon: <SearchIcon color="primary" sx={{ fontSize: 45 }} />,
                desc: "Find nearby services quickly and easily.",
              },
              {
                title: "Community Driven",
                icon: <GroupsIcon color="primary" sx={{ fontSize: 45 }} />,
                desc: "Strengthening neighbourhood connections.",
              },
              {
                title: "Reliable Support",
                icon: (
                  <HomeRepairServiceIcon
                    color="primary"
                    sx={{ fontSize: 45 }}
                  />
                ),
                desc: "Reliable service providers for everyday needs.",
              },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
                <Card
                  sx={{
                    borderRadius: 5,
                    textAlign: "center",
                    transition: ".3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent className="py-8">
                    {item.icon}

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                      {item.title}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Statistics */}

          <Box className="mt-20">
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              Community Impact
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
              {[
                {
                  number: "150+",
                  title: "Service Providers",
                },
                {
                  number: "500+",
                  title: "Happy Users",
                },
                {
                  number: "50+",
                  title: "Communities",
                },
              ].map((item) => (
                <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                  <Card
                    sx={{
                      borderRadius: 5,
                      textAlign: "center",
                    }}
                  >
                    <CardContent className="py-8">
                      <Typography
                        variant="h3"
                        color="primary"
                        fontWeight="bold"
                      >
                        {item.number}
                      </Typography>

                      <Typography sx={{ mt: 2 }}>{item.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA */}

          <Box className="text-center mt-20">
            <Typography variant="h4" fontWeight="bold">
              Join Our Community Today
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Discover trusted local services and become part of a growing
              neighbourhood network.
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 4,
                px: 5,
                py: 1.5,
                borderRadius: 10,
                textTransform: "none",
                fontSize: 16,
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
      {/* Footer  */}
      <Footer/>
    </>
  );
};
