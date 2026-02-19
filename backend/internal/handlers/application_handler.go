package handlers

import (
	"encoding/json"
	"homelab-dashboard/internal/database"
	"homelab-dashboard/internal/models"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
)

// ApplicationHandler handles application CRUD operations
type ApplicationHandler struct {
	db *database.Database
}

// NewApplicationHandler creates a new application handler
func NewApplicationHandler(db *database.Database) *ApplicationHandler {
	return &ApplicationHandler{db: db}
}

// ListApplications returns all applications
func (h *ApplicationHandler) ListApplications(w http.ResponseWriter, r *http.Request) {
	applications, err := h.db.GetApplications()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to get applications")
		return
	}

	if applications == nil {
		applications = []models.Application{}
	}

	respondJSON(w, http.StatusOK, applications)
}

// GetApplication returns a single application
func (h *ApplicationHandler) GetApplication(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	app, err := h.db.GetApplication(id)
	if err != nil {
		respondError(w, http.StatusNotFound, "Application not found")
		return
	}

	respondJSON(w, http.StatusOK, app)
}

// CreateApplication creates a new application
func (h *ApplicationHandler) CreateApplication(w http.ResponseWriter, r *http.Request) {
	var req models.CreateApplicationRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate required fields
	if req.Name == "" {
		respondError(w, http.StatusBadRequest, "Name is required")
		return
	}

	if req.URL == "" {
		respondError(w, http.StatusBadRequest, "URL is required")
		return
	}

	// Validate URL format
	if _, err := url.ParseRequestURI(req.URL); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid URL format")
		return
	}

	app, err := h.db.CreateApplication(req)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to create application")
		return
	}

	respondJSON(w, http.StatusCreated, app)
}

// UpdateApplication updates an existing application
func (h *ApplicationHandler) UpdateApplication(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req models.CreateApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate required fields
	if req.Name == "" {
		respondError(w, http.StatusBadRequest, "Name is required")
		return
	}

	if req.URL == "" {
		respondError(w, http.StatusBadRequest, "URL is required")
		return
	}

	// Validate URL format
	if _, err := url.ParseRequestURI(req.URL); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid URL format")
		return
	}

	app, err := h.db.UpdateApplication(id, req)
	if err != nil {
		respondError(w, http.StatusNotFound, "Application not found")
		return
	}

	respondJSON(w, http.StatusOK, app)
}

// DeleteApplication deletes an application
func (h *ApplicationHandler) DeleteApplication(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	err := h.db.DeleteApplication(id)
	if err != nil {
		respondError(w, http.StatusNotFound, "Application not found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// respondJSON sends a JSON response
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// respondError sends an error response
func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}
