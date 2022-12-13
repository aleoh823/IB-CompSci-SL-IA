CREATE TABLE `volunteer` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `fName` varchar(45) NOT NULL,
  `lName` varchar(45) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(150) NOT NULL,
  `volunteers` int NOT NULL,
  `comment` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`)
)