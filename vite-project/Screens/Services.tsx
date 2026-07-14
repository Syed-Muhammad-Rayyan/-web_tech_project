import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Rating,
    TextField,
    Typography,
    Chip,
    Avatar
} from "@mui/material";
import React, { useState } from "react";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";

import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useMockState } from "../src/mockState";

const services = [
  {
    id: 1,
    title: "Home Repair",
    providers: 120,
    rating: 4.8,
    icon: <HomeRepairServiceIcon fontSize="large" color="primary" />,
  },
  {
    id: 2,
    title: "Delivery",
    providers: 80,
    rating: 4.9,
    icon: <LocalShippingIcon fontSize="large" color="primary" />,
  },
  {
    id: 3,
    title: "Healthcare",
    providers: 35,
    rating: 4.7,
    icon: <LocalHospitalIcon fontSize="large" color="primary" />,
  },
  {
    id: 4,
    title: "Pet Care",
    providers: 45,
    rating: 4.9,
    icon: <PetsIcon fontSize="large" color="primary" />,
  },
  {
    id: 5,
    title: "Cleaning",
    providers: 95,
    rating: 4.8,
    icon: <CleaningServicesIcon fontSize="large" color="primary" />,
  },
  {
    id: 6,
    title: "Car Wash",
    providers: 40,
    rating: 4.6,
    icon: <DirectionsCarIcon fontSize="large" color="primary" />,
  },
];

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const { users, matchProviders, currentUser } = useMockState();

  const [searchMode, setSearchMode] = useState<"standard" | "ai">("standard");
  const [standardQuery, setStandardQuery] = useState("");
  
  // AI Matcher State
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIMatch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResults([]);
    try {
      const results = await matchProviders(aiQuery, currentUser?.zone || "Zone A (North)", "Anytime");
      setAiResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(standardQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-50 py-10">
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" align="center" className="text-gray-800 tracking-tight">
            Explore Neighborhood Services
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 1, mb: 5 }}
          >
            Find trusted professionals available near you in Greenway.
          </Typography>

          {/* Search Toggle Buttons */}
          <div className="flex justify-center gap-3 mb-8">
            <Button
              variant={searchMode === "standard" ? "contained" : "outlined"}
              onClick={() => setSearchMode("standard")}
              sx={{ borderRadius: 30, textTransform: "none", px: 3, fontWeight: "bold" }}
            >
              Standard Categories
            </Button>
            <Button
              color="secondary"
              variant={searchMode === "ai" ? "contained" : "outlined"}
              onClick={() => setSearchMode("ai")}
              startIcon={<SmartToyIcon />}
              sx={{ borderRadius: 30, textTransform: "none", px: 3, fontWeight: "bold" }}
            >
              AI Smart Matcher Search
            </Button>
          </div>

          {searchMode === "standard" ? (
            <>
              <TextField
                fullWidth
                placeholder="Search services..."
                value={standardQuery}
                onChange={(e) => setStandardQuery(e.target.value)}
                sx={{ mb: 6, bgcolor: "white" }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                  sx: { borderRadius: "14px" }
                }}
              />

              <Grid container spacing={4}>
                {filteredServices.map((service) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
                    <Card
                      sx={{
                        borderRadius: 5,
                        transition: ".3s",
                        border: "1px solid #e5e7eb",
                        boxShadow: "none",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 10px 20px rgba(0,0,0,.05)",
                        },
                      }}
                    >
                      <CardContent className="text-center p-6 bg-white">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                          {service.icon}
                        </div>

                        <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                          {service.title}
                        </Typography>

                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Rating
                            value={service.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {service.rating}
                          </Typography>
                        </div>

                        <Typography variant="body2" color="text.secondary">
                          {service.providers} Providers Available
                        </Typography>

                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            mt: 3,
                            borderRadius: "12px",
                            textTransform: "none",
                            py: 1.2,
                            fontWeight: "bold"
                          }}
                          onClick={() => navigate(`/CategoryDetails/${service.id}`)}
                        >
                          View Providers
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            // AI Smart Matcher (Feature 4.2)
            <Box className="max-w-3xl mx-auto space-y-6">
              <Card sx={{ borderRadius: 4, p: 4, border: "1px solid #e5e7eb", boxShadow: "none" }} className="bg-white">
                <Typography variant="subtitle2" className="text-indigo-900 font-bold mb-2 uppercase flex items-center gap-1.5">
                  <SmartToyIcon sx={{ fontSize: 16 }} /> What service do you need?
                </Typography>
                <div className="flex gap-2">
                  <TextField
                    fullWidth
                    placeholder="Describe your need in details (e.g. 'I need help fixing kitchen light plugs this Saturday')"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAIMatch}
                    disabled={aiLoading}
                    sx={{ px: 4, borderRadius: "12px" }}
                  >
                    {aiLoading ? "Matching..." : "Match"}
                  </Button>
                </div>
              </Card>

              {aiResults.length > 0 && (
                <div className="space-y-4">
                  <Typography variant="h6" fontWeight="bold" className="text-gray-800">
                    AI Recommended Matches
                  </Typography>

                  {aiResults.map((result, index) => (
                    <Card
                      key={result.provider.id}
                      sx={{ borderRadius: 4, border: "1px solid #e5e7eb", boxShadow: "none" }}
                      className="bg-white p-6 hover:shadow-md transition"
                    >
                      <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, sm: 9 }} className="flex gap-4">
                          <Avatar sx={{ width: 56, height: 56, bgcolor: "#4f46e5", fontWeight: "bold" }}>
                            {result.provider.avatar || result.provider.name[0]}
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Typography fontWeight="bold" className="text-gray-800">{result.provider.name}</Typography>
                              {result.provider.verificationStatus === "Verified" && (
                                <VerifiedIcon className="text-blue-500" sx={{ fontSize: 16 }} />
                              )}
                              <Chip label={`Rank #${index + 1}`} size="small" color="secondary" className="text-[10px] font-bold" />
                            </div>
                            <Typography variant="caption" className="text-gray-400 block font-bold">
                              📍 {result.provider.zone} | Availability: {result.provider.availability}
                            </Typography>
                            {/* Match explanation analysis */}
                            <Typography variant="body2" className="text-indigo-900 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/50 mt-2 font-medium">
                              🤖 {result.explanation}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate("/messages")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl"
                          >
                            Message Provider
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </div>
              )}
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

