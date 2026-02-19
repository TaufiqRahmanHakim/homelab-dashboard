package metrics

import (
	"context"
	"homelab-dashboard/internal/models"
	"runtime"
	"sync"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
)

// Collector collects system metrics
type Collector struct {
	mu           sync.RWMutex
	lastMetrics  *models.Metrics
	interval     time.Duration
	ctx          context.Context
	cancel       context.CancelFunc
	mountPoint   string
}

// NewCollector creates a new metrics collector
func NewCollector(interval time.Duration, mountPoint string) *Collector {
	ctx, cancel := context.WithCancel(context.Background())

	c := &Collector{
		interval:   interval,
		ctx:        ctx,
		cancel:     cancel,
		mountPoint: mountPoint,
	}

	// Collect initial metrics
	c.collect()

	// Start background collection
	go c.startCollection()

	return c
}

// startCollection collects metrics at regular intervals
func (c *Collector) startCollection() {
	ticker := time.NewTicker(c.interval)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			return
		case <-ticker.C:
			c.collect()
		}
	}
}

// collect gathers current system metrics
func (c *Collector) collect() {
	metrics := &models.Metrics{}

	// CPU metrics
	c.collectCPU(metrics)

	// Memory metrics
	c.collectMemory(metrics)

	// Disk metrics
	c.collectDisk(&metrics.Disk)

	c.mu.Lock()
	c.lastMetrics = metrics
	c.mu.Unlock()
}

// collectCPU collects CPU usage metrics
func (c *Collector) collectCPU(metrics *models.Metrics) {
	// Get overall CPU usage
	percent, err := cpu.Percent(time.Second, false)
	if err != nil {
		metrics.CPU.Usage = 0
	} else if len(percent) > 0 {
		metrics.CPU.Usage = percent[0]
	}

	// Get per-core usage
	corePercent, err := cpu.Percent(time.Second, true)
	if err == nil {
		for i, usage := range corePercent {
			metrics.CPU.Cores = append(metrics.CPU.Cores, models.CoreUsage{
				Core:  i,
				Usage: usage,
			})
		}
	}
}

// collectMemory collects memory usage metrics
func (c *Collector) collectMemory(metrics *models.Metrics) {
	v, err := mem.VirtualMemory()
	if err != nil {
		return
	}

	metrics.Memory = models.MemoryMetrics{
		Total:       v.Total,
		Used:        v.Used,
		Free:        v.Free,
		UsedPercent: v.UsedPercent,
	}
}

// collectDisk collects disk usage metrics
func (c *Collector) collectDisk(metrics *models.DiskMetrics) {
	// Determine mount point based on OS
	mount := c.mountPoint
	if mount == "" {
		if runtime.GOOS == "windows" {
			mount = "C:\\"
		} else {
			mount = "/"
		}
	}

	usage, err := disk.Usage(mount)
	if err != nil {
		// Fallback to root
		if runtime.GOOS == "windows" {
			usage, err = disk.Usage("C:\\")
		} else {
			usage, err = disk.Usage("/")
		}
		if err != nil {
			return
		}
	}

	*metrics = models.DiskMetrics{
		Total:       usage.Total,
		Used:        usage.Used,
		Free:        usage.Free,
		UsedPercent: usage.UsedPercent,
		Mount:       mount,
	}
}

// GetMetrics returns the latest collected metrics
func (c *Collector) GetMetrics() *models.Metrics {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if c.lastMetrics == nil {
		return &models.Metrics{}
	}

	// Return a copy to avoid race conditions
	metrics := *c.lastMetrics
	metrics.CPU.Cores = make([]models.CoreUsage, len(c.lastMetrics.CPU.Cores))
	copy(metrics.CPU.Cores, c.lastMetrics.CPU.Cores)

	return &metrics
}

// Stop stops the metrics collection
func (c *Collector) Stop() {
	c.cancel()
}
