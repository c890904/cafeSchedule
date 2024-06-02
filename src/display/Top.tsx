import { useEffect, useState } from 'react';
import { getWeekSchedule, schedule } from '../model/schedule';
import { Avatar, Button } from '@mui/material';

const weekday = ["日", "月", "火", "水", "木", "金", "土"];

export const TopPage = () => {
    const [selected, setSelected] = useState(0);
    const [scheduleList, setScheduleList] = useState<schedule[][]>([]);

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
        console.log(date);
        return  fillZero(date.getHours() % 12) + ":" + fillZero(date.getMinutes()) + (date.getHours() >= 12 ? "PM" : "AM")
    }

    const dateButton = (index: number) => {
        return (
            <Button
                key={"dateButton" + index}
                variant={index == 6 || index == 0 ? "contained" : "outlined"}
                color={index == 0 ? "error" : undefined}
                disabled={!scheduleList[index] || scheduleList[index].length == 0}
                onClick={() => { setSelected(index) }}
                style={{
                    marginLeft: "2px",
                    marginRight: "2px",
                }}>
                {dateToDateString(new Date(new Date().getTime() + (index * 24 * 60 * 60 * 1000)))}<br/>{(scheduleList[index]?.length??0) + "人"}
            </Button>
        );
    }

    const castIcon = (schedule: schedule, index: number) => {
        return (<Button key={"castbutton" + index} style={{flexDirection: "column"}} onClick={() => {
            window.open("https://x.com/" + schedule.castId);
        }}>
            <Avatar src={"/cast/" + schedule.castId + ".png" } alt={schedule.castName} style={{width: "60px", height: "60px"}}/>
            <>{schedule.castName}<br/>{dateToTimeString(schedule.startAt) + "~" + dateToTimeString(schedule.endAt)}</>
        </Button>)
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
        <div>
            {scheduleList[selected] && scheduleList[selected].map((schedule, index) => 
                castIcon(schedule, index)
            )}
        </div>
    </>);
}