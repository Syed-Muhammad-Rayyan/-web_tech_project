import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import axios from "axios";
import io, { Socket } from "socket.io-client";

// API Base URL
const API_URL = "http://localhost:3000";
axios.defaults.baseURL = API_URL;

// Types
export type UserRole = "Resident" | "Provider" | "Moderator" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zone: string;
  phone?: string;
  address?: string;
  avatar?: string;
  // Provider details
  bio?: string;
  categories?: string[];
  availability?: string;
  coverageRadius?: number;
  verificationStatus?: "None" | "Pending" | "Verified";
  idProofUrl?: string;
  portfolioPhotos?: string[];
  responseRate?: number;
  avgResponseTime?: string;
  providerProfile?: any;
}

export interface Booking {
  id: string;
  residentId: string;
  residentName?: string;
  resident?: User;
  providerId: string;
  providerName?: string;
  provider?: User;
  service: string;
  date: string;
  time: string;
  description: string;
  status: "Sent" | "Accepted" | "Declined" | "In Progress" | "Completed" | "Disputed";
  dispute?: any;
  disputeDetails?: any; // adapter helper
}

export interface Review {
  id: string;
  bookingId: string;
  authorId: string;
  authorName?: string;
  author?: User;
  targetId: string;
  rating: number;
  text: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  recipientId: string;
  recipientName?: string;
  content: string;
  timestamp: string;
  flagged?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  date: string;
  pinned: boolean;
  comments: {
    id: string;
    authorName: string;
    content: string;
    date: string;
  }[];
}

interface StoreState {
  users: User[];
  currentUser: User | null;
  bookings: Booking[];
  reviews: Review[];
  messages: Message[];
  announcements: Announcement[];
  zones: string[];
  socket: Socket | null;
  sentimentProfiles: Record<string, any>;
  
