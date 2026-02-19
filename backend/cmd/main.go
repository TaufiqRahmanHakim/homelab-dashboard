package main

import (
	"flag"
	"fmt"
	"homelab-dashboard/internal/database"
	"homelab-dashboard/internal/handlers"
	"homelab-dashboard/internal/metrics"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	// Configuration from environment or flags
	port := flag.String("port", getEnv("PORT", "8080"), "Server port")
	dbPath := flag.String("db", getEnv("DATABASE_PATH", "data/homelab.db"), "Database path")
	metricsInterval := flag.Int("metrics-interval", getEnvInt("METRICS_INTERVAL", 5), "Metrics collection interval in seconds")
	mountPoint := flag.String("mount-point", getEnv("MOUNT_POINT", ""), "Disk mount point for metrics")

	flag.Parse()

	// Initialize database
	db, err := database.New(*dbPath)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Initialize metrics collector
	collector := metrics.NewCollector(time.Duration(*metricsInterval)*time.Second, *mountPoint)
	defer collector.Stop()

	// Initialize handlers
	appHandler := handlers.NewApplicationHandler(db)
	metricsHandler := handlers.NewMetricsHandler(collector)

	// Setup router
	r := mux.NewRouter()

	// CORS middleware
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	// Application routes
	api.HandleFunc("/apps", appHandler.ListApplications).Methods("GET", "OPTIONS")
	api.HandleFunc("/apps", appHandler.CreateApplication).Methods("POST", "OPTIONS")
	api.HandleFunc("/apps/{id}", appHandler.GetApplication).Methods("GET", "OPTIONS")
	api.HandleFunc("/apps/{id}", appHandler.UpdateApplication).Methods("PUT", "OPTIONS")
	api.HandleFunc("/apps/{id}", appHandler.DeleteApplication).Methods("DELETE", "OPTIONS")

	// Metrics routes
	api.HandleFunc("/metrics", metricsHandler.GetMetrics).Methods("GET", "OPTIONS")

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Start server
	addr := fmt.Sprintf(":%s", *port)
	log.Printf("Starting server on %s", addr)
	log.Printf("Database: %s", *dbPath)
	log.Printf("Metrics interval: %ds", *metricsInterval)

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// getEnv gets environment variable with default fallback
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvInt gets environment variable as int with default fallback
func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}
