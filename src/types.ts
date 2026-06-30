export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  imageAlt: string;
  category: string;
  title: string;
  summary: string;
  meta: string;
  imageUrl?: string;
}
