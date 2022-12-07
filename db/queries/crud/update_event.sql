UPDATE
    event
SET
    event = ?,
    date = ?,
    time = ?,
    location = ?,
    avail_slots = ?,
    description = ?
WHERE
    event_id = ?