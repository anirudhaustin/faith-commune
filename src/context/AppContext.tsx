import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  ConcertTicket,
  RealTalkQuestion,
  MentorshipRequest,
  CommunityMember,
  ToastNotification,
  QuestionTopic
} from '../types';
import { CONCERT_DETAILS, INITIAL_TICKETS, INITIAL_QUESTIONS } from '../data/mockData';
import { opsDb } from '../services/db';
import confetti from 'canvas-confetti';

interface AppContextType {
  activePage: PageId;
  navigateTo: (page: PageId) => void;
  // Concert State
  tickets: ConcertTicket[];
  totalSpots: number;
  claimedSpots: number;
  recentTicket: ConcertTicket | null;
  isRegisterModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
  isPassModalOpen: boolean;
  setPassModalOpen: (open: boolean) => void;
  isGateModalOpen: boolean;
  setGateModalOpen: (open: boolean) => void;
  registerConcert: (data: {
    name: string;
    email: string;
    phone: string;
    ageGroup: string;
    denomination: string;
    passCount: number;
    isVolunteerOptIn?: boolean;
  }) => ConcertTicket;
  toggleCheckIn: (ticketId: string) => boolean;
  setViewingTicket: (ticket: ConcertTicket) => void;
  // Real Talk Q&A
  questions: RealTalkQuestion[];
  submitQuestion: (question: string, topic: QuestionTopic) => void;
  upvoteQuestion: (questionId: string) => void;
  // Mentorship
  mentorships: MentorshipRequest[];
  submitMentorship: (data: Omit<MentorshipRequest, 'id' | 'timestamp'>) => void;
  // Community Registry
  communityMembers: CommunityMember[];
  joinCommunity: (data: Omit<CommunityMember, 'id' | 'joinedAt'>) => void;
  // Toast notifications
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  exportAttendeesCSV: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_TICKETS = 'faith_commune_tickets_v1';
const LOCAL_STORAGE_KEY_QUESTIONS = 'faith_commune_questions_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isPassModalOpen, setPassModalOpen] = useState(false);
  const [isGateModalOpen, setGateModalOpen] = useState(false);
  const [recentTicket, setRecentTicket] = useState<ConcertTicket | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Tickets state
  const [tickets, setTickets] = useState<ConcertTicket[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  // Questions state
  const [questions, setQuestions] = useState<RealTalkQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  // Mentorship state
  const [mentorships, setMentorships] = useState<MentorshipRequest[]>([]);
  // Community members
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);

