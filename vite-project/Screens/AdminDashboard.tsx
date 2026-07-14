import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Chip,
  Avatar
} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MapIcon from "@mui/icons-material/Map";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useMockState } from "../src/mockState";

export const AdminDashboard: React.FC = () => {
  const { users, bookings, zones, addZone, removeZone, approveVerification } = useMockState();
  const [newZoneName, setNewZoneName] = useState("");

  const pendingVerificationProviders = users.filter((u) => u.verificationStatus === "Pending");

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    addZone(newZoneName);
    setNewZoneName("");
  };

  // Analytics Metrics Simulation
  const bookingVolumeByZone = {
    "Zone A (North)": bookings.filter((b) => b.residentId === "res-1" || b.providerId === "prov-1").length,
    "Zone B (Central)": 8,
    "Zone C (South)": 5,
    "Zone D (East)": 2,
    "Zone E (West)": 1
  };

  const disputeRates = [
    { month: "Apr", rate: 5 },
    { month: "May", rate: 7 },
    { month: "Jun", rate: 4 },
    { month: "Jul", rate: 8 } // ~8 per month from Greenway client profile
  ];

  const providerRetention = [
    { category: "Home Repair", retention: 92 },
    { category: "Delivery", retention: 85 },
    { category: "Healthcare", retention: 78 },
    { category: "Pet Care", retention: 95 },
    { category: "Cleaning", retention: 89 }
  ];

  const popularCategories = [
    { category: "Home Repair", count: 120 },
    { category: "Cleaning", count: 95 },
    { category: "Delivery", count: 80 },
    { category: "Pet Care", count: 45 },
    { category: "Healthcare", count: 35 }
  ];

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-50 py-10">
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="tracking-tight text-gray-800 flex items-center gap-3">
            <QueryStatsIcon fontSize="large" className="text-indigo-650" /> Admin Command Center
          </Typography>
          <Typography color="text.secondary" className="mb-8">
            Review analytics, approve provider verification applications, and configure housing zones.
          </Typography>

          <Grid container spacing={4}>
            {/* Row 1: Charts Panel */}
            <Grid size={12}>
              <Card className="border border-gray-200 rounded-3xl shadow-sm bg-white p-6 mb-6">
                <Typography variant="h5" fontWeight="bold" className="text-gray-800 mb-6">
                  Platform Analytics Dashboard
                </Typography>
                <Grid container spacing={4}>
                  {/* Chart 1: Booking Volume by Zone */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 h-full">
                      <Typography variant="subtitle2" fontWeight="bold" className="text-gray-700 mb-3 text-center">
                        Booking Volume by Zone
                      </Typography>
                      <div className="space-y-2">
                        {Object.entries(bookingVolumeByZone).map(([zone, count]) => (
                          <div key={zone}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="truncate max-w-[120px]">{zone}</span>
                              <span>{count} bookings</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, count * 10)}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>

                  {/* Chart 2: Dispute Rate trends */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 h-full">
                      <Typography variant="subtitle2" fontWeight="bold" className="text-gray-700 mb-3 text-center">
                        Dispute Rate (Cases/mo)
                      </Typography>
                      <div className="flex items-end justify-around h-[120px] pt-4">
                        {disputeRates.map((d) => (
                          <div key={d.month} className="flex flex-col items-center gap-1.5 w-full">
                            <span className="text-[10px] font-bold text-gray-500">{d.rate}</span>
                            <div className="w-6 bg-rose-500 rounded-t-lg transition-all" style={{ height: `${d.rate * 10}px` }}></div>
                            <span className="text-xs font-bold text-gray-700">{d.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>

                  {/* Chart 3: Provider Retention rate */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 h-full">
                      <Typography variant="subtitle2" fontWeight="bold" className="text-gray-700 mb-3 text-center">
                        Provider Retention %
                      </Typography>
                      <div className="space-y-2">
                        {providerRetention.map((item) => (
                          <div key={item.category}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span>{item.category}</span>
                              <span className="text-emerald-700">{item.retention}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${item.retention}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>

                  {/* Chart 4: Popular Services count */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 h-full">
                      <Typography variant="subtitle2" fontWeight="bold" className="text-gray-700 mb-3 text-center">
                        Popular Service Listings
                      </Typography>
                      <div className="space-y-2">
                        {popularCategories.map((item) => (
                          <div key={item.category}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span>{item.category}</span>
                              <span>{item.count}</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(item.count / 150) * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Row 2: Provider Verification Requests & Zones */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card className="border border-gray-200 rounded-3xl shadow-sm bg-white p-6 h-full">
                <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-4 flex items-center gap-2">
                  <HowToRegIcon className="text-indigo-650" /> Provider Profile Verification Queue
                </Typography>
                <Divider className="mb-4" />
                
                {pendingVerificationProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <HowToRegIcon sx={{ fontSize: 40 }} />
                    <Typography className="mt-2 text-sm font-medium">No pending verification application requests.</Typography>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVerificationProviders.map((prov) => (
                      <div key={prov.id} className="border border-gray-150 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Typography fontWeight="bold" className="text-gray-800">{prov.name}</Typography>
                            <Typography variant="caption" className="text-gray-400 block mb-2">{prov.email}</Typography>
                            <Typography variant="body2" className="text-gray-600 mb-3">{prov.bio}</Typography>
                            
                            {prov.idProofUrl && (
                              <div className="mb-3">
                                <span className="text-xs font-bold text-gray-400 block mb-1">Uploaded ID Copy proof:</span>
                                <img
                                  src={prov.idProofUrl}
                                  alt="ID proof copy"
                                  className="h-20 w-auto rounded-lg border border-gray-200 object-cover shadow-sm hover:scale-105 transition duration-200 cursor-zoom-in"
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => approveVerification(prov.id)}
                            className="shrink-0"
                          >
                            Verify & Badge
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card className="border border-gray-200 rounded-3xl shadow-sm bg-white p-6 h-full">
                <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-4 flex items-center gap-2">
                  <MapIcon className="text-indigo-650" /> Greenway Zone Configurations
                </Typography>
                <Divider className="mb-4" />

                <form onSubmit={handleAddZone} className="flex gap-2 mb-4">
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. Zone F (Northeast)"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <AddCircleOutlineIcon />
                  </Button>
                </form>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {zones.map((zone) => (
                    <div key={zone} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 hover:bg-gray-100 transition">
                      <Typography variant="body2" fontWeight="semibold" className="text-gray-700">{zone}</Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeZone(zone)}
                        disabled={zones.length <= 1}
                      >
                        <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
