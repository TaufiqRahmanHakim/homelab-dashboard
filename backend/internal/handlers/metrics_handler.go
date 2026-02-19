package handlers

import (
	"homelab-dashboard/internal/metrics"
	"net/http"
)

// MetricsHandler handles metrics endpoint
type MetricsHandler struct {
	collector *metrics.Collector
}

// NewMetricsHandler creates a new metrics handler
func NewMetricsHandler(collector *metrics.Collector) *MetricsHandler {
	return &MetricsHandler{collector: collector}
}

// GetMetrics returns current system metrics
func (h *MetricsHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
	metrics := h.collector.GetMetrics()
	respondJSON(w, http.StatusOK, metrics)
}
