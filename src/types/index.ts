export type PageId = 'home' | 'about' | 'events' | 'concert' | 'initiatives' | 'community' | 'ops';

export interface ConcertTicket {
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  ageGroup: string;
  denomination: string;
  passCount: number;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  isVolunteerOptIn?: boolean;
}

export type EventCategory = 'worship' | 'tech' | 'business' | 'youth' | 'open-forum';

export interface EventSpeaker {
  name: string;
  role: string;
  churchOrOrg: string;
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  locationType: 'in-person' | 'hybrid' | 'online';
  description: string;
  speakers: EventSpeaker[];
  capacity: number;
  attendeesCount: number;
  status: 'upcoming' | 'filling-fast' | 'completed';
  image: string;
  tags: string[];
}

export type QuestionTopic = 'career' | 'mental-health' | 'relationships' | 'doubt-faith' | 'lifestyle';

export interface RealTalkQuestion {
  id: string;
  question: string;
  topic: QuestionTopic;
  upvotes: number;
  timestamp: string;
  answered: boolean;
  answerExcerpt?: string;
  answeredBy?: string;
  userUpvoted?: boolean;
}

export interface MentorshipRequest {
  id: string;
  name: string;
  email: string;
  track: 'tech' | 'business' | 'creative' | 'career-switch';
  targetRole: string;
  message: string;
  timestamp: string;
}

export interface CommunityMember {
  id: string;
  fullName: string;
  email: string;
  denomination: string;
  city: string;
  interests: string[];
  joinedAt: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
