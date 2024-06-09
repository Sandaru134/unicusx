CREATE DATABASE  IF NOT EXISTS `unicus_x` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `unicus_x`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: unicus_x
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_institutestosubjects`
--

DROP TABLE IF EXISTS `_institutestosubjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_institutestosubjects` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_InstitutesToSubjects_AB_unique` (`A`,`B`),
  KEY `_InstitutesToSubjects_B_index` (`B`),
  CONSTRAINT `_InstitutesToSubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_InstitutesToSubjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_institutestosubjects`
--

LOCK TABLES `_institutestosubjects` WRITE;
/*!40000 ALTER TABLE `_institutestosubjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `_institutestosubjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('f21c3aa3-66c9-43c9-90b1-1676dcd8292c','5cd0e80ff9d26945f2a38e8f165475587bd14c347ea6d107edd0d8614d4ddcc1','2024-06-08 17:05:38.525','20240608170528_init',NULL,NULL,'2024-06-08 17:05:28.068',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade_level` int NOT NULL,
  `class_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`class_id`),
  KEY `Classes_institute_id_fkey` (`institute_id`),
  CONSTRAINT `Classes_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `final_report`
--

DROP TABLE IF EXISTS `final_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `final_report` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `report_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `term_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` int DEFAULT NULL,
  `change` int DEFAULT NULL,
  `pass` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_marks` double DEFAULT NULL,
  `highest_total_mark` double NOT NULL,
  `total_students` int NOT NULL,
  `average` double NOT NULL,
  `rank` int DEFAULT NULL,
  `teacher_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_signed_date` datetime(3) DEFAULT NULL,
  `principal_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `principal_signed_date` datetime(3) DEFAULT NULL,
  `next_term_start_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Final_Report_report_id_fkey` (`report_id`),
  KEY `Final_Report_institute_id_fkey` (`institute_id`),
  KEY `Final_Report_student_id_fkey` (`student_id`),
  KEY `Final_Report_term_id_fkey` (`term_id`),
  KEY `Final_Report_subject_id_fkey` (`subject_id`),
  KEY `Final_Report_teacher_id_fkey` (`teacher_id`),
  KEY `Final_Report_principal_id_fkey` (`principal_id`),
  CONSTRAINT `Final_Report_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Final_Report_principal_id_fkey` FOREIGN KEY (`principal_id`) REFERENCES `principals` (`principal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Final_Report_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `report` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Final_Report_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Final_Report_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Final_Report_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Final_Report_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `terms` (`term_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `final_report`
--

LOCK TABLES `final_report` WRITE;
/*!40000 ALTER TABLE `final_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `final_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institute_admin`
--

DROP TABLE IF EXISTS `institute_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institute_admin` (
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `index` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`institute_id`),
  UNIQUE KEY `Institute_admin_institute_id_key` (`institute_id`),
  UNIQUE KEY `Institute_admin_index_key` (`index`),
  CONSTRAINT `Institute_admin_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institute_admin`
--

LOCK TABLES `institute_admin` WRITE;
/*!40000 ALTER TABLE `institute_admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `institute_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institute_subject_status`
--

DROP TABLE IF EXISTS `institute_subject_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institute_subject_status` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `Institute_subject_status_institute_id_fkey` (`institute_id`),
  KEY `Institute_subject_status_subject_id_fkey` (`subject_id`),
  CONSTRAINT `Institute_subject_status_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Institute_subject_status_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institute_subject_status`
--

LOCK TABLES `institute_subject_status` WRITE;
/*!40000 ALTER TABLE `institute_subject_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `institute_subject_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institute_user_sequence`
--

DROP TABLE IF EXISTS `institute_user_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institute_user_sequence` (
  `number` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institute_user_sequence`
--

LOCK TABLES `institute_user_sequence` WRITE;
/*!40000 ALTER TABLE `institute_user_sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `institute_user_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institutes`
--

DROP TABLE IF EXISTS `institutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institutes` (
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from` int NOT NULL,
  `to` int NOT NULL,
  `contact_number` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`institute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institutes`
--

LOCK TABLES `institutes` WRITE;
/*!40000 ALTER TABLE `institutes` DISABLE KEYS */;
/*!40000 ALTER TABLE `institutes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marks`
--

DROP TABLE IF EXISTS `marks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marks` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `term_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` int DEFAULT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `absent` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Marks_student_id_fkey` (`student_id`),
  KEY `Marks_subject_id_fkey` (`subject_id`),
  KEY `Marks_term_id_fkey` (`term_id`),
  KEY `Marks_class_id_fkey` (`class_id`),
  KEY `Marks_institute_id_fkey` (`institute_id`),
  CONSTRAINT `Marks_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Marks_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Marks_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Marks_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Marks_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `terms` (`term_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marks`
--

LOCK TABLES `marks` WRITE;
/*!40000 ALTER TABLE `marks` DISABLE KEYS */;
/*!40000 ALTER TABLE `marks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `principal_user_sequence`
--

DROP TABLE IF EXISTS `principal_user_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `principal_user_sequence` (
  `number` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `principal_user_sequence`
--

LOCK TABLES `principal_user_sequence` WRITE;
/*!40000 ALTER TABLE `principal_user_sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `principal_user_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `principals`
--

DROP TABLE IF EXISTS `principals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `principals` (
  `principal_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `index` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` int NOT NULL,
  `left` tinyint(1) NOT NULL DEFAULT '0',
  `date_of_resignation` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`principal_id`),
  UNIQUE KEY `Principals_index_key` (`index`),
  KEY `Principals_institute_id_fkey` (`institute_id`),
  CONSTRAINT `Principals_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `principals`
--

LOCK TABLES `principals` WRITE;
/*!40000 ALTER TABLE `principals` DISABLE KEYS */;
/*!40000 ALTER TABLE `principals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `term_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed` tinyint(1) DEFAULT '0',
  `class_teacher_signed` tinyint(1) DEFAULT '0',
  `teacher_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_signed` tinyint(1) DEFAULT '0',
  `total_marks` double DEFAULT NULL,
  `total_students` int DEFAULT NULL,
  `total_subjects` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Report_institute_id_fkey` (`institute_id`),
  KEY `Report_student_id_fkey` (`student_id`),
  KEY `Report_term_id_fkey` (`term_id`),
  KEY `Report_class_id_fkey` (`class_id`),
  KEY `Report_teacher_id_fkey` (`teacher_id`),
  CONSTRAINT `Report_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Report_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Report_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Report_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Report_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `terms` (`term_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_subjects_status`
--

DROP TABLE IF EXISTS `student_subjects_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_subjects_status` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `added` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Student_subjects_Status_student_id_fkey` (`student_id`),
  KEY `Student_subjects_Status_subject_id_fkey` (`subject_id`),
  KEY `Student_subjects_Status_institute_id_fkey` (`institute_id`),
  KEY `Student_subjects_Status_class_id_fkey` (`class_id`),
  CONSTRAINT `Student_subjects_Status_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Student_subjects_Status_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Student_subjects_Status_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Student_subjects_Status_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_subjects_status`
--

LOCK TABLES `student_subjects_status` WRITE;
/*!40000 ALTER TABLE `student_subjects_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_subjects_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_user_sequence`
--

DROP TABLE IF EXISTS `student_user_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_user_sequence` (
  `number` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_user_sequence`
--

LOCK TABLES `student_user_sequence` WRITE;
/*!40000 ALTER TABLE `student_user_sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_user_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `index` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medium` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guardian_nic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` int NOT NULL,
  `left` tinyint(1) NOT NULL DEFAULT '0',
  `date_of_resignation` datetime(3) DEFAULT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `Students_index_key` (`index`),
  KEY `Students_class_id_fkey` (`class_id`),
  KEY `Students_institute_id_fkey` (`institute_id`),
  CONSTRAINT `Students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Students_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_subjects`
--

DROP TABLE IF EXISTS `teacher_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subjects` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medium` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_subjects_teacher_id_fkey` (`teacher_id`),
  KEY `teacher_subjects_class_id_fkey` (`class_id`),
  KEY `teacher_subjects_subject_id_fkey` (`subject_id`),
  CONSTRAINT `teacher_subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_subjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_subjects_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_subjects`
--

LOCK TABLES `teacher_subjects` WRITE;
/*!40000 ALTER TABLE `teacher_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_user_sequence`
--

DROP TABLE IF EXISTS `teacher_user_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_user_sequence` (
  `number` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_user_sequence`
--

LOCK TABLES `teacher_user_sequence` WRITE;
/*!40000 ALTER TABLE `teacher_user_sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_user_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `teacher_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `index` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` int NOT NULL,
  `class_teacher` tinyint(1) NOT NULL DEFAULT '0',
  `subject_teacher` tinyint(1) NOT NULL DEFAULT '0',
  `left` tinyint(1) NOT NULL DEFAULT '0',
  `date_of_resignation` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `Teachers_index_key` (`index`),
  KEY `Teachers_institute_id_fkey` (`institute_id`),
  KEY `Teachers_class_id_fkey` (`class_id`),
  CONSTRAINT `Teachers_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Teachers_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term_class`
--

DROP TABLE IF EXISTS `term_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term_class` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_signed` tinyint(1) NOT NULL DEFAULT '0',
  `principal_signed` tinyint(1) NOT NULL DEFAULT '0',
  `teacher_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `term_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Term_class_institute_id_fkey` (`institute_id`),
  KEY `Term_class_teacher_id_fkey` (`teacher_id`),
  KEY `Term_class_principal_id_fkey` (`principal_id`),
  KEY `Term_class_term_id_fkey` (`term_id`),
  KEY `Term_class_class_id_fkey` (`class_id`),
  CONSTRAINT `Term_class_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Term_class_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Term_class_principal_id_fkey` FOREIGN KEY (`principal_id`) REFERENCES `principals` (`principal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Term_class_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Term_class_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `terms` (`term_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term_class`
--

LOCK TABLES `term_class` WRITE;
/*!40000 ALTER TABLE `term_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `term_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terms` (
  `term_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `term_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `end` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `institute_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`term_id`),
  KEY `Terms_institute_id_fkey` (`institute_id`),
  CONSTRAINT `Terms_institute_id_fkey` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`institute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms`
--

LOCK TABLES `terms` WRITE;
/*!40000 ALTER TABLE `terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unicus_admin`
--

DROP TABLE IF EXISTS `unicus_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unicus_admin` (
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `unicus_admin_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unicus_admin`
--

LOCK TABLES `unicus_admin` WRITE;
/*!40000 ALTER TABLE `unicus_admin` DISABLE KEYS */;
INSERT INTO `unicus_admin` VALUES ('USX1','$2b$10$iRK0ZXeC7EVylzByNqk1vubDpfX4icc4FRGcXjmUX1k00BUvaYKUK','admin',NULL);
/*!40000 ALTER TABLE `unicus_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unicus_user_sequence`
--

DROP TABLE IF EXISTS `unicus_user_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unicus_user_sequence` (
  `number` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unicus_user_sequence`
--

LOCK TABLES `unicus_user_sequence` WRITE;
/*!40000 ALTER TABLE `unicus_user_sequence` DISABLE KEYS */;
INSERT INTO `unicus_user_sequence` VALUES (1);
/*!40000 ALTER TABLE `unicus_user_sequence` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-08 22:51:23
