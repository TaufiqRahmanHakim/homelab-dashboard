import { Application, CreateApplicationRequest, Metrics } from '../types';

const API_BASE = '/api';

export const api = {
  // Application CRUD
  async getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_BASE}/apps`);
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    return response.json();
  },

  async getApplication(id: string): Promise<Application> {
    const response = await fetch(`${API_BASE}/apps/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }
    return response.json();
  },

  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    const response = await fetch(`${API_BASE}/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create application');
    }
    return response.json();
  },

  async updateApplication(id: string, data: CreateApplicationRequest): Promise<Application> {
    const response = await fetch(`${API_BASE}/apps/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update application');
    }
    return response.json();
  },

  async deleteApplication(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/apps/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete application');
    }
  },

  // Metrics
  async getMetrics(): Promise<Metrics> {
    const response = await fetch(`${API_BASE}/metrics`);
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    return response.json();
  },
};
