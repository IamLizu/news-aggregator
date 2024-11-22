const schedule = require("node-schedule");
const logger = require("../logger/LoggerService");

class Scheduler {
    constructor() {
        this.jobs = new Map();
    }

    /**
     * Schedule a new task.
     *
     * @param {string} jobName - Unique name for the job.
     * @param {string} cronExpression - Cron syntax for scheduling.
     * @param {Function} task - The function to execute.
     */
    scheduleTask(jobName, cronExpression, task) {
        if (this.jobs.has(jobName)) {
            throw new Error(`A job with the name '${jobName}' already exists.`);
        }

        const job = schedule.scheduleJob(cronExpression, async () => {
            try {
                logger.info(`Executing scheduled task: ${jobName}`);
                await task();
                logger.info(`Task '${jobName}' completed successfully`);
            } catch (error) {
                logger.error(`Task '${jobName}' failed`, {
                    error: error.message,
                });
            }
        });

        this.jobs.set(jobName, job);
        logger.info(`Scheduled task '${jobName}' with cron: ${cronExpression}`);
    }

    /**
     * Cancel a scheduled task.
     *
     * @param {string} jobName - Name of the job to cancel.
     */
    cancelTask(jobName) {
        const job = this.jobs.get(jobName);
        if (!job) {
            throw new Error(`No job found with the name '${jobName}'`);
        }

        job.cancel();
        this.jobs.delete(jobName);
        logger.info(`Canceled task '${jobName}'`);
    }

    /**
     * List all scheduled tasks.
     *
     * @returns {Array<string>} - List of job names.
     */
    listTasks() {
        return Array.from(this.jobs.keys());
    }
}

module.exports = Scheduler;
