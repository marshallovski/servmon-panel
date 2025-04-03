import { readdir } from 'node:fs/promises';
import { exec } from 'node:child_process';
import Logger from '../utils/logger.js';
import ntfySendMessage from '../utils/ntfySendMessage.js';

const logger = new Logger('jobs/setupJobs');

const jobsFolder = './jobs/scripts';
const jobScripts = [];

async function runJob(job) {
  logger.log(`Running job: ${job.name}`);

  return new Promise(async (resolve, reject) => {
    exec(`sh ${job.filePath}`, async (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error executing job ${job.name}:`, error);
        await ntfySendMessage(`Error executing job ${job.name}:`, error);
        return reject(error);
      }

      if (stdout) {
        logger.log(`Job ${job.name} output: ${stdout}`);
        await ntfySendMessage(`Job ${job.name} output: ${stdout}`);
      }
     
      if (stderr) {
        logger.warn(`Job ${job.name} stderr: ${stderr}`);
        await ntfySendMessage(`Job ${job.name} stderr: ${stderr}`);
      }

      resolve();
    });
  });
}

async function setupJobs() {
  try {
    const files = await readdir(jobsFolder);

    for (const file of files) {
      const filePath = `${jobsFolder}/${file}`;

      jobScripts.push({
        name: file.replace('.sh', ''),
        filePath,
      });
    }

    setInterval(async () => {
      jobScripts.forEach(async (job) => {
        try {
          await runJob(job);
        } catch (err) {
          logger.error(`Error executing job ${job.name}:`, err);
        }
      });
    }, 60000);
  } catch (err) {
    logger.error(`Error setting up jobs: ${err.message}`);
    throw err;
  }
}

export default setupJobs;