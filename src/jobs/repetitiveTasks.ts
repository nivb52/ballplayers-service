import * as schedule from "node-schedule";
import { updatePlayersInDataBaseFromExternalSource } from "../services/playerService";

export const initJobs = async () => {
  updatePlayersEvery15MinFromExternalSource();
};

function updatePlayersEvery15MinFromExternalSource() {
  const startTime = new Date(Date.now() + 5000);
  const rule = { start: startTime, rule: "*/15 * * * *" };
  const job = schedule.scheduleJob(rule, async function () {
    try {
      await updatePlayersInDataBaseFromExternalSource();
    } catch (err) {
      console.error(
        "failed update players in db at " + Date.now().toLocaleString()
      );
    }
  });
}
