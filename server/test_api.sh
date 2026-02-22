#!/bin/bash
BASE="http://localhost:5001/api"

echo "============================================"
echo "   CampusSphere API - Full Test Suite"
echo "============================================"
echo ""

# 1. Health Check
echo "--- 1. HEALTH CHECK ---"
curl -s $BASE/health
echo -e "\n"

# 2. Register users (may already exist, that's OK)
echo "--- 2. REGISTER ADMIN ---"
curl -s -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_admin","password":"admin123","email":"tadmin@campus.com","role":"Admin"}'
echo -e "\n"

echo "--- 3. REGISTER FACULTY ---"
curl -s -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_faculty","password":"fac123","email":"tfac@campus.com","role":"Faculty"}'
echo -e "\n"

echo "--- 4. REGISTER STUDENT USER ---"
curl -s -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_student","password":"stu123","email":"tstu@campus.com","role":"Student"}'
echo -e "\n"

# 5. Login all users and extract tokens
echo "--- 5. LOGIN (Admin) ---"
LOGIN_ADMIN=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test_admin","password":"admin123"}')
echo "$LOGIN_ADMIN"
TOKEN=$(echo "$LOGIN_ADMIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
echo -e "\nAdmin Token: ${TOKEN:0:30}...\n"

echo "--- 5b. LOGIN (Faculty) ---"
LOGIN_FAC=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test_faculty","password":"fac123"}')
echo "$LOGIN_FAC"
FAC_TOKEN=$(echo "$LOGIN_FAC" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
echo -e "\n"

echo "--- 5c. LOGIN (Student) ---"
LOGIN_STU=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test_student","password":"stu123"}')
echo "$LOGIN_STU"
STU_TOKEN=$(echo "$LOGIN_STU" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
echo -e "\n"

# 6. Get Me
echo "--- 6. GET ME ---"
curl -s $BASE/auth/me -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 7. Unauthorized Access (no token)
echo "--- 7. UNAUTHORIZED ACCESS (no token) ---"
curl -s $BASE/students
echo -e "\n"

# 8. Create Parent
echo "--- 8. CREATE PARENT ---"
curl -s -X POST $BASE/parents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"father_name":"Raj Patel","mother_name":"Priya Patel","contact_no":"9876543210","address":"123 Main St"}'
echo -e "\n"

# 9. Create Division
echo "--- 9. CREATE DIVISION ---"
curl -s -X POST $BASE/divisions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"division_name":"CS-A","no_of_students":60}'
echo -e "\n"

# 10. Create Faculty Profile
echo "--- 10. CREATE FACULTY PROFILE ---"
curl -s -X POST $BASE/faculty \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"user_id":2,"designation":"Professor","department":"Computer Science","qualification":"PhD","contact_no":"9988776655"}'
echo -e "\n"

# 11. Create Student
echo "--- 11. CREATE STUDENT ---"
curl -s -X POST $BASE/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"user_id":3,"parent_id":1,"division_id":1,"first_name":"Aarav","last_name":"Sharma","gender":"Male","blood_group":"B+","email_id":"aarav@campus.com","admission_year":2024}'
echo -e "\n"

# 12. Get All Students
echo "--- 12. GET ALL STUDENTS ---"
curl -s $BASE/students -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 13. Get Student By ID
echo "--- 13. GET STUDENT BY ID (1) ---"
curl -s $BASE/students/1 -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 14. Create Attendance
echo "--- 14. CREATE ATTENDANCE ---"
curl -s -X POST $BASE/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"student_id":2,"date":"2026-02-21T00:00:00.000Z","status":"Present"}'
echo -e "\n"

# 15. Create Assignment
echo "--- 15. CREATE ASSIGNMENT ---"
curl -s -X POST $BASE/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"faculty_id":1,"student_id":2,"title":"Data Structures Lab 1","description":"Implement linked list","due_date":"2026-03-01T00:00:00.000Z"}'
echo -e "\n"

# 16. Create Fee Record
echo "--- 16. CREATE FEE RECORD ---"
curl -s -X POST $BASE/fees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"student_id":2,"total_amount":50000,"paid_amount":25000,"payment_status":"Partial"}'
echo -e "\n"

# 17. Create Result
echo "--- 17. CREATE RESULT ---"
curl -s -X POST $BASE/results \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"student_id":2,"subject_name":"Data Structures","marks_obtained":85,"total_marks":100,"grade":"A"}'
echo -e "\n"

# 18. Create Leave Request
echo "--- 18. CREATE LEAVE REQUEST ---"
curl -s -X POST $BASE/leave-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"user_id":3,"start_date":"2026-02-25T00:00:00.000Z","end_date":"2026-02-27T00:00:00.000Z","reason":"Family function"}'
echo -e "\n"

# 19. Create Message
echo "--- 19. SEND MESSAGE ---"
curl -s -X POST $BASE/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"sender_id":1,"receiver_id":3,"message_text":"Welcome to CampusSphere!"}'
echo -e "\n"

# 20. Create Timetable Entry
echo "--- 20. CREATE TIMETABLE ---"
curl -s -X POST $BASE/timetable \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"division_id":1,"faculty_id":1,"subject_name":"Data Structures","day_of_week":"Monday","start_time":"2026-01-01T09:00:00.000Z","end_time":"2026-01-01T10:00:00.000Z"}'
echo -e "\n"

# 21. Create Mentoring Session
echo "--- 21. CREATE MENTORING ---"
curl -s -X POST $BASE/mentoring \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"faculty_id":1,"student_id":2,"meeting_date":"2026-02-20T10:00:00.000Z","notes":"First mentoring session - discussed career goals"}'
echo -e "\n"

# 22. Create Seating Arrangement
echo "--- 22. CREATE SEATING ---"
curl -s -X POST $BASE/seating \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"student_id":2,"room_number":"101","seat_number":15,"exam_name":"Mid-Sem Exam"}'
echo -e "\n"

# 23. Get All with Filters
echo "--- 23. GET ATTENDANCE (filter by student) ---"
curl -s "$BASE/attendance?student_id=2" -H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "--- 24. GET TIMETABLE (filter by day) ---"
curl -s "$BASE/timetable?day_of_week=Monday" -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 25. Update Student
echo "--- 25. UPDATE STUDENT ---"
curl -s -X PUT $BASE/students/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"contact_no":"9998887776"}'
echo -e "\n"

# 26. Approve Leave Request
echo "--- 26. APPROVE LEAVE REQUEST ---"
curl -s -X PUT $BASE/leave-requests/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"Approved"}'
echo -e "\n"

# 27. Get All Users (Admin only)
echo "--- 27. GET ALL USERS (Admin) ---"
curl -s $BASE/users -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 28. Role Check - Student trying admin route
echo "--- 28. ROLE CHECK: Student trying to delete ---"
curl -s -X DELETE $BASE/students/2 -H "Authorization: Bearer $STU_TOKEN"
echo -e "\n"

# 29. Get All Divisions
echo "--- 29. GET ALL DIVISIONS ---"
curl -s $BASE/divisions -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 30. Get All Faculty
echo "--- 30. GET ALL FACULTY ---"
curl -s $BASE/faculty -H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "============================================"
echo "   ALL TESTS COMPLETE!"
echo "============================================"
