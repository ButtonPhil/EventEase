export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
}