import { Dexie } from "dexie";
import { fetchCsv } from "./tool";
import { db, masterModal } from "../db/dbTool";
import { cast } from "./cast";

export type shop = {
    id: string,
    name: string,
    casts: cast[],
}

export const initShop = async (db: Dexie) => {
    const shopVersion = ((await db.table("master").get("shop")) as masterModal | undefined)?.version ?? 0;

    const shopTable = db.table("shop");

    const csvDatas = await fetchCsv("/cafeSchedule/shop.csv");
    let newVersion = 0;
    csvDatas?.forEach((row) => {
        if (Number(row[0]) > shopVersion) {
            shopTable.put({
                id: row[1],
                name: row[2]
            });

            if (newVersion < Number(row[0])) {
                newVersion = Number(row[0]);
            }
        }
    });

    if (newVersion != 0) {
        db.table("master").put({
            id: "shop",
            version: newVersion
        })
    }
}

export const getShopNames = async () => {
    const map = new Map<string, string>();
    (await db.table("shop").toArray()).forEach((shop: shop) => {
        map.set(shop.id, shop.name)
    });
    return map;
}