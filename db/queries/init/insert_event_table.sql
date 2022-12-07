-- Insert new row into event table
INSERT INTO `event` 
    (`event`, `date`, `time`, `location`, `avail_slots`, `description`) 
VALUES 
    (?, ?, ?, ?, ?, ?);