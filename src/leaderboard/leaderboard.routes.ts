import { Router } from "express";
import { leaderboardController } from "./leaderboard.controller";

const router = Router();

router.get("/leaderboard", leaderboardController.getLeaderboard);

export default router;
