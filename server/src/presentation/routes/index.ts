import express, { Request, Response } from "express";
const router = express.Router();

router.use("/auth", (req: Request, res: Response) => {
    return res.json("check");
});

export default router;
