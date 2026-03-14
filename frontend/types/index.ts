// Global type definitions

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Interview {
  id: number;
  jobRoleId: number;
  status: 'scheduled' | 'in_progress' | 'completed';
}