  // Save tickets
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to save tickets to localStorage', e);
    }
  }, [tickets]);

  // Save questions
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save questions to localStorage', e);
    }
  }, [questions]);

  // Toast helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate live claimed spots (initial + delta from created tickets)
  const userAddedPasses = tickets
    .filter((t) => !INITIAL_TICKETS.some((init) => init.ticketId === t.ticketId))
    .reduce((acc, curr) => acc + curr.passCount, 0);

  const claimedSpots = Math.min(
    CONCERT_DETAILS.totalCapacity,
    CONCERT_DETAILS.initialClaimed + userAddedPasses
  );

  const registerConcert = (data: {
    name: string;
    email: string;
    phone: string;
    ageGroup: string;
    denomination: string;
    passCount: number;
    isVolunteerOptIn?: boolean;
  }): ConcertTicket => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicket: ConcertTicket = {
      ticketId: `FC-W26-${randomSuffix}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      ageGroup: data.ageGroup,
      denomination: data.denomination,
      passCount: data.passCount,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      checkedIn: false,
      isVolunteerOptIn: data.isVolunteerOptIn || false
    };

    setTickets((prev) => [newTicket, ...prev]);
    setRecentTicket(newTicket);
    setRegisterModalOpen(false);
    setPassModalOpen(true);

    // Sync into Event Operations Command Database
    opsDb.registerAttendee({
      ticketId: newTicket.ticketId,
      name: newTicket.name,
      email: newTicket.email,
      phone: newTicket.phone,
      ageGroup: newTicket.ageGroup,
      denomination: newTicket.denomination,
      passCount: newTicket.passCount,
      isVolunteerOptIn: newTicket.isVolunteerOptIn,
      interests: ['worship-music', 'youth-gathering']
    }).catch((e) => console.warn('Failed to sync ticket to opsDb', e));

    // Fire celebration confetti!
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#a855f7', '#06b6d4', '#f43f5e']
    });

    showToast(
      'Pass Confirmed! 🎉',
      `Welcome to Faith Commune Concert, ${data.name}! Your Digital Pass is ready.`,
      'success'
    );

    return newTicket;
  };

  const setViewingTicket = (ticket: ConcertTicket) => {
    setRecentTicket(ticket);
    setPassModalOpen(true);
  };

  const toggleCheckIn = (ticketId: string): boolean => {
    let newStatus = false;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId === ticketId) {
          newStatus = !t.checkedIn;
          return {
            ...t,
            checkedIn: newStatus,
            checkedInAt: newStatus ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return t;
      })
    );

    showToast(
      newStatus ? 'Gate Check-in Verified' : 'Check-in Revoked',
      `Pass ${ticketId} status has been updated.`,
      newStatus ? 'success' : 'info'
    );
    return newStatus;
  };

  const submitQuestion = (question: string, topic: QuestionTopic) => {
    const newQ: RealTalkQuestion = {
      id: `q-${Date.now()}`,
      question,
      topic,
      upvotes: 1,
      timestamp: 'Just now',
      answered: false,
      userUpvoted: true
    };
    setQuestions((prev) => [newQ, ...prev]);
    showToast('Question Submitted anonymously', 'Your question has been added to the Real Talk queue.', 'success');
  };

  const upvoteQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const isUpvoted = q.userUpvoted;
          return {
            ...q,
            upvotes: isUpvoted ? q.upvotes - 1 : q.upvotes + 1,
            userUpvoted: !isUpvoted
          };
        }
        return q;
      })
    );
  };

  const submitMentorship = (data: Omit<MentorshipRequest, 'id' | 'timestamp'>) => {
    const newReq: MentorshipRequest = {
      ...data,
      id: `ment-${Date.now()}`,
      timestamp: new Date().toLocaleDateString()
    };
    setMentorships((prev) => [newReq, ...prev]);
    showToast(
      'Mentorship Request Received! 🚀',
      `Thanks ${data.name}! A senior mentor in the Faith Commune Guild will reach out within 48 hours.`,
      'success'
    );
  };

  const joinCommunity = (data: Omit<CommunityMember, 'id' | 'joinedAt'>) => {
    const newMember: CommunityMember = {
      ...data,
      id: `mbr-${Date.now()}`,
      joinedAt: new Date().toLocaleDateString()
    };
    setCommunityMembers((prev) => [newMember, ...prev]);
    showToast(
      'Welcome to the Commune! ✝️✨',
      `You have joined the inter-denominational registry. Check your inbox for upcoming meet invites.`,
      'success'
    );
  };

  const exportAttendeesCSV = () => {
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'Age Group', 'Denomination', 'Passes Count', 'Registration Date', 'Checked In', 'Check In Time'];
    const rows = tickets.map((t) => [
      t.ticketId,
      `"${t.name.replace(/"/g, '""')}"`,
      t.email,
      t.phone,
      t.ageGroup,
      `"${t.denomination.replace(/"/g, '""')}"`,
      t.passCount,
      t.registeredAt,
      t.checkedIn ? 'YES' : 'NO',
      t.checkedInAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faith_Commune_Concert_Registrations_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV Exported', `${tickets.length} attendee records downloaded successfully.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        navigateTo,
        tickets,
        totalSpots: CONCERT_DETAILS.totalCapacity,
        claimedSpots,
        recentTicket,
        isRegisterModalOpen,
        setRegisterModalOpen,
        isPassModalOpen,
        setPassModalOpen,
        isGateModalOpen,
        setGateModalOpen,
        registerConcert,
        toggleCheckIn,
        setViewingTicket,
        questions,
        submitQuestion,
        upvoteQuestion,
        mentorships,
        submitMentorship,
        communityMembers,
        joinCommunity,
        toasts,
        showToast,
        removeToast,
        exportAttendeesCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
