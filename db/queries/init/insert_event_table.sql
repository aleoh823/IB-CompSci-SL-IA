-- Insert new row into event table
INSERT INTO `event` 
    (`event`, `date`, `f_time`, `t_time`, `location`, `avail_slots`, `description`) 
VALUES 
    (?, ?, ?, ?, ?, ?, ?);