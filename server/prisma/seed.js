// Database seed script – populates demo data for the CampusSphere frontend
// Run: node prisma/seed.js

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...\n');

    // ── 1. Create users ──────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    const studentUser = await prisma.users.upsert({
        where: { username: 'brijesh' },
        update: {},
        create: { username: 'brijesh', email: 'brijesh@ldrp.ac.in', password_hash: hash, role: 'Student' },
    });

    const facultyUser = await prisma.users.upsert({
        where: { username: 'prof.shah' },
        update: {},
        create: { username: 'prof.shah', email: 'shah@ldrp.ac.in', password_hash: hash, role: 'Faculty' },
    });

    const faculty2User = await prisma.users.upsert({
        where: { username: 'dr.patel' },
        update: {},
        create: { username: 'dr.patel', email: 'patel@ldrp.ac.in', password_hash: hash, role: 'Faculty' },
    });

    console.log('✅ Users created');

    // ── 2. Create parent ────────────────────────────────────
    const parent = await prisma.parents.upsert({
        where: { parent_id: 1 },
        update: {},
        create: {
            father_name: 'Rajesh Patel',
            mother_name: 'Meena Patel',
            contact_no: '+91 98765 43210',
            address: '123, Navrangpura, Ahmedabad, Gujarat - 380009',
            father_email_id: 'rajesh.patel@gmail.com',
            mother_email_id: 'meena.patel@gmail.com',
        },
    });
    console.log('✅ Parent created');

    // ── 3. Create division ──────────────────────────────────
    const division = await prisma.divisions.upsert({
        where: { division_id: 1 },
        update: {},
        create: { division_name: 'CE-A', no_of_students: 60 },
    });
    console.log('✅ Division created');

    // ── 4. Create faculty records ──────────────────────────
    const faculty1 = await prisma.faculty.upsert({
        where: { user_id: facultyUser.user_id },
        update: {},
        create: {
            user_id: facultyUser.user_id,
            designation: 'Professor',
            department: 'Computer Engineering',
            qualification: 'PhD Computer Science',
            contact_no: '+91 98765 11111',
        },
    });

    const faculty2 = await prisma.faculty.upsert({
        where: { user_id: faculty2User.user_id },
        update: {},
        create: {
            user_id: faculty2User.user_id,
            designation: 'Associate Professor',
            department: 'Computer Engineering',
            qualification: 'PhD Machine Learning',
            contact_no: '+91 98765 22222',
        },
    });
    console.log('✅ Faculty created');

    // ── 5. Create student record ────────────────────────────
    const student = await prisma.students.upsert({
        where: { user_id: studentUser.user_id },
        update: {},
        create: {
            user_id: studentUser.user_id,
            parent_id: parent.parent_id,
            division_id: division.division_id,
            first_name: 'Brijesh',
            last_name: 'Patel',
            date_of_birth: new Date('2004-05-15'),
            enrollment_date: new Date('2022-08-01'),
            contact_no: '+91 98765 00000',
            admission_year: 2022,
            gender: 'Male',
            blood_group: 'B+',
            email_id: 'brijesh@ldrp.ac.in',
        },
    });
    console.log('✅ Student created');

    // ── 6. Seed attendance (subject-wise for 5 subjects) ───
    const subjects = ['Machine Learning', 'Cloud Computing', 'Software Engineering', 'Web Technologies', 'Cyber Security'];
    const totalClasses = 48;
    const attendedPerSubject = [42, 45, 40, 44, 38];

    // Clear old attendance
    await prisma.attendance.deleteMany({ where: { student_id: student.student_id } });

    for (let si = 0; si < subjects.length; si++) {
        for (let d = 0; d < totalClasses; d++) {
            const date = new Date('2025-08-01');
            date.setDate(date.getDate() + d * 2 + si); // spread dates
            await prisma.attendance.create({
                data: {
                    student_id: student.student_id,
                    date,
                    status: d < attendedPerSubject[si] ? 'Present' : 'Absent',
                },
            });
        }
    }
    console.log('✅ Attendance seeded (240 records)');

    // ── 7. Seed results ─────────────────────────────────────
    await prisma.results.deleteMany({ where: { student_id: student.student_id } });

    const marks = [
        { subject_name: 'Machine Learning', marks_obtained: 127, total_marks: 150, grade: 'A' },
        { subject_name: 'Cloud Computing', marks_obtained: 127, total_marks: 150, grade: 'A' },
        { subject_name: 'Software Engineering', marks_obtained: 136, total_marks: 150, grade: 'A+' },
        { subject_name: 'Web Technologies', marks_obtained: 124, total_marks: 150, grade: 'A' },
        { subject_name: 'Cyber Security', marks_obtained: 127, total_marks: 150, grade: 'A' },
    ];

    for (const m of marks) {
        await prisma.results.create({
            data: { student_id: student.student_id, ...m },
        });
    }
    console.log('✅ Results seeded');

    // ── 8. Seed assignments ─────────────────────────────────
    await prisma.assignments.deleteMany({ where: { student_id: student.student_id } });

    const assignments = [
        { title: 'Data Structures Lab Assignment', description: 'Implement Binary Search Tree operations', faculty_id: faculty1.faculty_id, due_date: new Date('2026-01-25'), submission_status: 'Not_Submitted' },
        { title: 'ML Model Training Report', description: 'Train and evaluate CNN model on CIFAR-10', faculty_id: faculty2.faculty_id, due_date: new Date('2026-01-28'), submission_status: 'Not_Submitted' },
        { title: 'Cloud Deployment Project', description: 'Deploy microservices on AWS ECS', faculty_id: faculty1.faculty_id, due_date: new Date('2026-02-05'), submission_status: 'Not_Submitted' },
        { title: 'SE Case Study Analysis', description: 'Analyze agile methodology case study', faculty_id: faculty2.faculty_id, due_date: new Date('2026-01-20'), submission_status: 'Submitted' },
        { title: 'Web Technologies Final Project', description: 'Build full-stack MERN application', faculty_id: faculty1.faculty_id, due_date: new Date('2026-02-10'), submission_status: 'Not_Submitted' },
        { title: 'Physics Experiment Report', description: 'Write report on optics experiment', faculty_id: faculty2.faculty_id, due_date: new Date('2026-02-05'), submission_status: 'Submitted' },
    ];

    for (const a of assignments) {
        await prisma.assignments.create({
            data: { student_id: student.student_id, ...a },
        });
    }
    console.log('✅ Assignments seeded');

    // ── 9. Seed leave requests ─────────────────────────────
    await prisma.leave_Requests.deleteMany({ where: { user_id: studentUser.user_id } });

    await prisma.leave_Requests.createMany({
        data: [
            { user_id: studentUser.user_id, start_date: new Date('2026-01-25'), end_date: new Date('2026-01-27'), reason: 'Medical checkup appointment', status: 'Pending' },
            { user_id: studentUser.user_id, start_date: new Date('2026-01-17'), end_date: new Date('2026-01-18'), reason: 'Fever and cold', status: 'Approved' },
            { user_id: studentUser.user_id, start_date: new Date('2026-01-10'), end_date: new Date('2026-01-10'), reason: 'Family function', status: 'Rejected' },
        ],
    });
    console.log('✅ Leave requests seeded');

    // ── 10. Seed fees ────────────────────────────────────────
    await prisma.fees.deleteMany({ where: { student_id: student.student_id } });

    await prisma.fees.create({
        data: { student_id: student.student_id, total_amount: 85000, paid_amount: 85000, payment_status: 'Paid' },
    });
    console.log('✅ Fees seeded');

    console.log('\n🎉 Seeding complete! Login as "brijesh" / "password123"');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
