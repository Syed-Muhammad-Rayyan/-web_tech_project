import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BuildIcon from "@mui/icons-material/Build";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Avatar,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MessageIcon from "@mui/icons-material/Message";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Footer from "../Components/Footer";
import { Navbar } from "../Components/Navbar";
import { useMockState } from "../src/mockState";

const CATEGORY_NAMES: { [key: string]: string } = {
  "1": "Home Repair",
  "2": "Delivery",
  "3": "Healthcare",
  "4": "Pet Care",
  "5": "Cleaning",
  "6": "Car Wash"
};

export const CategoryDetails = () => {
  const navigate = useNavigate();
  const { categoryid } = useParams();
  const { users, createBooking, getAISentimentProfile, reviews } = useMockState();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Booking form state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDesc, setBookingDesc] = useState("");

  const categoryName = categoryid ? CATEGORY_NAMES[categoryid] || "Home Repair" : "Home Repair";

  // Filter providers that offer this category
  const categoryProviders = users.filter(
    (u) => u.role === "Provider" && u.categories?.includes(categoryName)
  );

  const handleOpenBooking = (providerId: string) => {
    setSelectedProviderId(providerId);
    setBookingOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedProviderId || !bookingDate || !bookingTime || !bookingDesc) return;
    createBooking(selectedProviderId, categoryName, bookingDate, bookingTime, bookingDesc);
    setBookingOpen(false);
    setBookingDate("");
    setBookingTime("");
    setBookingDesc("");
  };

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-150/40 py-10">
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 4 }}
          >
            Back
          </Button>

          <Card
            sx={{
              borderRadius: 5,
              boxShadow: "0 10px 30px rgba(0,0,0,.04)",
              mb: 5,
              border: "1px solid #e5e7eb"
            }}
          >
            <CardContent className="text-center py-10 bg-white">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto shadow-sm">
                <BuildIcon sx={{ fontSize: 36, color: "#4f46e5" }} />
              </div>
              <Typography variant="h4" fontWeight="bold" className="mt-4 text-gray-800">
                {categoryName} Services
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Find and hire verified neighborhood professionals covering {categoryName}.
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h5" fontWeight="bold" gutterBottom className="text-gray-800 mb-6">
            Available Service Providers
          </Typography>

          {categoryProviders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
              <Typography color="text.secondary">No providers available in this category yet.</Typography>
            </div>
          ) : (
            <Grid container spacing={4}>
              {categoryProviders.map((prov) => {
                // Get provider average rating
                const provReviews = reviews.filter((r) => r.targetId === prov.id);
                const avgRating = provReviews.length > 0 
                  ? provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length
                  : 5;

                // AI Review Sentiment (Feature 4.3)
                const sentiment = getAISentimentProfile(prov.id);

                return (
                  <Grid size={12} key={prov.id}>
                    <Card sx={{ borderRadius: 4, border: "1px solid #e5e7eb", boxShadow: "none" }} className="bg-white hover:shadow-md transition">
                      <CardContent className="p-6">
                        <Grid container spacing={3} alignItems="center">
                          {/* Left: Avatar & Basic Stats */}
                          <Grid size={{ xs: 12, md: 3 }} className="text-center md:text-left flex flex-col items-center">
                            <Avatar sx={{ width: 80, height: 80, bgcolor: "#4f46e5", fontSize: 28, fontWeight: "bold" }}>
                              {prov.avatar || prov.name[0]}
                            </Avatar>
                            <div className="flex items-center gap-1.5 mt-3 justify-center">
                              <Typography variant="subtitle1" fontWeight="bold" className="text-gray-800">
                                {prov.name}
                              </Typography>
                              {prov.verificationStatus === "Verified" && (
                                <VerifiedIcon className="text-blue-500" sx={{ fontSize: 18 }} />
                              )}
                            </div>
                            <Rating value={avgRating} precision={0.5} readOnly size="small" className="mt-1" />
                            <Typography variant="caption" className="text-gray-400 block mt-1">
                              {provReviews.length} Verified Reviews
                            </Typography>
                            <Typography variant="caption" className="text-gray-500 font-bold block mt-1">
                              📍 {prov.zone}
                            </Typography>
                          </Grid>

                          {/* Middle: Bio & AI Sentiment Analysis Profile */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="body2" className="text-gray-650 mb-4 whitespace-pre-line leading-relaxed">
                              {prov.bio || "No description provided."}
                            </Typography>

                            {/* AI sentiment box (requires at least 3 reviews) */}
                            {sentiment.reliabilityScore > 0 ? (
                              <Box className="bg-indigo-50/20 border border-indigo-100 rounded-2xl p-4 mt-2">
                                <Typography variant="caption" fontWeight="bold" className="text-indigo-900 flex items-center gap-1 mb-2">
                                  <SmartToyIcon sx={{ fontSize: 14 }} /> AI-Generated Trust Profile
                                </Typography>
                                <Typography variant="body2" className="text-gray-600 mb-2 italic">
                                  "{sentiment.summary}"
                                </Typography>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {sentiment.themes.map((theme: string) => (
                                    <Chip key={theme} label={theme} size="small" color="success" variant="outlined" className="text-[10px]" />
                                  ))}
                                  {sentiment.complaints.map((comp: string) => (
                                    <Chip key={comp} label={comp} size="small" color="warning" variant="outlined" className="text-[10px]" />
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-gray-500">Reliability Index:</span>
                                  <span className="text-xs font-bold text-indigo-700">{sentiment.reliabilityScore}/100</span>
                                </div>
                              </Box>
                            ) : (
                              <Typography variant="caption" className="text-gray-400 block italic">
                                AI Sentiment Profile unlocks after 3 completed booking reviews.
                              </Typography>
                            )}
                          </Grid>

                          {/* Right: Availability & Call To Actions */}
                          <Grid size={{ xs: 12, md: 3 }} className="flex flex-col gap-2.5">
                            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-center">
                              <Typography variant="caption" className="text-gray-400 block font-bold">AVAILABILITY CALENDAR</Typography>
                              <Typography variant="body2" fontWeight="bold" className="text-gray-700">{prov.availability || "Flexible Hours"}</Typography>
                            </div>
                            <Button
                              fullWidth
                              variant="contained"
                              className="bg-indigo-600 hover:bg-indigo-700 font-bold py-2 rounded-xl"
                              startIcon={<CalendarMonthIcon />}
                              onClick={() => handleOpenBooking(prov.id)}
                            >
                              Book Service
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              className="border-gray-300 text-gray-700 font-bold py-2 rounded-xl"
                              startIcon={<MessageIcon />}
                              onClick={() => navigate("/messages")}
                            >
                              Chat Now
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Booking Form Dialog */}
      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-xl text-gray-800 border-b border-gray-150 pb-3">Book Service Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3, pb: 1 }}>
            <TextField
              fullWidth
              type="date"
              label="Preferred Date"
              InputLabelProps={{ shrink: true }}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              type="time"
              label="Preferred Time Slot"
              InputLabelProps={{ shrink: true }}
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Job Description Details"
              placeholder="Describe what help you need in detail..."
              value={bookingDesc}
              onChange={(e) => setBookingDesc(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-150">
          <Button onClick={() => setBookingOpen(false)} sx={{ fontWeight: "bold" }}>Cancel</Button>
          <Button onClick={handleConfirmBooking} variant="contained" className="bg-indigo-650 hover:bg-indigo-750 font-bold px-5 py-2 rounded-xl">Confirm Booking</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

