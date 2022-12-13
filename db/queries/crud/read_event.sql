SELECT 
    event, DATE_FORMAT(date, "%m/%d/%y") as date, f_time, t_time, location, avail_slots, description
FROM
    event
ORDER BY 
    event_id = ?