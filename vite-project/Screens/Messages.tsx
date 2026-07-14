import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Badge
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useMockState } from "../src/mockState";

export const Messages: React.FC = () => {
  const { messages, users, currentUser, sendMessage } = useMockState();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get list of unique users the current user has chatted with, or list of providers/residents available to message
  const userHasChatHistoryWith = new Set(
    messages
      .filter((m) => m.senderId === currentUser?.id || m.recipientId === currentUser?.id)
      .map((m) => (m.senderId === currentUser?.id ? m.recipientId : m.senderId))
  );

  const chatPartners = users.filter(
    (u) =>
      u.id !== currentUser?.id &&
      (u.role === "Provider" || u.role === "Resident" || userHasChatHistoryWith.has(u.id))
  );

  useEffect(() => {
    if (chatPartners.length > 0 && !selectedUser) {
      setSelectedUser(chatPartners[0].id);
    }
  }, [chatPartners, selectedUser]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  const activePartner = users.find((u) => u.id === selectedUser);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !inputText.trim()) return;
    sendMessage(selectedUser, inputText);
    setInputText("");
  };

  // Filter messages for current thread
  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.recipientId === selectedUser) ||
      (m.senderId === selectedUser && m.recipientId === currentUser?.id)
  );

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-50 py-10">
        <Container maxWidth="lg">
          <Card className="border border-gray-200 rounded-3xl overflow-hidden shadow-lg h-[650px]">
            <Grid container className="h-full">
              {/* Left Column: Chat Partners List */}
              <Grid size={{ xs: 12, md: 4 }} className="border-r border-gray-250 bg-white h-full overflow-y-auto">
                <div className="p-4 bg-indigo-50/50">
                  <Typography variant="h6" fontWeight="bold" className="text-gray-800">
                    Conversations
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Connected via WebSocket Gateway
                  </Typography>
                </div>
                <Divider />
                <div className="divide-y divide-gray-100">
                  {chatPartners.map((partner) => {
                    const lastMsg = messages
                      .filter(
                        (m) =>
                          (m.senderId === currentUser?.id && m.recipientId === partner.id) ||
                          (m.senderId === partner.id && m.recipientId === currentUser?.id)
                      )
                      .slice(-1)[0];

                    return (
                      <div
                        key={partner.id}
                        onClick={() => setSelectedUser(partner.id)}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-all ${
                          selectedUser === partner.id ? "bg-indigo-50/50 border-l-4 border-indigo-650" : ""
                        }`}
                      >
                        <Avatar className="bg-indigo-600 text-white font-bold">
                          {partner.avatar || partner.name[0]}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <Typography variant="subtitle2" fontWeight="bold" noWrap className="text-gray-800">
                              {partner.name}
                            </Typography>
                            {partner.role === "Provider" && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                                {partner.role}
                              </span>
                            )}
                          </div>
                          <Typography variant="caption" color="text.secondary" noWrap className="block">
                            {lastMsg ? lastMsg.content : "No messages yet"}
                          </Typography>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Grid>

              {/* Right Column: Active Thread chatbox */}
              <Grid size={{ xs: 12, md: 8 }} className="flex flex-col bg-slate-50 h-full">
                {activePartner ? (
                  <>
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-indigo-600 text-white font-bold">
                          {activePartner.avatar || activePartner.name[0]}
                        </Avatar>
                        <div>
                          <Typography variant="subtitle1" fontWeight="bold" className="text-gray-800">
                            {activePartner.name}
                          </Typography>
                          <Typography variant="caption" className="text-green-600 font-medium">
                            🟢 Online (WebSocket Active)
                          </Typography>
                        </div>
                      </div>
                      <div className="text-right">
                        <Typography variant="caption" className="block text-gray-400 font-semibold">
                          Avg. response time: {activePartner.avgResponseTime || "N/A"}
                        </Typography>
                        <Typography variant="caption" className="block text-gray-400 font-semibold">
                          Response rate: {activePartner.responseRate || 100}%
                        </Typography>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {threadMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <ChatBubbleOutlineRoundedIcon className="text-5xl mb-2" />
                          <Typography>Send a message to start the conversation.</Typography>
                        </div>
                      ) : (
                        threadMessages.map((msg) => {
                          const isOwn = msg.senderId === currentUser?.id;
                          return (
                            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[70%] rounded-2xl p-4 shadow-sm relative ${
                                  isOwn
                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                    : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                                }`}
                              >
                                <Typography variant="body2" className="leading-relaxed whitespace-pre-wrap">
                                  {msg.content}
                                </Typography>
                                <div
                                  className={`text-[9px] mt-1 text-right ${
                                    isOwn ? "text-indigo-250" : "text-gray-400"
                                  }`}
                                >
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </div>

                                {msg.flagged && (
                                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 border border-red-200 rounded-lg p-1.5">
                                    <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
                                    <span>Flagged by System filter</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                      <TextField
                        fullWidth
                        size="medium"
                        placeholder="Type your message here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="bg-white"
                        InputProps={{
                          sx: { borderRadius: "14px" }
                        }}
                      />
                      <IconButton
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 w-12"
                      >
                        <SendIcon />
                      </IconButton>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ChatBubbleOutlineRoundedIcon className="text-6xl mb-3" />
                    <Typography>Select a contact to begin chatting.</Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
