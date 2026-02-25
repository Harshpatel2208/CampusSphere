    -- CampusSphere Complete Table Creation Script (PostgreSQL)
-- Run this script in the pgAdmin Query Tool to create all tables.

-- Drop existing schema if you want a clean start (WARNING: This deletes all data)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- CreateEnums
CREATE TYPE "Role" AS ENUM ('Student', 'Faculty', 'Admin');
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE "SubmissionStatus" AS ENUM ('Submitted', 'Not_Submitted');
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Leave');
CREATE TYPE "PaymentStatus" AS ENUM ('Paid', 'Pending', 'Partial');
CREATE TYPE "LeaveStatus" AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE "SeatingType" AS ENUM ('Classroom', 'Lab');
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- Create Tables

CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email" TEXT,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE "Parents" (
    "parent_id" SERIAL NOT NULL,
    "father_name" TEXT,
    "mother_name" TEXT,
    "contact_no" TEXT,
    "address" TEXT,
    "father_adhar_photo" TEXT,
    "mother_adhar_photo" TEXT,
    "father_email_id" TEXT,
    "mother_email_id" TEXT,
    CONSTRAINT "Parents_pkey" PRIMARY KEY ("parent_id")
);

CREATE TABLE "Faculty" (
    "faculty_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "designation" TEXT,
    "department" TEXT,
    "qualification" TEXT,
    "contact_no" TEXT,
    "seating_arrangement" "SeatingType",
    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("faculty_id")
);

CREATE TABLE "Divisions" (
    "division_id" SERIAL NOT NULL,
    "division_name" TEXT,
    "no_of_students" INTEGER NOT NULL DEFAULT 0,
    "faculty_id" INTEGER,
    CONSTRAINT "Divisions_pkey" PRIMARY KEY ("division_id")
);

CREATE TABLE "Students" (
    "student_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "parent_id" INTEGER,
    "division_id" INTEGER,
    "first_name" TEXT,
    "last_name" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "enrollment_date" TIMESTAMP(3),
    "contact_no" TEXT,
    "admission_year" INTEGER,
    "gender" "Gender",
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "blood_group" TEXT,
    "email_id" TEXT,
    "adhar_photo" TEXT,
    "result_12_photo" TEXT,
    "signature_photo" TEXT,
    CONSTRAINT "Students_pkey" PRIMARY KEY ("student_id")
);

CREATE TABLE "Assignments" (
    "assignment_id" SERIAL NOT NULL,
    "faculty_id" INTEGER,
    "student_id" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "due_date" TIMESTAMP(3),
    "submission_status" "SubmissionStatus" DEFAULT 'Not_Submitted',
    CONSTRAINT "Assignments_pkey" PRIMARY KEY ("assignment_id")
);

CREATE TABLE "Attendance" (
    "attendance_id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "date" TIMESTAMP(3),
    "status" "AttendanceStatus",
    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("attendance_id")
);

CREATE TABLE "Fees" (
    "fee_id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "total_amount" DECIMAL(10,2),
    "paid_amount" DECIMAL(10,2),
    "payment_status" "PaymentStatus",
    CONSTRAINT "Fees_pkey" PRIMARY KEY ("fee_id")
);

CREATE TABLE "Results" (
    "result_id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "subject_name" TEXT,
    "marks_obtained" DECIMAL(5,2),
    "total_marks" DECIMAL(5,2),
    "grade" TEXT,
    CONSTRAINT "Results_pkey" PRIMARY KEY ("result_id")
);

CREATE TABLE "Mentoring" (
    "mentoring_id" SERIAL NOT NULL,
    "faculty_id" INTEGER,
    "student_id" INTEGER,
    "meeting_date" TIMESTAMP(3),
    "notes" TEXT,
    CONSTRAINT "Mentoring_pkey" PRIMARY KEY ("mentoring_id")
);

CREATE TABLE "Messages" (
    "message_id" SERIAL NOT NULL,
    "sender_id" INTEGER,
    "receiver_id" INTEGER,
    "message_text" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Messages_pkey" PRIMARY KEY ("message_id")
);

CREATE TABLE "Leave_Requests" (
    "leave_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'Pending',
    CONSTRAINT "Leave_Requests_pkey" PRIMARY KEY ("leave_id")
);

CREATE TABLE "Seating_Arrangement" (
    "seating_id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "room_number" TEXT,
    "seat_number" INTEGER,
    "exam_name" TEXT,
    CONSTRAINT "Seating_Arrangement_pkey" PRIMARY KEY ("seating_id")
);

CREATE TABLE "Timetable" (
    "timetable_id" SERIAL NOT NULL,
    "division_id" INTEGER,
    "faculty_id" INTEGER,
    "subject_name" TEXT,
    "day_of_week" "DayOfWeek",
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("timetable_id")
);

-- Indexes and Constraints
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
CREATE UNIQUE INDEX "Students_user_id_key" ON "Students"("user_id");
CREATE UNIQUE INDEX "Faculty_user_id_key" ON "Faculty"("user_id");

-- Foreign Keys
ALTER TABLE "Divisions" ADD CONSTRAINT "Divisions_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Students" ADD CONSTRAINT "Students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Students" ADD CONSTRAINT "Students_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parents"("parent_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Students" ADD CONSTRAINT "Students_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Divisions"("division_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Fees" ADD CONSTRAINT "Fees_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Results" ADD CONSTRAINT "Results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Mentoring" ADD CONSTRAINT "Mentoring_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Mentoring" ADD CONSTRAINT "Mentoring_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Leave_Requests" ADD CONSTRAINT "Leave_Requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Seating_Arrangement" ADD CONSTRAINT "Seating_Arrangement_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Divisions"("division_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty_id") ON DELETE SET NULL ON UPDATE CASCADE;
