SELECT 
    event, date, time, location, avail_slots, description
FROM
    event
WHERE 
    event_id = ?