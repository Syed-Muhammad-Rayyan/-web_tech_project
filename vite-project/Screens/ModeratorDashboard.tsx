import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
  Chip,
  Avatar,
  Tab,
  Tabs
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import WarningIcon from "@mui/icons-material/Warning";
import ForumIcon from "@mui/icons-material/Forum";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useMockState } from "../src/mockState";

export const ModeratorDashboard: React.FC = () => {
  const { bookings, currentUser, assignModerator, resolveDispute, getAIDisputeResolution, messages } = useMockState();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // AI assistant simulation outputs
  const [aiReport, setAiReport] = useState<{
    claimsSummary: string;
    contradictions: string;
    recommendation: string;
    rationale: string;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const disputes = bookings.filter((b) => b.status === "Disputed");
  const assignedDisputes = disputes.filter((d) => d.disputeDetails?.moderatorId === currentUser?.id);
  const unassignedDisputes = disputes.filter((d) => !d.disputeDetails?.moderatorId);

  const selectedBooking = bookings.find((b) => b.id === selectedDisputeId);

  const handleAssign = (bookingId: string) => {
    if (!currentUser) return;
    assignModerator(bookingId, currentUser.id);
  };

  const handleResolve = (bookingId: string, choice: string) => {
    resolveDispute(bookingId, choice);
    setSelectedDisputeId(null);
    setAiReport(null);
  };

  const triggerAIResolution = async (booking: any) => {
    setAiLoading(true);
    setAiReport(null);
    try {
      const result = await getAIDisputeResolution(booking);
      setAiReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Find messages of the disputing parties
  const chatLogs = selectedBooking
    ? messages.filter(
        (m) =>
          (m.senderId === selectedBooking.residentId && m.recipientId === selectedBooking.providerId) ||
          (m.senderId === selectedBooking.providerId && m.recipientId === selectedBooking.residentId)
      )
    : [];

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-50 py-10">
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="tracking-tight text-gray-800 flex items-center gap-3">
            <SecurityIcon fontSize="large" className="text-indigo-650" /> Moderator Dispute Center
          </Typography>
          <Typography color="text.secondary" className="mb-8">
            Assigned to review consumer disputes, inspect evidence logs, consult AI policy recommendations, and resolve complaints.
          </Typography>

          <Grid container spacing={4}>
            {/* Left Side: List of Disputes */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card className="border border-gray-200 rounded-2xl shadow-sm mb-6 bg-white">
                <Box className="border-b border-gray-100">
                  <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary" variant="fullWidth">
                    <Tab label={`My Cases (${assignedDisputes.length})`} />
                    <Tab label={`Unassigned (${unassignedDisputes.length})`} />
                  </Tabs>
                </Box>
                <CardContent className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                  const list = activeTab === 0 ? assignedDisputes : unassignedDisputes;
                  { (activeTab === 0 ? assignedDisputes : unassignedDisputes).length === 0 ? (
                    <Typography align="center" color="text.secondary" className="py-10">
                      No dispute cases here.
                    </Typography>
                  ) : (
                    (activeTab === 0 ? assignedDisputes : unassignedDisputes).map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedDisputeId(b.id);
                          setAiReport(null);
                        }}
                        className={`p-4 border rounded-xl cursor-pointer hover:bg-indigo-50/20 transition-all ${
                          selectedDisputeId === b.id ? "border-indigo-600 bg-indigo-50/30" : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Typography fontWeight="bold" className="text-gray-800">
                            {b.service}
                          </Typography>
                          <Chip label="Disputed" color="error" size="small" />
                        </div>
                        <Typography variant="body2" color="text.secondary" className="mb-2">
                          Neighbour: {b.residentName} | Provider: {b.providerName}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400 block">
                          Date: {b.date}
                        </Typography>

                        {activeTab === 1 && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AssignmentIndIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssign(b.id);
                            }}
                            className="mt-3"
                          >
                            Assign to me
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Side: Case Details & AI assistant */}
            <Grid size={{ xs: 12, md: 7 }}>
              {selectedBooking ? (
                <Card className="border border-gray-200 rounded-2xl shadow-md bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                          Case File: {selectedBooking.service}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          Transaction ID: {selectedBooking.id}
                        </Typography>
                      </div>
                      <Chip label="Mediation Stage" color="warning" />
                    </div>

                    <Grid container spacing={2} className="mb-6">
                      <Grid size={6}>
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <Typography variant="caption" className="text-gray-400 block font-bold">RESIDENT</Typography>
                          <Typography fontWeight="semibold">{selectedBooking.residentName}</Typography>
                        </div>
                      </Grid>
                      <Grid size={6}>
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <Typography variant="caption" className="text-gray-400 block font-bold">PROVIDER</Typography>
                          <Typography fontWeight="semibold">{selectedBooking.providerName}</Typography>
                        </div>
                      </Grid>
                    </Grid>

                    <div className="mb-6">
                      <Typography variant="subtitle2" fontWeight="bold" className="text-gray-800 flex items-center gap-1">
                        <WarningIcon className="text-red-500" sx={{ fontSize: 16 }} /> Dispute Claims:
                      </Typography>
                      <Typography className="text-gray-600 bg-red-50/50 p-4 rounded-xl border border-red-100 mt-2">
                        {selectedBooking.disputeDetails?.complaint}
                      </Typography>
                    </div>

                    <div className="mb-6">
                      <Typography variant="subtitle2" fontWeight="bold" className="text-gray-800">
                        Evidence Submitted:
                      </Typography>
                      <Typography variant="body2" className="text-gray-650 bg-gray-50 p-3 rounded-xl mt-2 italic">
                        "{selectedBooking.disputeDetails?.evidence || "No evidence description submitted."}"
                      </Typography>
                    </div>

                    {/* Chat log inspector */}
                    <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-100 p-3 flex items-center gap-2">
                        <ForumIcon className="text-indigo-600" sx={{ fontSize: 16 }} />
                        <Typography variant="subtitle2" fontWeight="bold" className="text-gray-700">
                          Disputed Message History Logs
                        </Typography>
                      </div>
                      <div className="p-4 max-h-[150px] overflow-y-auto space-y-2 bg-slate-50 text-xs">
                        {chatLogs.length === 0 ? (
                          <Typography color="text.secondary" align="center">No messages logged between parties.</Typography>
                        ) : (
                          chatLogs.map((m) => (
                            <div key={m.id}>
                              <span className="font-bold text-gray-700">{m.senderName}: </span>
                              <span className="text-gray-600">{m.content}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* AI Dispute Mediator Assistant (Feature 4.4) */}
                    <Box className="border border-indigo-200 bg-indigo-50/20 rounded-2xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="subtitle2" fontWeight="bold" className="text-indigo-900 flex items-center gap-2">
                          <SmartToyIcon className="text-indigo-650" /> Dispute Mediator AI Assistant
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          className="bg-indigo-600 hover:bg-indigo-700"
                          disabled={aiLoading}
                          onClick={() => triggerAIResolution(selectedBooking)}
                        >
                          {aiLoading ? "Analyzing..." : "Analyze Case"}
                        </Button>
                      </div>

                      {aiReport && (
                        <div className="space-y-3 text-sm bg-white p-4 rounded-xl border border-indigo-100 shadow-inner">
                          <div>
                            <span className="font-bold text-indigo-950 block">Claims Analysis:</span>
                            <span className="text-gray-600">{aiReport.claimsSummary}</span>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-950 block">Contradictions identified:</span>
                            <span className="text-gray-600">{aiReport.contradictions}</span>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-950 block">Suggested Resolution Action:</span>
                            <span className="text-emerald-700 font-extrabold">{aiReport.recommendation}</span>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-950 block">Policy Rationale:</span>
                            <span className="text-gray-600 italic">"{aiReport.rationale}"</span>
                          </div>
                        </div>
                      )}
                    </Box>

                    {/* Resolution Action */}
                    {selectedBooking.disputeDetails?.moderatorId === currentUser?.id ? (
                      <div className="pt-4 border-t border-gray-100">
                        <Typography variant="subtitle2" fontWeight="bold" className="text-gray-800 mb-3">
                          Determine Final Resolution
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleResolve(selectedBooking.id, "100% Payout to Provider")}
                          >
                            No Action (Pay Provider)
                          </Button>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => handleResolve(selectedBooking.id, "50% Partial Refund")}
                          >
                            50% Partial Refund
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleResolve(selectedBooking.id, "100% Full Refund")}
                          >
                            100% Full Refund
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Typography variant="caption" className="text-gray-400 block italic">
                        Assign this case to yourself to render a resolution decision.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-gray-200 border-dashed rounded-2xl py-20 flex flex-col items-center justify-center bg-white text-gray-400">
                  <GavelIcon sx={{ fontSize: 60 }} className="mb-2" />
                  <Typography>Select a dispute case from the sidebar to inspect case logs.</Typography>
                </Card>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
