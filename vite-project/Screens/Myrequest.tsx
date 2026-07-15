import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Rating
} from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useMockState } from "../src/mockState";
import { toast } from "react-toastify";

const getChipColor = (status: string) => {
  switch (status) {
    case "Sent":
      return "primary";
    case "Accepted":
      return "info";
    case "In Progress":
      return "warning";
    case "Completed":
      return "success";
    case "Declined":
    case "Disputed":
      return "error";
    default:
      return "default";
  }
};

export const MyRequests: React.FC = () => {
  const { bookings, currentUser, updateBookingStatus, submitReview, raiseDispute } = useMockState();
  const [searchTerm, setSearchTerm] = useState("");

  // Review Modal state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(5);
  const [reviewText, setReviewText] = useState("");

  // Dispute Modal state
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeComplaint, setDisputeComplaint] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");

  // Filter based on user role (Resident vs Provider)
  const myBookings = bookings.filter((b) => {
    if (currentUser?.role === "Provider") {
      return b.providerId === currentUser.id;
    }
    return b.residentId === currentUser?.id;
  });

  const filteredBookings = myBookings.filter((b) =>
    b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.residentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenReview = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setReviewOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedBookingId || !rating) return;
    submitReview(selectedBookingId, rating, reviewText);
    setReviewOpen(false);
    setReviewText("");
  };

  const handleOpenDispute = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setDisputeOpen(true);
  };

  const handleDisputeSubmit = () => {
    if (!selectedBookingId || !disputeComplaint.trim()) {
      toast.error("Please fill in the complaint description.");
      return;
    }
    raiseDispute(selectedBookingId, disputeComplaint, disputeEvidence);
    setDisputeOpen(false);
    setDisputeComplaint("");
    setDisputeEvidence("");
  };

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-100 py-10">
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold">
            {currentUser?.role === "Provider" ? "Work Orders" : "My Requests"}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {currentUser?.role === "Provider"
              ? "Accept jobs, mark progress, and manage neighborhood requests."
              : "Track all your service requests and review your bookings."}
          </Typography>

          <TextField
            fullWidth
            placeholder="Search request by provider, resident, or service name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
            sx={{
              mb: 5,
              backgroundColor: "white",
            }}
          />

          <Grid container spacing={3}>
            {filteredBookings.length === 0 ? (
              <Grid size={12}>
                <Card className="p-8 text-center border">
                  <Typography color="text.secondary">No request history found.</Typography>
                </Card>
              </Grid>
            ) : (
              filteredBookings.map((request) => (
                <Grid size={12} key={request.id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      transition: ".3s",
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                          {request.service}
                        </Typography>

                        <Chip
                          label={request.status}
                          color={getChipColor(request.status)}
                          className="font-bold"
                        />
                      </div>

                      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                        {currentUser?.role === "Provider" ? "Client" : "Provider"}:{" "}
                        <span className="font-semibold text-gray-700">
                          {currentUser?.role === "Provider" ? request.residentName : request.providerName}
                        </span>{" "}
                        | Date: {request.date} at {request.time}
                      </Typography>

                      <Typography className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed mb-4">
                        "{request.description}"
                      </Typography>

                      {/* Dispute logs if status is completed and disputed details exist */}
                      {((request.status === "Disputed" || (request.status === "Completed" && request.disputeDetails?.resolution)) && request.disputeDetails) && (
                        <div className="bg-red-50/50 p-3 rounded-xl border border-red-150 mb-4 text-xs">
                          <span className="font-bold text-red-900 block mb-1">
                            {request.disputeDetails.resolution 
                              ? "DISPUTE STATUS: Resolved by Moderator" 
                              : "DISPUTE STATUS: Under Moderator Review"}
                          </span>
                          <span className="text-gray-650">{request.disputeDetails.complaint}</span>
                          {request.disputeDetails.resolution && (
                            <div className="mt-2 pt-2 border-t border-red-200">
                              <span className="font-bold text-green-800 block">RESOLUTION DECISION:</span>
                              <span className="text-green-900 font-semibold">{request.disputeDetails.resolution}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Request actions depending on role and status */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {/* Provider Actions */}
                        {currentUser?.role === "Provider" && request.status === "Sent" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => updateBookingStatus(request.id, "Accepted")}
                            >
                              Accept Order
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => updateBookingStatus(request.id, "Declined")}
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {currentUser?.role === "Provider" && request.status === "Accepted" && (
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => updateBookingStatus(request.id, "In Progress")}
                          >
                            Start Work
                          </Button>
                        )}

                        {currentUser?.role === "Provider" && request.status === "In Progress" && (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => updateBookingStatus(request.id, "Completed")}
                          >
                            Mark Completed
                          </Button>
                        )}

                        {/* Resident Actions */}
                        {currentUser?.role === "Resident" && request.status === "Sent" && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => updateBookingStatus(request.id, "Declined")}
                          >
                            Cancel Request
                          </Button>
                        )}

                        {currentUser?.role === "Resident" && request.status === "In Progress" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => updateBookingStatus(request.id, "Completed")}
                            >
                              Confirm Completed
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleOpenDispute(request.id)}
                            >
                              Dispute Job
                            </Button>
                          </>
                        )}

                        {request.status === "Completed" && (
                          <div className="flex gap-2">
                            <Button
                              variant="contained"
                              className="bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleOpenReview(request.id)}
                            >
                              Leave Feedback Review
                            </Button>
                            {currentUser?.role === "Resident" && (
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleOpenDispute(request.id)}
                              >
                                Dispute Job
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold">Leave Service Review</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div>
            <Typography variant="body2" className="text-gray-400 font-bold mb-2">Service Quality Rating</Typography>
            <Rating
              value={rating}
              onChange={(_, val) => setRating(val)}
              size="large"
            />
          </div>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Write feedback comment description..."
            placeholder="Help other neighbors by reviewing this provider..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button onClick={handleReviewSubmit} variant="contained" className="bg-indigo-600 hover:bg-indigo-700">Submit Review</Button>
        </DialogActions>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={disputeOpen} onClose={() => setDisputeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold">Open Resolution Dispute Case</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <Typography variant="body2" className="text-gray-500 mb-2">
            Describe the problem or why the service failed. Provide details to help the moderator make a fair resolution suggested decision.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe your complaint statement"
            placeholder="e.g. Work is unfinished and provider left..."
            value={disputeComplaint}
            onChange={(e) => setDisputeComplaint(e.target.value)}
          />
          <TextField
            fullWidth
            label="Evidence Description / Image Upload link description"
            placeholder="e.g. Photo proof of leakage water on floor..."
            value={disputeEvidence}
            onChange={(e) => setDisputeEvidence(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setDisputeOpen(false)}>Cancel</Button>
          <Button onClick={handleDisputeSubmit} variant="contained" color="error">Open Dispute</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

