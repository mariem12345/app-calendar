export interface Session {
    id: string;
    title: string;
    description: string;
    category: SessionCategory;
    city: string;
    date: Date;
    status: SessionStatus;
    image?: string;
  }
  
  export type SessionCategory = 'Formación' | 'Reunión' | 'Demo' | 'Taller';
  export type SessionStatus = 'draft' | 'locked' | 'hidden' | 'published';