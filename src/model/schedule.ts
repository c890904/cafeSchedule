import { Dexie } from "dexie";
import { fetchCsv } from "./tool";
import { db, masterModal } from "../db/dbTool";
import { stringify } from "querystring";
import { cast, getCastName, getCastNames } from "./cast";

export type schedule = {
    castId: string;
    shopId: string;
    startAt: Date;
    endAt: Date;
    castName: string;
}

export const initSchedule = async (db: Dexie) => {
    const shopVersion = ((await db.table("master").get("schedule")) as masterModal | undefined)?.version ?? 0;

    const shopTable = db.table("schedule");

    const csvDatas = await fetchCsv("/schedule.csv");
    let newVersion = 0;
    console.log(new Date().toISOString());
    csvDatas?.forEach((row) => {
        if (Number(row[0]) > shopVersion) {
            shopTable.put({
                castId: row[1],
                shopId: row[2],
                startAt: Date.parse(row[3]),
                endAt: Date.parse(row[4]),
            });

            if (newVersion < Number(row[0])) {
                newVersion = Number(row[0]);
            }
        } else {
        }
    });

    if (newVersion != 0) {
        db.table("master").put({
            id: "schedule",
            version: newVersion
        })
    }
}

export const getWeekSchedule = async () => {
    const resultList = [] as schedule[][];
    const today = new Date();
    const nameMap = await getCastNames();
    for (let i = 0; i < 7; i++) {
        resultList.push(await getSchedule(new Date(today.getTime() + (i * 24 * 60 * 60 * 1000))));
    }

    const result = resultList.map((schedules) => schedules.map((schedule) => {
        if (nameMap.has(schedule.castId)) {
            schedule.castName = nameMap.get(schedule.castId) ?? ""
        }
        return schedule;
    } ))

    return result
}

export const getSchedule = async (date: Date) => {
    console.log("get Schedule");
    const start = date;
    start.setHours(12,0,0,0);
    const end = new Date(start.getTime() + (24 * 60 * 60 * 1000));
    const result = [] as schedule[];
    await db.table("schedule").filter((schedule:schedule) => schedule.startAt >= start && schedule.startAt < end).each(async (schedule:schedule) => {
        result.push({
            castId: schedule.castId,
            shopId: schedule.shopId,
            startAt: new Date(schedule.startAt),
            endAt: new Date(schedule.endAt),
            castName: ""
        });
    });
    return result.sort((a,b) => {
        const start = a.startAt.getTime() - b.startAt.getTime();
        if (start != 0) return start;
        return a.endAt.getTime() - b.endAt.getTime();
    });
}
