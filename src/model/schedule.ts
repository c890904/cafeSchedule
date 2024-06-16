import { Dexie } from "dexie";
import { fetchCsv } from "./tool";
import { db, masterModal } from "../db/dbTool";
import { getCastNames } from "./cast";
import { getShopNames } from "./shop";

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

    const csvDatas = await fetchCsv("/cafeSchedule/schedule.csv");
    let newVersion = 0;
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
    const resultList = [] as ShopSchedule[][];
    const today = new Date();
    const castNameMap = await getCastNames();
    const shopNameMap = await getShopNames();
    for (let i = 0; i < 7; i++) {
        resultList.push(await getSchedule(new Date(today.getTime() + (i * 24 * 60 * 60 * 1000)), shopNameMap, castNameMap));
    }

    return resultList;
}

export const getSchedule = async (date: Date, shopNameMap: Map<string, string>, castNameMap: Map<string, string>) => {
    const start = date;
    start.setHours(12, 0, 0, 0);
    const end = new Date(start.getTime() + (24 * 60 * 60 * 1000));
    const resultMap = new Map<string, ShopSchedule>();
    await db.table("schedule").filter((schedule: schedule) => schedule.startAt >= start && schedule.startAt < end).each(async (schedule: schedule) => {
        if (resultMap.has(schedule.shopId)) {
            resultMap.get(schedule.shopId)?.addSchedule({
                castId: schedule.castId,
                castName: castNameMap.get(schedule.castId) ?? "",
                startAt: new Date(schedule.startAt),
                endAt: new Date(schedule.endAt),
            })
        } else {
            resultMap.set(schedule.shopId, new ShopSchedule({
                shopId: schedule.shopId,
                shopName: shopNameMap.get(schedule.shopId) ?? "",
                schedule: {
                    castId: schedule.castId,
                    castName: castNameMap.get(schedule.castId) ?? "",
                    startAt: new Date(schedule.startAt),
                    endAt: new Date(schedule.endAt),
                }
            }))
        }
    });

    return Array.from(resultMap.values()).sort((a, b) => a.getStartedAt().getTime() - b.getStartedAt().getTime());
}

export class ShopSchedule {
    shopId: string;
    shopName: string;
    schedules: {
        castId: string;
        castName: string;
        startAt: Date;
        endAt: Date;
    }[];

    constructor({
        shopId,
        shopName,
        schedule: {
            castId,
            castName,
            startAt,
            endAt,
        }
    }: {
        shopId: string;
        shopName: string;
        schedule: {
            castId: string;
            castName: string;
            startAt: Date;
            endAt: Date;
        }
    }) {
        this.shopId = shopId;
        this.shopName = shopName;
        this.schedules = [{
            castId: castId,
            castName: castName,
            startAt: startAt,
            endAt: endAt,
        }];
    }

    addSchedule = ({
        castId,
        castName,
        startAt,
        endAt,
    }: {
        castId: string;
        castName: string;
        startAt: Date;
        endAt: Date;
    }) => {
        this.schedules.push({
            castId: castId,
            startAt: startAt,
            endAt: endAt,
            castName: castName,
        });
        this.sort();
    }

    sort = () => {
        this.schedules = this.schedules.sort((a, b) => {
            const start = a.startAt.getTime() - b.startAt.getTime();
            if (start != 0) return start;
            return a.endAt.getTime() - b.endAt.getTime();
        })
    }

    getStartedAt = () => {
        return this.schedules[0].startAt;
    }
}