CREATE DATABASE  IF NOT EXISTS `listerical_db`
USE `listerical_db`;

CREATE TABLE `dish` (
  `iddish` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_date` datetime NOT NULL,
  `food_type_base` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `calories_per_100_grams` int NOT NULL,
  PRIMARY KEY (`iddish`)
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `menu` (
  `idmenu` int NOT NULL AUTO_INCREMENT,
  `day_part` varchar(45) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`idmenu`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `menuid_dishid` (
  `idmenu` int NOT NULL,
  `iddish` int NOT NULL,
  PRIMARY KEY (`idmenu`,`iddish`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `userid` int NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(512) NOT NULL,
  `user_type` varchar(5) NOT NULL,
  PRIMARY KEY (`userid`,`username`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `listerical_db`.`user`
(`userid`,
`username`,
`password`,
`user_type`)
VALUES
(1,'admin',
'af97b945eb00404a511e789674fa61d21b79cd88f2f7f924f8535fade66025b19762fc315eb0b52036d3ae932a3393e8a01bef3264efa79398b8d7ae1f997b7e675028088fbc159532b8373beda7e711afda21b37dfe2381bd99f5580e76861d',
'admin'),
(2,'user',
'af97b945eb00404a511e789674fa61d21b79cd88f2f7f924f8535fade66025b19762fc315eb0b52036d3ae932a3393e8a01bef3264efa79398b8d7ae1f997b7e675028088fbc159532b8373beda7e711afda21b37dfe2381bd99f5580e76861d',
'user');
