package database

import (
	"database/sql"
	"fmt"
	"homelab-dashboard/internal/models"
	"os"
	"path/filepath"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/google/uuid"
)

// Database wraps the SQL database connection
type Database struct {
	db *sql.DB
}

// New creates a new database connection
func New(dbPath string) (*Database, error) {
	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create data directory: %w", err)
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	database := &Database{db: db}
	if err := database.migrate(); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	return database, nil
}

// migrate creates the necessary tables
func (d *Database) migrate() error {
	query := `
	CREATE TABLE IF NOT EXISTS applications (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		description TEXT,
		url TEXT NOT NULL,
		icon TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := d.db.Exec(query)
	return err
}

// Close closes the database connection
func (d *Database) Close() error {
	return d.db.Close()
}

// CreateApplication creates a new application entry
func (d *Database) CreateApplication(req models.CreateApplicationRequest) (*models.Application, error) {
	id := uuid.New().String()
	now := time.Now()

	query := `
	INSERT INTO applications (id, name, description, url, icon, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	_, err := d.db.Exec(query, id, req.Name, req.Description, req.URL, req.Icon, now, now)
	if err != nil {
		return nil, fmt.Errorf("failed to create application: %w", err)
	}

	return &models.Application{
		ID:          id,
		Name:        req.Name,
		Description: req.Description,
		URL:         req.URL,
		Icon:        req.Icon,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

// GetApplications returns all applications
func (d *Database) GetApplications() ([]models.Application, error) {
	query := `SELECT id, name, description, url, icon, created_at, updated_at FROM applications ORDER BY created_at DESC`

	rows, err := d.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query applications: %w", err)
	}
	defer rows.Close()

	var applications []models.Application
	for rows.Next() {
		var app models.Application
		err := rows.Scan(&app.ID, &app.Name, &app.Description, &app.URL, &app.Icon, &app.CreatedAt, &app.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan application: %w", err)
		}
		applications = append(applications, app)
	}

	return applications, nil
}

// GetApplication returns a single application by ID
func (d *Database) GetApplication(id string) (*models.Application, error) {
	query := `SELECT id, name, description, url, icon, created_at, updated_at FROM applications WHERE id = ?`

	var app models.Application
	err := d.db.QueryRow(query, id).Scan(&app.ID, &app.Name, &app.Description, &app.URL, &app.Icon, &app.CreatedAt, &app.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("application not found")
		}
		return nil, fmt.Errorf("failed to get application: %w", err)
	}

	return &app, nil
}

// UpdateApplication updates an existing application
func (d *Database) UpdateApplication(id string, req models.CreateApplicationRequest) (*models.Application, error) {
	now := time.Now()

	query := `
	UPDATE applications 
	SET name = ?, description = ?, url = ?, icon = ?, updated_at = ?
	WHERE id = ?
	`

	result, err := d.db.Exec(query, req.Name, req.Description, req.URL, req.Icon, now, id)
	if err != nil {
		return nil, fmt.Errorf("failed to update application: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return nil, fmt.Errorf("application not found")
	}

	return &models.Application{
		ID:          id,
		Name:        req.Name,
		Description: req.Description,
		URL:         req.URL,
		Icon:        req.Icon,
		UpdatedAt:   now,
	}, nil
}

// DeleteApplication deletes an application by ID
func (d *Database) DeleteApplication(id string) error {
	query := `DELETE FROM applications WHERE id = ?`

	result, err := d.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete application: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("application not found")
	}

	return nil
}
