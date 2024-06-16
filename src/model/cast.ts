import { Dexie } from "dexie";
import { fetchCsv } from "./tool";
import { db, masterModal } from "../db/dbTool";

export type cast = {
    id: string;
    name: string;
    shopId: string;
}

export const initCast = async (db: Dexie) => {
    const shopVersion = ((await db.table("master").get("cast")) as masterModal | undefined)?.version ?? 0;

    const castTable = db.table("cast");

    const csvDatas = await fetchCsv("/cafeSchedule/cast.csv");
    let newVersion = 0;
    csvDatas?.forEach((row) => {
        if (Number(row[0]) > shopVersion) {
            castTable.put({
                id: row[1],
                shopId: row[2],
                name: row[3]
            });

            if (newVersion < Number(row[0])) {
                newVersion = Number(row[0]);
            }
        }
    });

    if (newVersion != 0) {
        db.table("master").put({
            id: "cast",
            version: newVersion
        })
    }
}

export const getCastNames = async () => {
    const map = new Map<string, string>();
    (await db.table("cast").toArray()).forEach((cast: cast) => {
        map.set(cast.id, cast.name)
    });
    return map;
}

export const getCastName = async (id: string) => {
    try {
        const castTable = db.table("cast");
        const castResult = await castTable.get(id);
        return (castResult) as cast
    } catch (error) {
        console.error(error)
    }
}