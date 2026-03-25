export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  color: string;
  inviteCode: string;
  createdAt: string;
  members?: GroupMember[];
  _count?: { members: number };
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'owner' | 'member';
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  groups: {
    group: {
      id: string;
      name: string;
      color: string;
    };
  }[];
}
