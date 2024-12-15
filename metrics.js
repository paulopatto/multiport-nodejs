import os from "node:os";
import v8 from "node:v8";
import process from "node:process";

/**
 * Retrieves system metrics.
 *
 * @returns {Object} An object containing system metrics.
 * @returns {Object} system - System-level metrics.
 * @returns {string} system.platform - The operating system platform.
 * @returns {string} system.arch - The system architecture.
 * @returns {Array<Object>} system.cpus - An array of CPU information.
 * @returns {string} system.cpus[].model - The CPU model.
 * @returns {number} system.cpus[].speed - The CPU speed in MHz.
 * @returns {Object} system.cpus[].times - CPU times in user, nice, sys, idle, and irq.
 * @returns {number} system.totalMemory - Total system memory in bytes.
 * @returns {number} system.freeMemory - Free system memory in bytes.
 * @returns {Object} system.memoryUsage - Process memory usage in bytes.
 * @returns {Array<number>} system.loadAvg - System load average over 1, 5, and 15 minutes.
 * @returns {Object} system.uptime - System and process uptime in seconds.
 * @returns {number} system.uptime.system - System uptime in seconds.
 * @returns {number} system.uptime.process - Process uptime in seconds.
 */
export function getSystemMetrics() {
  return {
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().map((cpu) => ({
        model: cpu.model,
        speed: cpu.speed,
        times: cpu.times,
      })),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      memoryUsage: process.memoryUsage(),
      loadAvg: os.loadavg(),
      uptime: {
        system: os.uptime(),
        process: process.uptime(),
      },
    },
  };
}

/**
 * Retrieves Node.js V8 runtime metrics.
 *
 * @returns {Object} An object containing V8 runtime metrics.
 * @returns {Object} v8 - V8 runtime information.
 * @returns {Object} v8.heapStatistics - Heap statistics.
 * @returns {number} v8.heapStatistics.total_heap_size - Total heap size in bytes.
 * @returns {number} v8.heapStatistics.total_heap_size_executable - Total heap size allocated for executables in bytes.
 * @returns {number} v8.heapStatistics.total_physical_size - Total physical size of the heap in bytes.
 * @returns {number} v8.heapStatistics.total_available_size - Total available size for allocation in bytes.
 * @returns {number} v8.heapStatistics.used_heap_size - Currently used heap size in bytes.
 * @returns {number} v8.heapStatistics.heap_size_limit - Maximum allowed heap size in bytes.
 * @returns {number} v8.heapStatistics.malloced_memory - Memory explicitly allocated by malloc in bytes.
 * @returns {number} v8.heapStatistics.peak_malloced_memory - Peak amount of memory explicitly allocated by malloc in bytes.
 * @returns {Array<Object>} v8.heapSpaceStatistics - Statistics for individual heap spaces.
 * @returns {string} v8.heapSpaceStatistics[].space_name - Name of the heap space.
 * @returns {number} v8.heapSpaceStatistics[].space_size - Total size of the heap space in bytes.
 * @returns {number} v8.heapSpaceStatistics[].space_used_size - Used size of the heap space in bytes.
 * @returns {number} v8.heapSpaceStatistics[].space_available_size - Available size of the heap space in bytes.
 */
export function getV8Metrics() {
  const heapStats = v8.getHeapStatistics();
  const heapSpaceStats = v8.getHeapSpaceStatistics();
  return {
    v8: {
      heapStatistics: {
        total_heap_size: heapStats.total_heap_size,
        total_heap_size_executable: heapStats.total_heap_size_executable,
        total_physical_size: heapStats.total_physical_size,
        total_available_size: heapStats.total_available_size,
        used_heap_size: heapStats.used_heap_size,
        heap_size_limit: heapStats.heap_size_limit,
        malloced_memory: heapStats.malloced_memory,
        peak_malloced_memory: heapStats.peak_malloced_memory,
      },
      heapSpaceStatistics: heapSpaceStats.map((space) => ({
        space_name: space.space_name,
        space_size: space.space_size,
        space_used_size: space.space_used_size,
        space_available_size: space.space_available_size,
      })),
    },
  };
}

/**
 * Retrieves process-level metrics.
 *
 * @returns {Object} An object containing process metrics.
 * @returns {Object} process - Process information.
 * @returns {number} process.pid - Process identifier (PID).
 * @returns {string} process.title - Process title.
 * @returns {Array<string>} process.argv - Array containing the process arguments.
 * @returns {string} process.execPath - Path to the process executable.
 * @returns {string} process.version - Node.js version string.
 * @returns {Object} process.versions - Information about Node.js and its dependencies.
 * @returns {Array<string>} process.env - List of environment variable names (for security reasons, full environment details are not exposed).
 * @returns {Object} process.resourceUsage - Resource usage statistics.
 * @returns {Object} process.cpuUsage - CPU usage statistics.
 */
export function getProcessMetrics() {
  return {
    process: {
      pid: process.pid,
      title: process.title,
      argv: process.argv,
      execPath: process.execPath,
      version: process.version,
      versions: process.versions,
      env: Object.keys(process.env), // Avoid exposing full environment
      resourceUsage: process.resourceUsage(),
      cpuUsage: process.cpuUsage(),
    },
  };
}
