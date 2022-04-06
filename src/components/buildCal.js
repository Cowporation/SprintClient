export default function buildCalendar(value) {
    const startDay = value.clone().startOf("month").startOf("week");
    const endDay = value.clone().endOf("month").endOf("week");
    const day = startDay.clone().subtract(1, "day");
    const calendar = [];
    const totalWeekRows = 6;
    const end = endDay.date();
    function iendDay (end) {
        return endDay.add(end, "day");
    }
        while (day.isBefore(endDay, "day")) {
            calendar.push(
                Array(7).fill(0).map(() => day.add(1, "day").clone())
            );
            //Fill the gap in the panel (Panel can hold a total of 6 rows)
            const weekNum = calendar.length;
            if(end === day.date() && endDay.month() === day.month() && weekNum < totalWeekRows) {
                let rowsToFill =  totalWeekRows - weekNum;
                iendDay(rowsToFill * 7);
            }
        }
        return calendar;
}

