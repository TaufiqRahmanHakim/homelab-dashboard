package models

import "time"

// Application represents a self-hosted application in the homelab
type Application struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	URL         string    `json:"url"`
	Icon        string    `json:"icon,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateApplicationRequest represents the request body for creating/updating an application
type CreateApplicationRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	URL         string `json:"url"`
	Icon        string `json:"icon,omitempty"`
}

// Metrics represents system metrics response
type Metrics struct {
	CPU    CPUMetrics    `json:"cpu"`
	Memory MemoryMetrics `json:"memory"`
	Disk   DiskMetrics   `json:"disk"`
}

// CPUMetrics contains CPU usage information
type CPUMetrics struct {
	Usage float64     `json:"usage"`
	Cores []CoreUsage `json:"cores,omitempty"`
}

// CoreUsage contains per-core CPU usage
type CoreUsage struct {
	Core  int     `json:"core"`
	Usage float64 `json:"usage"`
}

// MemoryMetrics contains memory usage information
type MemoryMetrics struct {
	Total      uint64  `json:"total"`
	Used       uint64  `json:"used"`
	Free       uint64  `json:"free"`
	UsedPercent float64 `json:"usedPercent"`
}

// DiskMetrics contains disk usage information
type DiskMetrics struct {
	Total      uint64  `json:"total"`
	Used       uint64  `json:"used"`
	Free       uint64  `json:"free"`
	UsedPercent float64 `json:"usedPercent"`
	Mount      string  `json:"mount"`
}
