-- Make the event table
CREATE TABLE `event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event` varchar(150) NOT NULL,
  `date` date NOT NULL,
  `f_time` time NOT NULL,
  `t_time` time NOT NULL,
  `location` varchar(45) NOT NULL,
  `avail_slots` varchar(150) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`event_id`)
)