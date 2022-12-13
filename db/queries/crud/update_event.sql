UPDATE
    event
SET
    event = ?,
    date = ?,
    f_time = ?,
    t_time = ?,
    location = ?,
    avail_slots = ?,
    description = ?
WHERE
    event_id = ?