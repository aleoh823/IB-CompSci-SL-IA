SELECT 
    event_id, event, DATE_FORMAT(date, "%m/%d/%y") as date, CONCAT(TIME_FORMAT(f_time, "%I:%i"), "-" , TIME_FORMAT(t_time, "%I:%i %p"))  as time, location, avail_slots, description
FROM
    event
ORDER BY
    date, time