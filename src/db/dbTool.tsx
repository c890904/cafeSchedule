import Dexie from 'dexie';
import { initShop } from '../model/shop';
import { initCast } from '../model/cast';
import { initSchedule } from '../model/schedule';
 
// IndexedDB の初期化
export const db = new Dexie('ledger');

db.version(1).stores({
  master: '++id, version',
  shop: '++id, name',
  cast: '++id, shopId, name',
  schedule: '++, &[castId+shopId+startAt], endAt',
  category: '++id, name, type, parent, value',
});

export async function initDB() {
  console.log("initDB");
  initShop(db);
  initCast(db);
  initSchedule(db);
}

export interface masterModal{
  id: string,
  version: number,
}

export interface categoryModel{
  id: number,
  name: string,
  type: number,
  parent: number,
  value: number,
  kids: categoryModel[],
}
