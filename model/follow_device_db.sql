-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: follow_device_db
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_device`
--

DROP TABLE IF EXISTS `t_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_device` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int NOT NULL COMMENT '医院id',
  `device_imei_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '设备imei',
  `device_reg_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '设备注册码',
  `is_update` int NOT NULL DEFAULT '1' COMMENT '是否更新 1=是 -1=否',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_device`
--

LOCK TABLES `t_device` WRITE;
/*!40000 ALTER TABLE `t_device` DISABLE KEYS */;
INSERT INTO `t_device` VALUES (15,9,'D1001','39492',1,'2024-11-15 09:01:50'),(16,9,'D1002','19985',1,'2024-11-15 09:02:00'),(17,8,'S0001','88795',1,'2024-11-15 09:02:19'),(18,8,'S0002','61607',1,'2024-11-15 09:02:29'),(19,9,'DSA323','40483',1,'2024-11-15 19:52:31'),(20,10,'DSAD23213','77160',1,'2024-11-15 22:14:07'),(21,10,'3213asda32213','bebd6588b2d0e6601fbf5719396ba09d',1,'2024-11-15 22:47:42'),(22,10,'DSAD2321DASDAS54DSF','19ced81007180ffa334f5fffec60db27',1,'2024-11-15 22:50:39'),(23,10,'DD345DFG45678YU','73cd76e470bb8f178eed711c13b1166c',1,'2024-11-15 22:51:12'),(24,10,'DD345DFG4567822','32724fdf647c5e5b072e6ec2992c34e5',1,'2024-11-15 22:51:26');
/*!40000 ALTER TABLE `t_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_hospital`
--

DROP TABLE IF EXISTS `t_hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_hospital` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `county` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_hospital`
--

LOCK TABLES `t_hospital` WRITE;
/*!40000 ALTER TABLE `t_hospital` DISABLE KEYS */;
INSERT INTO `t_hospital` VALUES (8,'石门山卫生所','张德贵','18809446038','甘肃省','武威市','古浪县','黄羊川镇石门山村','2024-11-15 09:00:13'),(9,'马圈滩卫生所','严文明','15002509828','甘肃省','武威市','古浪县','黄羊川镇马圈滩村','2024-11-15 09:01:32'),(10,'西大滩卫生院','张海珍','13919385601','甘肃省','武威市','天祝县','西大滩镇','2024-11-15 22:13:47');
/*!40000 ALTER TABLE `t_hospital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_hospital_config`
--

DROP TABLE IF EXISTS `t_hospital_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_hospital_config` (
  `hospital_id` int NOT NULL COMMENT '医院id',
  `api_url` varchar(255) DEFAULT NULL COMMENT '接口地址',
  `certificate_id` varchar(255) DEFAULT NULL COMMENT '证书编号',
  `public_key` varchar(500) DEFAULT NULL COMMENT '公匙信息',
  `private_key` varchar(500) DEFAULT NULL COMMENT '私匙信息',
  `ywjgdm` varchar(255) DEFAULT NULL COMMENT '医卫局码',
  `xtmc` varchar(255) DEFAULT NULL COMMENT '不知名参数',
  `jgid` varchar(255) DEFAULT NULL COMMENT '机构id',
  `create_time` datetime DEFAULT NULL,
  UNIQUE KEY `hospital_id` (`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_hospital_config`
--

LOCK TABLES `t_hospital_config` WRITE;
/*!40000 ALTER TABLE `t_hospital_config` DISABLE KEYS */;
INSERT INTO `t_hospital_config` VALUES (10,'dasdsadsadasdsadasdasd','888888888','dsadadsad4a545454521435454s5123213da4dsa4dsadsaddsa4dsadsadsadsada','','dsadsa','asdasda','123456','2024-11-17 13:14:43');
/*!40000 ALTER TABLE `t_hospital_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user`
--

DROP TABLE IF EXISTS `t_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `real_name` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `state` int DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user`
--

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;
INSERT INTO `t_user` VALUES (1,'xuxiwu','123456','徐希武','18809446038',0,'2024-11-15 20:44:32'),(2,'xuxiwu1','123456','徐希武','18809446038',0,'2024-11-15 21:04:01'),(3,'admin','123456','刘栋','13919385601',0,'2024-11-17 11:56:06');
/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_version`
--

DROP TABLE IF EXISTS `t_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_version` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int NOT NULL COMMENT '医院id',
  `version` varchar(255) DEFAULT NULL COMMENT '版本号',
  `code` varchar(255) DEFAULT NULL COMMENT '版本标识',
  `content` varchar(255) DEFAULT NULL COMMENT '更新内容',
  `url` varchar(255) DEFAULT NULL COMMENT '文件下载路径',
  `size` varchar(255) DEFAULT NULL COMMENT '文件大小',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_version`
--

LOCK TABLES `t_version` WRITE;
/*!40000 ALTER TABLE `t_version` DISABLE KEYS */;
INSERT INTO `t_version` VALUES (3,10,'1','1.0.0','的就撒开的吉萨的就撒开的吉萨的健身卡觉得凯撒简单快捷撒看到凯撒就肯定是肯定就撒开','1731731950867_193165653.jpg','89591','2024-11-16 12:39:14');
/*!40000 ALTER TABLE `t_version` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-17 13:35:51
