const apparelDataPath = 'src/assets/apparels.json';
import fs from 'fs';
import { Apparel } from '../models/apparel.model';
export class DataService {

    public static async getApparelData() {
        console.log('Entering DataService.getApparelData');
        const jsonData = await fs.promises.readFile(apparelDataPath, 'utf8')
        const response =  JSON.parse(jsonData) as Apparel[]
        console.log('Exiting DataService.getApparelData');
        return response;
    }

    public static async postApparelData (requestData: Apparel[]) {
        console.log('Entering DataService.updateApparelData with request:', requestData);
        const apparelData =  await this.getApparelData()
        requestData.forEach(record => {
            this.updateApparelData(apparelData as Apparel[],record)
        });
        await fs.promises.writeFile(apparelDataPath, JSON.stringify(apparelData));
        console.log('Exiting DataService.updateApparelData');
        return true;
    }

    public static updateApparelData(apparelData: Apparel[], requestData: Apparel) {
        console.log('Entering DataService.updateApparelData');
        apparelData.map((apparel: Apparel) => {
            if(apparel.apparelCode === requestData.apparelCode && apparel.size === requestData.size) {
                apparel.stock = requestData.stock ? requestData.stock : apparel.stock
                apparel.price = requestData.price ? requestData.price : apparel.price
            }
        });
        console.log('Exiting DataService.updateApparelData');
    } 

    public static async placeOrder(orderData: Apparel) {
        console.log('Entering DataService.placeOrder with params', orderData);
        const apparelData =  await this.getApparelData()
        let response = '';
        apparelData.map((apparel: Apparel) => {
            if(apparel.apparelCode === orderData.apparelCode && apparel.size === orderData.size) {
                const inStock = orderData.stock ? (orderData.stock < apparel?.stock!) : true
                const isAffordable = orderData.price ? (orderData.price <= apparel?.price!) : true
                if(!inStock) {
                    response = 'Not in Stock'
                } else {
                    apparel.stock = (apparel.stock! - orderData.stock!)
                }
                if(!isAffordable) {
                    response = 'Price too High'
                }
                response = 'Order Placed'
            }
        });
        await fs.promises.writeFile(apparelDataPath, JSON.stringify(apparelData));
        console.log('Exiting DataService.updateApparelData');
        return response;
    }
} 