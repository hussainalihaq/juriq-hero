export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  actions?: ActionChip[];
}

export interface ActionChip {
  label: string;
  icon: string;
  actionId: string;
}

export interface Case {
  id: string;
  name: string;
  court: string;
  match: number;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time?: string;
  judge?: string;
  urgent?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'draft' | 'analysis' | 'create' | 'upload';
}
