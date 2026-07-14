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
import PushPinIcon from "@mui/icons-material/PushPin";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useMockState } from "../src/mockState";

export const Noticeboard: React.FC = () => {
  const { announcements, currentUser, postAnnouncement, postComment } = useMockState();
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  
  // New Announcement Form State (Moderators/Admins only)
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const canPost = currentUser?.role === "Moderator" || currentUser?.role === "Admin";

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    postAnnouncement(newTitle, newContent, isPinned);
    setNewTitle("");
    setNewContent("");
    setIsPinned(false);
  };

  const handleAddComment = (annId: string) => {
    const text = commentInputs[annId];
    if (!text || !text.trim()) return;
    postComment(annId, text);
    setCommentInputs(prev => ({ ...prev, [annId]: "" }));
  };

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-50 py-10">
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" gutterBottom className="tracking-tight text-gray-800">
            Community Noticeboard
          </Typography>
          <Typography color="text.secondary" className="mb-8">
            Stay updated with official announcements, news, and upcoming neighborhood events.
          </Typography>

          <Grid container spacing={4}>
            {/* Left/Main Column - Announcements List */}
            <Grid size={{ xs: 12, md: canPost ? 8 : 12 }}>
              <div className="space-y-6">
                {announcements.map((ann) => (
                  <Card
                    key={ann.id}
                    className={`border transition-all duration-300 ${
                      ann.pinned
                        ? "border-indigo-400 bg-indigo-50/30 shadow-md shadow-indigo-100"
                        : "border-gray-200 bg-white"
                    } rounded-2xl`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="bg-indigo-100 text-indigo-700">
                            <AnnouncementIcon />
                          </Avatar>
                          <div>
                            <Typography variant="h6" fontWeight="bold" className="text-gray-800">
                              {ann.title}
                            </Typography>
                            <Typography variant="caption" className="text-gray-400">
                              Posted by {ann.authorName} on {ann.date}
                            </Typography>
                          </div>
                        </div>

                        {ann.pinned && (
                          <Chip
                            icon={<PushPinIcon className="text-indigo-600" />}
                            label="Pinned Announcement"
                            className="bg-indigo-100/70 text-indigo-800 font-bold"
                            size="small"
                          />
                        )}
                      </div>

                      <Typography className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">
                        {ann.content}
                      </Typography>

                      <Divider className="my-4" />

                      {/* Comments Section */}
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold" className="text-gray-700 mb-3">
                          Comments ({ann.comments.length})
                        </Typography>

                        <div className="space-y-3 mb-4">
                          {ann.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-150/60 p-3 rounded-xl">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span className="font-bold text-gray-700">{comment.authorName}</span>
                                <span>{comment.date}</span>
                              </div>
                              <Typography variant="body2" className="text-gray-650">
                                {comment.content}
                              </Typography>
                            </div>
                          ))}
                        </div>

                        {currentUser && (
                          <div className="flex gap-2">
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Write a comment..."
                              value={commentInputs[ann.id] || ""}
                              onChange={(e) =>
                                setCommentInputs(prev => ({ ...prev, [ann.id]: e.target.value }))
                              }
                              className="bg-white"
                            />
                            <Button
                              variant="contained"
                              className="bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleAddComment(ann.id)}
                            >
                              <AddCommentIcon />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Grid>

            {/* Right Column - Post announcement form (Moderators/Admins only) */}
            {canPost && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Card className="border border-gray-200 rounded-2xl sticky top-24 shadow-sm">
                  <CardContent className="p-6">
                    <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-4">
                      Create Announcement
                    </Typography>

                    <form onSubmit={handlePostAnnouncement} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="e.g. Area Clean-up Drive"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Content</label>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          placeholder="Write your announcement message here..."
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pin-chk"
                          checked={isPinned}
                          onChange={(e) => setIsPinned(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 accent-indigo-600 rounded"
                        />
                        <label htmlFor="pin-chk" className="text-sm font-semibold text-gray-600">
                          Pin to top of noticeboard
                        </label>
                      </div>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-500/10"
                      >
                        Publish Notice
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
