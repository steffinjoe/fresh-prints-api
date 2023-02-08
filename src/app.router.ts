import express from "express";
import { DataService } from "./services/data.service";
const router = express.Router();

router.get('/apparels', async (request, response) => {
    response.send(await DataService.getApparelData());
});

router.post('/apparel', async (request, response) => {
    await DataService.postApparelData(request.body)
    response.send(true)
})

router.post('/order', async (request, response) => {
    const repsonseBody = await DataService.placeOrder(request.body)
    response.send(repsonseBody)
})
export default router