  // Actions
  init: () => Promise<void>;
  login: (email: string, passwordHash: string) => Promise<boolean>;
  signup: (name: string, email: string, zone: string, passwordHash: string) => Promise<boolean>;
  logout: () => void;
  upgradeToProvider: (data: any) => Promise<void>;
  updateProviderProfile: (data: any) => Promise<void>;
  createBooking: (providerId: string, service: string, date: string, time: string, description: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => Promise<void>;
  submitReview: (bookingId: string, rating: number, text: string) => Promise<void>;
  raiseDispute: (bookingId: string, complaint: string, evidence: string) => Promise<void>;
  sendMessage: (recipientId: string, content: string) => Promise<void>;
  assignModerator: (bookingId: string, moderatorId: string) => Promise<void>;
  resolveDispute: (bookingId: string, resolution: string) => Promise<void>;
  approveVerification: (userId: string) => Promise<void>;
  postAnnouncement: (title: string, content: string, pinned: boolean) => Promise<void>;
  postComment: (announcementId: string, content: string) => Promise<void>;
  addZone: (zone: string) => Promise<void>;
  removeZone: (zone: string) => Promise<void>;
  
  // AI Proxy queries (sync / async paths)
  getAIExplanation: (provider: User, query: string) => Promise<string>;
  getAISentimentProfile: (providerId: string) => any;
  getAIDisputeResolution: (booking: Booking) => Promise<any>;
  getAIEnhancedListing: (rawBio: string, category: string, usps: string) => Promise<any>;
  matchProviders: (needText: string, zone: string, timePreference: string) => Promise<any[]>;
}

// Global Socket Instance Reference
let activeSocket: Socket | null = null;

// Setup Socket listeners
const setupSocket = (user: User, set: any, get: any) => {
  if (activeSocket) {
    activeSocket.disconnect();
  }

  const socket = io(API_URL);
  activeSocket = socket;
  set({ socket });

  socket.on("connect", () => {
    socket.emit("join_room", { userId: user.id, role: user.role });
  });

  socket.on("chat_msg", (msg: any) => {
    set((state: any) => {
      if (state.messages.some((m: any) => m.id === msg.id)) return state;
      return { messages: [...state.messages, msg] };
    });
    toast.info(`💬 New message from ${msg.senderName}`);
  });

  socket.on("booking_update", (text: string) => {
    get().init();
    toast.info(`🔔 ${text}`);
  });

  socket.on("new_booking", (text: string) => {
    get().init();
    toast.info(`🔔 ${text}`);
  });

  socket.on("new_dispute", (text: string) => {
    get().init();
    toast.warn(`⚠️ ${text}`);
  });

  socket.on("dispute_resolved", (text: string) => {
    get().init();
    toast.success(`✅ ${text}`);
  });
};

// Flatten backend User & ProviderProfile details into a single root User object
const formatUser = (u: any): User => {
  if (u && u.providerProfile) {
    return {
      ...u,
      ...u.providerProfile,
      id: u.id, // ensure ID is not overwritten
    };
  }
  return u;
};

export const useStore = create<StoreState>((set, get) => ({
  users: [],
  currentUser: null,
  bookings: [],
  reviews: [],
  messages: [],
  announcements: [],
  zones: [],
  socket: null,
  sentimentProfiles: {},

  init: async () => {
    try {
      const token = localStorage.getItem("nh_token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Fetch base state data
      const [usersRes, zonesRes, announcementsRes] = await Promise.all([
        axios.get("/users/all").catch(() => ({ data: [] })),
        axios.get("/zones").catch(() => ({ data: [] })),
        axios.get("/noticeboard").catch(() => ({ data: [] })),
      ]);

      const formattedUsers = usersRes.data.map(formatUser);

      set({
        users: formattedUsers,
        zones: zonesRes.data.map((z: any) => z.name),
        announcements: announcementsRes.data,
      });

      // Background pre-fetch sentiment profiles for providers to allow sync rendering
      const providers = formattedUsers.filter((u: User) => u.role === "Provider");
      const sentimentProfiles: Record<string, any> = {};
      await Promise.all(
        providers.map(async (p: User) => {
          try {
            const res = await axios.get(`/ai/sentiment-profile/${p.id}`);
            sentimentProfiles[p.id] = res.data;
          } catch {
            sentimentProfiles[p.id] = { reliabilityScore: 0, themes: [], complaints: [], summary: "" };
          }
        })
      );
      set({ sentimentProfiles });

      // Fetch user specific data if logged in
      const currentUserStr = localStorage.getItem("nh_current_user");
      if (currentUserStr) {
        const user = formatUser(JSON.parse(currentUserStr));
        set({ currentUser: user });

        if (!activeSocket) {
          setupSocket(user, set, get);
        }

        const [bookingsRes, disputesRes, messagesPartnersRes] = await Promise.all([
          axios.get("/bookings/my").catch(() => ({ data: [] })),
          (user.role === "Moderator" || user.role === "Admin")
            ? axios.get("/bookings/disputes").catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
          axios.get("/messages/partners").catch(() => ({ data: [] })),
        ]);

        let bookingsData = [...bookingsRes.data];
        if (user.role === "Moderator" || user.role === "Admin") {
          const adaptedDisputes = disputesRes.data.map((d: any) => {
            const b = d.booking;
            return {
              ...b,
              dispute: d,
            };
          });
          const existingIds = new Set(bookingsData.map((b) => b.id));
          adaptedDisputes.forEach((b: any) => {
            if (b && !existingIds.has(b.id)) {
              bookingsData.push(b);
            }
          });
        }

        const adaptedBookings = bookingsData.map((b: any) => ({
          ...b,
          residentName: b.resident?.name,
          providerName: b.provider?.name,
          disputeDetails: b.dispute ? {
            raisedBy: b.dispute.raisedBy,
            complaint: b.dispute.complaint,
            evidence: b.dispute.evidence,
            moderatorId: b.dispute.moderatorId,
            aiSuggestedResolution: b.dispute.aiSuggestedResolution,
            resolvedAt: b.dispute.resolvedAt,
            resolution: b.dispute.resolution,
          } : null
        }));

        set({ bookings: adaptedBookings });

        // Load chat history
        let allMessages: Message[] = [];
        for (const partner of messagesPartnersRes.data) {
          const thread = await axios.get(`/messages/thread/${partner.id}`).catch(() => ({ data: [] }));
          allMessages = [...allMessages, ...thread.data];
        }
        set({ messages: allMessages });
      }
    } catch (err: any) {
      console.error("Store initialization failed", err);
    }
  },

  login: async (email: string, passwordHash: string) => {
    try {
      const res = await axios.post("/auth/login", {
        email,
        passwordHash,
      });

      const { accessToken, user } = res.data;
      const formattedUser = formatUser(user);
      localStorage.setItem("nh_token", accessToken);
      localStorage.setItem("nh_current_user", JSON.stringify(formattedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      set({ currentUser: formattedUser });
      setupSocket(formattedUser, set, get);
      await get().init();
      
      toast.success(`Logged in as ${formattedUser.name} (${formattedUser.role})`);
      return true;
    } catch (err: any) {
      toast.error("User not found or login failed!");
      return false;
    }
  },

  signup: async (name: string, email: string, zone: string, passwordHash: string) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        passwordHash,
        zone,
      });

      const { accessToken, user } = res.data;
      const formattedUser = formatUser(user);
      localStorage.setItem("nh_token", accessToken);
      localStorage.setItem("nh_current_user", JSON.stringify(formattedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      set({ currentUser: formattedUser });
      setupSocket(formattedUser, set, get);
      await get().init();

      toast.success("Account created successfully!");
      return true;
    } catch (err: any) {
      toast.error("Email already registered or registration failed!");
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("nh_token");
    localStorage.removeItem("nh_current_user");
    delete axios.defaults.headers.common["Authorization"];
    
    if (activeSocket) {
      activeSocket.disconnect();
      activeSocket = null;
    }

    set({
      currentUser: null,
      bookings: [],
      messages: [],
      socket: null,
    });
    toast.info("Logged out.");
  },

  upgradeToProvider: async (data: any) => {
    try {
      const res = await axios.post("/users/upgrade", data);
      const { user } = res.data;
      const formattedUser = formatUser(user);
      localStorage.setItem("nh_current_user", JSON.stringify(formattedUser));
      set({ currentUser: formattedUser });
      await get().init();
      toast.success("Completed upgrade request! Sent to Admin for ID verification.");
    } catch (err: any) {
      toast.error("Failed to upgrade provider profile");
    }
  },

  updateProviderProfile: async (data: any) => {
    try {
      await axios.patch("/users/provider-profile", data);
      await get().init();
      toast.success("Profile details updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update profile details");
    }
  },

  createBooking: async (providerId: string, service: string, date: string, time: string, description: string) => {
    try {
      await axios.post("/bookings", { providerId, service, date, time, description });
      await get().init();
      toast.success("Booking request sent to provider!");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to create booking";
      toast.error(errMsg);
    }
  },

  updateBookingStatus: async (bookingId: string, status: Booking["status"]) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      await get().init();
      toast.info(`Booking status updated to ${status}`);
    } catch (err: any) {
      toast.error("Failed to update booking status");
    }
  },

  submitReview: async (bookingId: string, rating: number, text: string) => {
    try {
      await axios.post("/reviews", { bookingId, rating, text });
      await get().init();
      toast.success("Review submitted successfully!");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to submit review";
      toast.error(errMsg);
    }
  },

  raiseDispute: async (bookingId: string, complaint: string, evidence: string) => {
    try {
      await axios.post(`/bookings/${bookingId}/dispute`, { complaint, evidence });
      await get().init();
      toast.warn("Dispute raised. A moderator will review it shortly.");
    } catch (err: any) {
      toast.error("Failed to raise dispute");
    }
  },

  sendMessage: async (recipientId: string, content: string) => {
    try {
      const res = await axios.post("/messages", { recipientId, content });
      const newMsg = res.data;
      
      if (newMsg.flagged) {
        toast.warning("Message flagged: Please do not exchange external payment info or use offensive language.");
      }

      set((state: any) => ({
        messages: [...state.messages, newMsg],
      }));
    } catch (err: any) {
      toast.error("Failed to send message");
    }
  },

  assignModerator: async (bookingId: string, _moderatorId: string) => {
    try {
      await axios.post(`/bookings/${bookingId}/assign-moderator`);
      await get().init();
      toast.success("Dispute assigned to you.");
    } catch (err: any) {
      toast.error("Failed to assign dispute");
    }
  },

  resolveDispute: async (bookingId: string, resolution: string) => {
    try {
      await axios.post(`/bookings/${bookingId}/resolve-dispute`, { resolution });
      await get().init();
      toast.success("Dispute officially resolved.");
    } catch (err: any) {
      toast.error("Failed to resolve dispute");
    }
  },

  approveVerification: async (userId: string) => {
    try {
      await axios.post(`/users/providers/${userId}/verify`);
      await get().init();
      toast.success("Verification approved!");
    } catch (err: any) {
      toast.error("Failed to approve verification");
    }
  },

  postAnnouncement: async (title: string, content: string, pinned: boolean) => {
    try {
      await axios.post("/noticeboard", { title, content, pinned });
      await get().init();
      toast.success("Community announcement posted.");
    } catch (err: any) {
      toast.error("Failed to post announcement");
    }
  },

  postComment: async (announcementId: string, content: string) => {
    try {
      await axios.post(`/noticeboard/${announcementId}/comments`, { content });
      await get().init();
      toast.success("Comment added.");
    } catch (err: any) {
      toast.error("Failed to add comment");
    }
  },

  addZone: async (zone: string) => {
    try {
      await axios.post("/zones", { name: zone });
      await get().init();
      toast.success(`New zone '${zone}' configured.`);
    } catch (err: any) {
      toast.error("Failed to configure zone");
    }
  },

  removeZone: async (zone: string) => {
    try {
      await axios.delete(`/zones/${zone}`);
      await get().init();
      toast.info(`Zone '${zone}' removed.`);
    } catch (err: any) {
      toast.error("Failed to remove zone");
    }
  },

  // AI Integrations calls to AI Proxy
  getAIExplanation: async (provider: User, query: string): Promise<string> => {
    try {
      const res = await axios.post("/ai/match-providers", {
        needText: query,
        zone: provider.zone,
        timePreference: provider.availability || "Anytime",
      });
      const match = res.data.find((m: any) => m.provider.id === provider.id);
      return match ? match.matchExplanation : `${provider.name} is a local provider in ${provider.zone}.`;
    } catch {
      return `${provider.name} covers your neighborhood and is ready to assist.`;
    }
  },

  // Synchronous lookup from local pre-fetched map
  getAISentimentProfile: (providerId: string): any => {
    const profiles = get().sentimentProfiles;
    return profiles[providerId] || {
      reliabilityScore: 0,
      themes: [],
      complaints: [],
      summary: "",
    };
  },

  getAIDisputeResolution: async (booking: Booking): Promise<any> => {
    try {
      const res = await axios.post(`/ai/dispute-resolution/${booking.id}`);
      return res.data;
    } catch {
      return {
        claimsSummary: `Claims details for dispute.`,
        contradictions: "No contradiction detected in degraded mode.",
        recommendation: "Partial Refund (50%)",
        rationale: "Default resolution rule applied.",
      };
    }
  },

  getAIEnhancedListing: async (rawBio: string, category: string, usps: string): Promise<any> => {
    try {
      const res = await axios.post("/ai/enhance-listing", { rawBio, category, usps });
      return res.data;
    } catch {
      return {
        summary: `Professional ${category} listing.`,
        included: ["Standard service diagnostics & repair work"],
        expect: "Expect direct neighborhood support.",
        cta: "Book today!",
      };
    }
  },

  matchProviders: async (needText: string, zone: string, timePreference: string): Promise<any[]> => {
    try {
      const res = await axios.post("/ai/match-providers", { needText, zone, timePreference });
      return res.data;
    } catch {
      return [];
    }
  },
}));

export const MockStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const init = useStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
};

export const useMockState = () => {
  const store = useStore();
  return store;
};
