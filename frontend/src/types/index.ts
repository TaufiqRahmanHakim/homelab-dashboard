export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationRequest {
  name: string;
  description: string;
  url: string;
  icon?: string;
}

export interface Metrics {
  cpu: CPU;
  memory: Memory;
  disk: Disk;
}

export interface CPU {
  usage: number;
  cores?: CoreUsage[];
}

export interface CoreUsage {
  core: number;
  usage: number;
}

export interface Memory {
  total: number;
  used: number;
  free: number;
  usedPercent: number;
}

export interface Disk {
  total: number;
  used: number;
  free: number;
  usedPercent: number;
  mount: string;
}
