import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    TextField,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import React, { useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import StarsIcon from "@mui/icons-material/Stars";
import InfoIcon from "@mui/icons-material/Info";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useMockState } from "../src/mockState";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Profile: React.FC = () => {
  const { currentUser, updateProviderProfile, upgradeToProvider, getAIEnhancedListing, reviews } = useMockState();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Edit fields state
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [availability, setAvailability] = useState(currentUser?.availability || "");
  const [coverageRadius, setCoverageRadius] = useState(currentUser?.coverageRadius || 5);
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");

  // Upgrade fields state
  const [upgradeAddress, setUpgradeAddress] = useState("");
  const [upgradePhone, setUpgradePhone] = useState("");
  const [upgradeBio, setUpgradeBio] = useState("");
  const [idProof, setIdProof] = useState("");

  // AI Enhancer state
  const [enhancerOpen, setEnhancerOpen] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Home Repair");
  const [uspInput, setUspInput] = useState("");
  const [aiEnhancedResult, setAiEnhancedResult] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <Box className="min-h-screen flex items-center justify-center bg-gray-50">
          <Typography variant="h5" color="text.secondary">Please Sign In to view profile.</Typography>
        </Box>
        <Footer />
      </>
    );
  }

  const handleEditSave = () => {
    updateProviderProfile({
      bio,
      availability,
      coverageRadius,
      phone,
      address
    });
    setEditOpen(false);
  };

  const handleUpgradeSubmit = () => {
    if (!upgradeAddress || !upgradePhone || !upgradeBio) {
      toast.error("Please fill in address, phone, and bio for verification.");
      return;
    }
    upgradeToProvider({
      address: upgradeAddress,
      phone: upgradePhone,
      bio: upgradeBio,
      idProofUrl: idProof || "https://images.unsplash.com/photo-1554774853-719586f82d77?w=300",
      availability: "Weekdays 9am-5pm",
      coverageRadius: 5,
      categories: ["Home Repair"]
    });
    setUpgradeOpen(false);
  };

  const triggerAIEnhancer = async () => {
    if (!rawInput.trim()) return;
    setAiLoading(true);
    setAiEnhancedResult(null);
    try {
      const output = await getAIEnhancedListing(rawInput, categoryInput, uspInput);
      setAiEnhancedResult(output);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAIEnhanced = () => {
    if (!aiEnhancedResult) return;
    const formattedBio = `${aiEnhancedResult.summary}\n\nWhat's Included:\n${aiEnhancedResult.included.map((item: string) => `• ${item}`).join("\n")}\n\nWhat to Expect:\n${aiEnhancedResult.expect}\n\n${aiEnhancedResult.cta}`;
    setBio(formattedBio);
    setEnhancerOpen(false);
    toast.success("AI Polished listing description imported!");
  };

  // Profile Completeness Score
  let completeness = 20; // Starts with name/email
  if (currentUser.phone) completeness += 20;
  if (currentUser.address) completeness += 20;
  if (currentUser.bio) completeness += 20;
  if (currentUser.verificationStatus === "Verified") completeness += 20;

  // Reviews score
  const providerReviews = reviews.filter((r) => r.targetId === currentUser.id);
  const averageRating = providerReviews.length > 0 
    ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length
    : 5;

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-100 py-10">
        <Container maxWidth="md">
          {/* Profile Card */}
          <Card
            sx={{
              borderRadius: 5,
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            }}
          >
            <CardContent className="p-10">
              <div className="flex flex-col items-center">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 40,
                    bgcolor: "#4f46e5",
                  }}
                >
                  {currentUser.avatar || currentUser.name[0]}
                </Avatar>

                <div className="flex items-center gap-2 mt-3">
                  <Typography variant="h4" fontWeight="bold">
                    {currentUser.name}
                  </Typography>
                  {currentUser.verificationStatus === "Verified" && (
                    <VerifiedIcon className="text-blue-500" sx={{ fontSize: 28 }} />
                  )}
                </div>

                <Typography color="text.secondary">{currentUser.email}</Typography>
                
                {currentUser.role === "Provider" && (
                  <Chip
                    label={currentUser.verificationStatus === "Verified" ? "Verified Provider" : "Pending ID Review"}
                    color={currentUser.verificationStatus === "Verified" ? "success" : "warning"}
                    variant="outlined"
                    size="small"
                    className="mt-2"
                  />
                )}
              </div>

              <Container className="flex flex-row flex-wrap gap-4 justify-evenly items-center mt-8 p-4 bg-slate-50/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <PhoneRoundedIcon color="primary" />
                  <Typography variant="body2">{currentUser.phone || "No phone added"}</Typography>
                </div>

                <div className="flex items-center gap-3">
                  <LocationOnRoundedIcon color="primary" />
                  <Typography variant="body2">{currentUser.address || "No address added"}</Typography>
                </div>

                <div className="flex items-center gap-3">
                  <GroupsRoundedIcon color="primary" />
                  <Typography variant="body2">{currentUser.zone}</Typography>
                </div>

                <div className="flex items-center gap-3">
                  <EmailRoundedIcon color="primary" />
                  <Typography variant="body2">{currentUser.email}</Typography>
                </div>
              </Container>

              {/* Bio block for Providers */}
              {currentUser.role === "Provider" && currentUser.bio && (
                <div className="mt-8 bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6">
                  <Typography variant="subtitle2" fontWeight="bold" className="text-indigo-900 mb-2">
                    Listing Description & Bio:
                  </Typography>
                  <Typography className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                    {currentUser.bio}
                  </Typography>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-10">
                {currentUser.role === "Resident" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setUpgradeOpen(true)}
                    startIcon={<StarsIcon />}
                    sx={{
                      borderRadius: "30px",
                      px: 4,
                      textTransform: "none",
                      fontWeight: "bold"
                    }}
                  >
                    Upgrade to Provider
                  </Button>
                )}

                {currentUser.role === "Provider" && (
                  <Button
                    variant="contained"
                    startIcon={<EditRoundedIcon />}
                    onClick={() => {
                      setBio(currentUser.bio || "");
                      setAvailability(currentUser.availability || "");
                      setCoverageRadius(currentUser.coverageRadius || 5);
                      setPhone(currentUser.phone || "");
                      setAddress(currentUser.address || "");
                      setEditOpen(true);
                    }}
                    sx={{
                      borderRadius: "30px",
                      px: 4,
                      textTransform: "none",
                      fontWeight: "bold"
                    }}
                  >
                    Edit Profile
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutRoundedIcon />}
                  onClick={() => {
                    navigate("/");
                    toast.info("Logged out.");
                  }}
                  sx={{
                    borderRadius: "30px",
                    px: 4,
                    textTransform: "none",
                    fontWeight: "bold"
                  }}
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics & Completeness */}
          {currentUser.role === "Provider" && (
            <>
              {/* Profile Completeness Score */}
              <Card sx={{ borderRadius: 5, mt: 6, p: 4, border: "1px solid #e5e7eb" }}>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="subtitle1" fontWeight="bold" className="text-gray-800 flex items-center gap-1.5">
                    <InfoIcon color="primary" sx={{ fontSize: 18 }} /> Profile Completeness Score
                  </Typography>
                  <Typography fontWeight="bold" color="primary">{completeness}%</Typography>
                </div>
                <LinearProgress variant="determinate" value={completeness} className="h-2 rounded-full" />
                <Typography variant="caption" className="text-gray-400 block mt-2">
                  Fill all details, verify your profile ID proof to boost search visibility listing rank!
                </Typography>
              </Card>

              <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
                Provider Statistics
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card sx={{ borderRadius: 4 }}>
                    <CardContent className="text-center py-6">
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        {currentUser.responseRate || 100}%
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 font-bold mt-1">Response Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card sx={{ borderRadius: 4 }}>
                    <CardContent className="text-center py-6">
                      <Typography variant="h3" color="success.main" fontWeight="bold">
                        {currentUser.avgResponseTime || "Instant"}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 font-bold mt-1">Avg. Response Time</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card sx={{ borderRadius: 4 }}>
                    <CardContent className="text-center py-6">
                      <Typography variant="h3" color="warning.main" fontWeight="bold">
                        {averageRating.toFixed(1)}⭐
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 font-bold mt-1">Reputation Score</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold">Edit Provider Profile</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="subtitle2" className="text-gray-500 font-bold">Listing Description</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SmartToyIcon />}
              onClick={() => setEnhancerOpen(true)}
              className="text-indigo-650"
            >
              AI Enhancer Listing
            </Button>
          </div>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Introduce yourself and details of services you offer..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="Service Coverage Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            fullWidth
            label="Availability Hours (e.g. Saturdays 9am-6pm)"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <TextField
            fullWidth
            type="number"
            label="Coverage Zone Radius (km)"
            value={coverageRadius}
            onChange={(e) => setCoverageRadius(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" className="bg-indigo-600 hover:bg-indigo-700">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade to Provider Dialog */}
      <Dialog open={upgradeOpen} onClose={() => setUpgradeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold">Upgrade to Provider Profile</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <Typography variant="body2" className="text-gray-500 mb-2">
            Complete the form and provide identification documentation to apply for a verified Service Provider account.
          </Typography>
          <TextField
            fullWidth
            label="Brief Professional Bio"
            multiline
            rows={3}
            placeholder="e.g. Hassan is a certified electrician covering Zone A..."
            value={upgradeBio}
            onChange={(e) => setUpgradeBio(e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone number"
            value={upgradePhone}
            onChange={(e) => setUpgradePhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="Home Address"
            value={upgradeAddress}
            onChange={(e) => setUpgradeAddress(e.target.value)}
          />
          <TextField
            fullWidth
            label="ID Card Proof URL / Image file path"
            placeholder="Paste ID copy link..."
            value={idProof}
            onChange={(e) => setIdProof(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setUpgradeOpen(false)}>Cancel</Button>
          <Button onClick={handleUpgradeSubmit} variant="contained" color="secondary">Submit Upgrade</Button>
        </DialogActions>
      </Dialog>

      {/* AI Enhancer Dialog (Feature 4.1) */}
      <Dialog open={enhancerOpen} onClose={() => setEnhancerOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="font-bold flex items-center gap-2">
          <SmartToyIcon className="text-indigo-650" /> AI Service Listing Description Enhancer
        </DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <Grid container spacing={3}>
            {/* Form Column */}
            <Grid size={{ xs: 12, md: 6 }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:outline-none"
                >
                  <option value="Home Repair">Home Repair</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Pet Care">Pet Care</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rough Description</label>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="e.g. i fix electric plugs in homes, do wires, quick leaks fixing too"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unique Selling Points (USPs)</label>
                <TextField
                  fullWidth
                  placeholder="e.g. 5 yrs exp, free estimate, clean cleanup afterward"
                  value={uspInput}
                  onChange={(e) => setUspInput(e.target.value)}
                />
              </div>

              <Button
                variant="contained"
                fullWidth
                disabled={aiLoading}
                onClick={triggerAIEnhancer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {aiLoading ? "Generating AI Listing..." : "Optimize Listing"}
              </Button>
            </Grid>

            {/* Results Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-slate-50 h-full flex flex-col justify-between">
                <div>
                  <Typography variant="subtitle2" fontWeight="bold" className="text-gray-800 mb-3 border-b pb-2">
                    AI Generated Draft Preview
                  </Typography>

                  {aiEnhancedResult ? (
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <span className="font-bold text-indigo-900 block">Summary:</span>
                        <span>{aiEnhancedResult.summary}</span>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-900 block">What's Included:</span>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiEnhancedResult.included.map((inc: string, i: number) => (
                            <li key={i}>{inc}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-900 block">What to Expect:</span>
                        <span>{aiEnhancedResult.expect}</span>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-900 block">Call to Action:</span>
                        <span className="italic">{aiEnhancedResult.cta}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <SmartToyIcon sx={{ fontSize: 40 }} />
                      <Typography variant="body2" className="mt-2 font-medium">Input listing details and click optimize.</Typography>
                    </div>
                  )}
                </div>

                {aiEnhancedResult && (
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={applyAIEnhanced}
                    className="mt-4 font-bold"
                  >
                    Apply and Use Description
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

