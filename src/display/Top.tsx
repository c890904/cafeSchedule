import { useEffect, useState } from 'react';
import { ShopSchedule, getWeekSchedule } from '../model/schedule';
import { Avatar, Box, Button, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader } from '@mui/material';

const weekday = ["日", "月", "火", "水", "木", "金", "土"];

export const TopPage = () => {
    const [selected, setSelected] = useState(0);
    const [scheduleList, setScheduleList] = useState<ShopSchedule[][]>([]);

    useEffect(() => {
        getWeekSchedule().then((data) => {
            setScheduleList(data);
        });
    }, []);

    const fillZero = (i: number) => {
        return ("0" + i).slice(-2);
    }

    const dateToDateString = (date: Date) => {
        return fillZero(date.getMonth() + 1) + "/" + fillZero(date.getDate()) + "(" + weekday[date.getDay()] + ")"
    }

    const dateToTimeString = (date: Date) => {
        return fillZero(date.getHours() % 12) + ":" + fillZero(date.getMinutes()) + (date.getHours() >= 12 ? "PM" : "AM")
    }

    const dateButton = (index: number) => {
        const toDay = new Date(new Date().getTime() + (index * 24 * 60 * 60 * 1000));

        return (
            <Button
                key={"dateButton" + index}
                variant={toDay.getDay() == 6 || toDay.getDay() == 0 ? "contained" : "outlined"}
                color={toDay.getDay() == 0 ? "error" : undefined}
                disabled={!scheduleList[index] || scheduleList[index].length == 0}
                onClick={() => { setSelected(index) }}
                style={{
                    marginLeft: "2px",
                    marginRight: "2px",
                }}>
                {dateToDateString(toDay)}<br />{(scheduleList[index]?.reduce((a, b) => a + b.schedules.length, 0) ?? 0) + "人"}
            </Button>
        );
    }

    const showShopSchedule = (shopSchedule: ShopSchedule) => {
        const list = shopSchedule.schedules.map((schedule) =>
            <ListItemButton alignItems="flex-start" onClick={() => window.open("https://x.com/" + schedule.castId)}>
                <ListItemAvatar>
                    <Avatar src={"/cafeSchedule/cast/" + schedule.castId + ".png"} alt={schedule.castName} />
                </ListItemAvatar>
                <ListItemText
                    primary={schedule.castName}
                    secondary={dateToTimeString(schedule.startAt) + "~" + dateToTimeString(schedule.endAt)}
                />
            </ListItemButton>
        );

        return (
            <li>

                <ListSubheader style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderTop: "1px",
                    borderBottom: "1px",
                }}>{shopSchedule.shopName}</ListSubheader>
                {list}

            </li>
        )
    }

    return (<>
        <div >
            {dateButton(0)}
            {dateButton(1)}
            {dateButton(2)}
            {dateButton(3)}
            {dateButton(4)}
            {dateButton(5)}
            {dateButton(6)}
        </div>
        <Box display="flex" justifyContent="center">
            <List style={{
                maxWidth: "50dvw"
            }}>
                {scheduleList[selected] && scheduleList[selected].map((schedule) =>
                    showShopSchedule(schedule)
                )}
            </List>
        </Box>
    </>);
}