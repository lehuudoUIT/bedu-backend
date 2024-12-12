INSERT INTO users (id, name, birthday, address, cid, email, phone, currentLevel, username, password, gender)
VALUES
(1, 'John Doe', '1990-01-01', '123 Elm St', '22520001', 'john.doe@example.com', '0367676767', 'Intermediate', 'johndoe', 'password123', 'Male'),
(2, 'Jane Smith', '1985-05-10', '456 Maple Ave', '22520002', 'jane.smith@example.com', '0345454545', 'Advanced', 'janesmith', 'password123', 'Female'),
(3, 'Robert Brown', '1992-08-15', '789 Oak Blvd', '22520003', 'robert.brown@example.com', '0787878787', 'Beginner', 'robertbrown', 'password123', 'Male'),
(4, 'Emily Davis', '1997-03-25', '321 Pine Ln', '22520004', 'emily.davis@example.com', '0398989898', 'Intermediate', 'emilydavis', 'password123', 'Female'),
(5, 'Michael Wilson', '1988-07-07', '654 Cedar Rd', '22520005', 'michael.wilson@example.com', '0523893333', 'Advanced', 'michaelwilson', 'password123', 'Male'),
(6, 'Sarah Taylor', '1993-09-19', '987 Birch Ct', '22520006', 'sarah.taylor@example.com', '0978333345', 'Beginner', 'sarahtaylor', 'password123', 'Female'),
(7, 'David Martinez', '1991-06-11', '654 Redwood Dr', '22520007', 'david.martinez@example.com', '0677778787', 'Intermediate', 'davidmartinez', 'password123', 'Male'),
(8, 'Linda Anderson', '1986-11-23', '789 Spruce St', '22520008', 'linda.anderson@example.com', '0454545678', 'Advanced', 'lindaanderson', 'password123', 'Female'),
(9, 'Christopher Moore', '1994-02-05', '123 Fir Pl', '22520009', 'christopher.moore@example.com', '0789877787', 'Intermediate', 'christophermoore', 'password123', 'Male'),
(10, 'Alice White', '1995-12-25', '321 Pine Ln', '225200010', 'alice.white@example.com', '0888878787', 'Advanced', 'alicewhite', 'password123', 'Female');

INSERT INTO classes (id, code, name, studyForm, startDate, description, lessonQuantity, timePerLesson, price, type, target_start, target_end)
VALUES
(1, 'CLS1', 'TOEIC Beginner Class', 'Online', '2024-01-10 09:00:00', 'Preparation for TOEIC beginners targeting 500-700 points', 10, 60, 5000000, 'toeic', 500, 700),
(2, 'CLS2', 'IELTS Foundation Class', 'Online', '2024-01-15 10:00:00', 'Introductory class for IELTS preparation targeting 0-5 bands', 12, 75, 6000000, 'ielts', 0, 5),
(3, 'CLS3', 'IELTS Intermediate Class', 'Online', '2024-02-01 14:00:00', 'English skills improvement for IELTS targeting 5-6.5 bands', 15, 90, 7000000, 'ielts', 5, 6.5),
(4, 'CLS4', 'IELTS Writing Skills Class', 'Online', '2024-03-01 16:00:00', 'Focus on writing techniques for IELTS', 8, 120, 8000000, 'ielts', 6, 7),
(5, 'CLS5', 'TOEIC Vocabulary Building', 'Online', '2024-03-15 13:00:00', 'Expand vocabulary for TOEIC targeting 0-700 points', 10, 60, 5500000, 'toeic', 0, 700),
(6, 'CLS6', 'TOEIC Listening and Reading', 'Online', '2024-04-10 11:00:00', 'Develop listening and reading skills for TOEIC targeting 500-990 points', 14, 80, 6500000, 'toeic', 500, 990),
(7, 'CLS7', 'TOEIC Advanced Strategies', 'Online', '2024-05-01 12:00:00', 'Advanced techniques for maximizing TOEIC scores targeting 0-990 points', 10, 90, 8500000, 'toeic', 0, 990),
(8, 'CLS8', 'IELTS Speaking Mastery', 'Online', '2024-05-15 14:00:00', 'Develop speaking proficiency for IELTS targeting 6-7.5 bands', 12, 60, 6000000, 'ielts', 6, 7.5),
(9, 'CLS9', 'IELTS Overall Preparation', 'Online', '2024-06-01 09:00:00', 'Comprehensive preparation for IELTS targeting 5-8 bands', 18, 100, 9500000, 'ielts', 5, 8),
(10, 'CLS10', 'TOEIC Full Test Practice', 'Online', '2024-06-15 10:00:00', 'Practice full TOEIC tests targeting 600-990 points', 10, 60, 5000000, 'toeic', 600, 990);

INSERT INTO programs (id, code, title, description, sessionQuantity, isActive, type, target_start, target_end)
VALUES
(1, 'PRG1', 'TOEIC Beginner Course', 'Introduction to toeic test format and strategies', 30, 1, 'toeic', 200, 500),
(2, 'PRG2', 'TOEIC Intermediate Course', 'Intermediate-level toeic preparation', 40, 1, 'toeic', 500, 700),
(3, 'PRG3', 'TOEIC Advanced Course', 'Advanced strategies for toeic', 50, 1, 'toeic', 700, 900),
(4, 'PRG4', 'IELTS Foundation', 'Introduction to ielts test modules and strategies', 25, 1, 'ielts', 3, 5),
(5, 'PRG5', 'IELTS Intermediate', 'Improving ielts test skills for intermediate level', 35, 1, 'ielts', 5, 6.5),
(6, 'PRG6', 'IELTS Advanced', 'Mastering advanced ielts test strategies', 40, 1, 'ielts', 6.5, 8),
(7, 'PRG7', 'TOEIC Crash Course', 'Quick prep for toeic exam', 20, 1, 'toeic', 400, 600),
(8, 'PRG8', 'IELTS Writing Focus', 'Improving writing skills for ielts', 30, 1, 'ielts', 5, 6.5),
(9, 'PRG9', 'TOEIC Speaking Mastery', 'Focused practice on toeic speaking section', 25, 1, 'toeic', 300, 550),
(10, 'PRG10', 'IELTS Speaking Skills', 'Mastering speaking skills for ielts', 30, 1, 'ielts', 6, 7.5);

INSERT INTO courses (id, courseType, code, title, description, image, lessonQuantity, timePerLesson, price)
VALUES
(1, 'Online', 'CRS1', 'TOEIC Listening & Reading', 'Develop essential listening and reading skills for TOEIC exams', 'toeic_listening_reading.jpg', 12, 90, 1500000),
(2, 'Online', 'CRS2', 'IELTS Writing Techniques', 'Improve writing skills for IELTS exams', 'ielts_writing.jpg', 10, 75, 1200000),
(3, 'Offline', 'CRS3', 'IELTS Speaking Masterclass', 'Master the art of speaking confidently in IELTS exams', 'ielts_speaking.jpg', 8, 60, 1300000),
(4, 'Hybrid', 'CRS4', 'IELTS Preparation Comprehensive', 'A comprehensive course for preparing all IELTS modules', 'ielts_preparation.jpg', 18, 120, 2000000),
(5, 'Online', 'CRS5', 'TOEIC Vocabulary Workshop', 'Expand vocabulary for achieving high TOEIC scores', 'toeic_vocabulary.jpg', 10, 60, 1000000),
(6, 'Offline', 'CRS6', 'TOEIC Grammar Essentials', 'Review essential grammar rules for TOEIC exams', 'toeic_grammar.jpg', 14, 90, 1100000),
(7, 'Hybrid', 'CRS7', 'IELTS Listening Skills', 'Enhance listening skills for IELTS exams', 'ielts_listening.jpg', 12, 80, 1400000),
(8, 'Online', 'CRS8', 'TOEIC Practice Tests', 'Practice full-length TOEIC exams for score improvement', 'toeic_practice_tests.jpg', 15, 100, 1250000),
(9, 'Offline', 'CRS9', 'IELTS Reading Strategies', 'Learn strategies to tackle IELTS reading sections effectively', 'ielts_reading.jpg', 10, 75, 1200000),
(10, 'Online', 'CRS10', 'TOEIC Advanced Techniques', 'Advanced strategies for achieving top scores in TOEIC', 'toeic_advanced.jpg', 20, 90, 1800000);

INSERT INTO programs_courses (programsId, coursesId)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 9),
(5, 10);

INSERT INTO documents (id, code, documentType, title, content, attachFile, isActive)
VALUES
(1, 'DOC1', 'PDF', 'TOEIC Listening Guide', 'Comprehensive guide for TOEIC listening skills', 'toeic_listening_guide.pdf', 1),
(2, 'DOC2', 'PDF', 'IELTS Writing Samples', 'Examples and tips for IELTS writing tasks', 'ielts_writing_samples.pdf', 1),
(3, 'DOC3', 'Word', 'TOEIC Vocabulary List', 'Extensive vocabulary list for TOEIC preparation', 'toeic_vocabulary_list.docx', 1),
(4, 'DOC4', 'PDF', 'IELTS Reading Strategies', 'Techniques for improving IELTS reading scores', 'ielts_reading_strategies.pdf', 1),
(5, 'DOC5', 'PowerPoint', 'IELTS Speaking Techniques', 'Presentation on improving IELTS speaking', 'ielts_speaking_techniques.pptx', 1),
(6, 'DOC6', 'PDF', 'TOEIC Grammar Review', 'Grammar rules and exercises for TOEIC', 'toeic_grammar_review.pdf', 1),
(7, 'DOC7', 'PDF', 'TOEIC Practice Tests', 'Full-length practice tests for TOEIC', 'toeic_practice_tests.pdf', 1),
(8, 'DOC8', 'PDF', 'IELTS Listening Exercises', 'Sample exercises for IELTS listening module', 'ielts_listening_exercises.pdf', 1),
(9, 'DOC9', 'PDF', 'TOEIC Advanced Tips', 'Advanced techniques for achieving high TOEIC scores', 'toeic_advanced_tips.pdf', 1),
(10, 'DOC10', 'Word', 'IELTS Essay Templates', 'Templates for IELTS essay writing tasks', 'ielts_essay_templates.docx', 1);

INSERT INTO lessons (id, startDate, endDate, type, videoUrl, classId, examId, teacherId, courseId, isActive)
VALUES
(1, '2024-01-10 09:00:00', '2024-01-10 10:00:00', 'Online', 'lesson1.mp4', 1, NULL, 1, 1, 1),
(2, '2024-01-15 10:00:00', '2024-01-15 11:15:00', 'Offline', 'lesson2.mp4', 2, NULL, 2, 2, 1),
(3, '2024-02-01 14:00:00', '2024-02-01 15:30:00', 'Online', 'lesson3.mp4', 3, NULL, 3, 3, 1),
(4, '2024-03-01 16:00:00', '2024-03-01 18:00:00', 'Hybrid', 'lesson4.mp4', 4, NULL, 4, 4, 1),
(5, '2024-03-15 13:00:00', '2024-03-15 14:00:00', 'Offline', 'lesson5.mp4', 5, NULL, 5, 5, 1),
(6, '2024-04-10 11:00:00', '2024-04-10 12:20:00', 'Online', 'lesson6.mp4', 6, NULL, 6, 6, 1),
(7, '2024-05-01 12:00:00', '2024-05-01 13:30:00', 'Online', 'lesson7.mp4', NULL, 7, 7, 7, 1),
(8, '2024-05-15 14:00:00', '2024-05-15 15:00:00', 'Offline', 'lesson8.mp4', NULL, 8, 8, 8, 1),
(9, '2024-06-01 09:00:00', '2024-06-01 10:40:00', 'Hybrid', 'lesson9.mp4', NULL, 9, 9, 9, 1),
(10, '2024-06-15 10:00:00', '2024-06-15 11:00:00', 'Offline', 'lesson10.mp4', NULL, 10, 10, 10, 1);


INSERT INTO answer (id, userId, examId, questionId, content, points, isActive)
VALUES
(1, 1, 1, 1, 'The answer is 4.', 5, 1),
(2, 2, 2, 2, 'Relativity explains the relationship between time and space.', 10, 1),
(3, 3, 3, 3, 'Present Continuous tense is used for ongoing actions.', 5, 1),
(4, 4, 4, 4, 'Factorial function implemented as expected.', 15, 1),
(5, 5, 5, 5, 'False - The Earth is round.', 2, 1),
(6, 6, 6, 6, 'The pH of the solution is neutral (pH 7).', 8, 1),
(7, 7, 7, 7, 'B2B focuses on businesses, while B2C focuses on consumers.', 10, 1),
(8, 8, 8, 8, 'Presented a portfolio with design samples.', 20, 1),
(9, 9, 9, 9, 'Website developed with basic HTML and CSS.', 25, 1),
(10, 10, 10, 10, 'The melody is in C Major.', 5, 1);

INSERT INTO attendances (id, userId, lessonId, time, isActive)
VALUES
(1, 1, 1, '2024-01-10 09:00:00', 1),
(2, 2, 2, '2024-01-15 10:00:00', 1),
(3, 3, 3, '2024-02-01 14:00:00', 1),
(4, 4, 4, '2024-03-01 16:00:00', 1),
(5, 5, 5, '2024-03-15 13:00:00', 1),
(6, 6, 6, '2024-04-10 11:00:00', 1),
(7, 7, 7, '2024-05-01 12:00:00', 1),
(8, 8, 8, '2024-05-15 14:00:00', 1),
(9, 9, 9, '2024-06-01 09:00:00', 1),
(10, 10, 10, '2024-06-15 10:00:00', 1);

INSERT INTO comments (id, content, `left`, `right`, parentId, lessonId, userId, isDeleted, isActive)
VALUES
(1, 'Great lesson!', 1, 2, NULL, 1, 1, 0, 1),
(2, 'Very informative.', 3, 4, NULL, 2, 2, 0, 1),
(3, 'I loved the examples.', 5, 6, 1, 1, 3, 0, 1),
(4, 'Can you clarify this part?', 7, 8, 2, 2, 4, 0, 1),
(5, 'Well structured lesson.', 9, 10, NULL, 3, 5, 0, 1),
(6, 'I need more practice materials.', 11, 12, 3, 4, 6, 0, 1),
(7, 'Amazing teaching style!', 13, 14, NULL, 5, 7, 0, 1),
(8, 'What about advanced topics?', 15, 16, 5, 6, 8, 0, 1),
(9, 'Very helpful resources.', 17, 18, 4, 7, 9, 0, 1),
(10, 'Looking forward to the next lesson!', 19, 20, NULL, 8, 10, 0, 1);

INSERT INTO exams (id, title, examType, duration, maxTries, resultTime, description, isActive)
VALUES
(1, 'TOEIC Listening Test', 'toeic', 120, 3, 7, 'Listening comprehension test for TOEIC.', 1),
(2, 'TOEIC Reading Test', 'toeic', 120, 3, 7, 'Reading comprehension test for TOEIC.', 1),
(3, 'IELTS Listening Test', 'ielts', 40, 1, 5, 'Listening test for IELTS.', 1),
(4, 'IELTS Reading Test', 'ielts', 60, 1, 5, 'Reading test for IELTS.', 1),
(5, 'IELTS Writing Test', 'ielts', 60, 1, 5, 'Writing test for IELTS.', 1),
(6, 'TOEIC Full Practice Test', 'toeic', 180, 2, 7, 'Complete TOEIC mock test.', 1),
(7, 'IELTS Speaking Test', 'ielts', 15, 1, 2, 'Speaking test for IELTS.', 1),
(8, 'TOEIC Grammar Practice', 'toeic', 90, 2, 7, 'Grammar-focused practice for TOEIC.', 1),
(9, 'IELTS Band Score Assessment', 'ielts', 120, 1, 5, 'Overall band score assessment for IELTS.', 1),
(10, 'TOEIC Vocabulary Review', 'toeic', 60, 3, 7, 'Vocabulary review session for TOEIC.', 1);

INSERT INTO documents_questions (documentsId, questionsId)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO exams_questions (examsId, questionsId)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO lessons_documents (id, lessonId, documentId, time, isActive)
VALUES
(1, 1, 1, '2024-01-10 09:00:00', 1),
(2, 2, 2, '2024-01-15 10:00:00', 1),
(3, 3, 3, '2024-02-01 14:00:00', 1),
(4, 4, 4, '2024-03-01 16:00:00', 1),
(5, 5, 5, '2024-03-15 13:00:00', 1),
(6, 6, 6, '2024-04-10 11:00:00', 1),
(7, 7, 7, '2024-05-01 12:00:00', 1),
(8, 8, 8, '2024-05-15 14:00:00', 1),
(9, 9, 9, '2024-06-01 09:00:00', 1),
(10, 10, 10, '2024-06-15 10:00:00', 1);

INSERT INTO payments (id, userId, programId, classId, amount, method, transactionId, isActive)
VALUES
(1, 1, 1, 1, 5000000, 'Credit Card', 'TXN001', 1),
(2, 2, 2, 2, 6000000, 'Paypal', 'TXN002', 1),
(3, 3, 3, 3, 7000000, 'Bank Transfer', 'TXN003', 1),
(4, 4, 4, 4, 8000000, 'Cash', 'TXN004', 1),
(5, 5, 5, 5, 5500000, 'Credit Card', 'TXN005', 1),
(6, 6, 6, 6, 6500000, 'Paypal', 'TXN006', 1),
(7, 7, 7, 7, 8500000, 'Bank Transfer', 'TXN007', 1),
(8, 8, 8, 8, 6000000, 'Cash', 'TXN008', 1),
(9, 9, 9, 9, 9500000, 'Credit Card', 'TXN009', 1),
(10, 10, 10, 10, 12500000, 'Paypal', 'TXN010', 1);

INSERT INTO reports (id, userId, totalPayment, reportType, isActive)
VALUES
(1, 1, 50000000, 'Payment Report', 1),
(2, 2, 60000000, 'Payment Report', 1),
(3, 3, 70000000, 'Payment Report', 1),
(4, 4, 80000000, 'Payment Report', 1),
(5, 5, 55000000, 'Payment Report', 1),
(6, 6, 65000000, 'Payment Report', 1),
(7, 7, 85000000, 'Payment Report', 1),
(8, 8, 60000000, 'Payment Report', 1),
(9, 9, 95000000, 'Payment Report', 1),
(10, 10, 125000000, 'Payment Report', 1);

INSERT INTO scores (id, userId, examId, totalScore, description, isActive)
VALUES
(1, 1, 1, 800, 'TOEIC Mock Test 1', 1),
(2, 2, 2, 7.0, 'IELTS Academic Writing Test', 1),
(3, 3, 3, 750, 'TOEIC Listening and Reading Test', 1),
(4, 4, 4, 6.5, 'IELTS Speaking Test', 1),
(5, 5, 5, 820, 'TOEIC Mock Test 2', 1),
(6, 6, 6, 8.0, 'IELTS Overall Band Score', 1),
(7, 7, 7, 790, 'TOEIC Final Practice Test', 1),
(8, 8, 8, 7.5, 'IELTS Listening Test', 1),
(9, 9, 9, 860, 'TOEIC Full Test', 1),
(10, 10, 10, 6.0, 'IELTS Reading and Writing Test', 1);

INSERT INTO users_classes (id, userId, classId, time, isActive)
VALUES
(1, 1, 1, '2024-01-10 09:00:00', 1),
(2, 2, 2, '2024-01-15 10:00:00', 1),
(3, 3, 3, '2024-02-01 14:00:00', 1),
(4, 4, 4, '2024-03-01 16:00:00', 1),
(5, 5, 5, '2024-03-15 13:00:00', 1),
(6, 6, 6, '2024-04-10 11:00:00', 1),
(7, 7, 7, '2024-05-01 12:00:00', 1),
(8, 8, 8, '2024-05-15 14:00:00', 1),
(9, 9, 9, '2024-06-01 09:00:00', 1),
(10, 10, 10, '2024-06-15 10:00:00', 1);

INSERT INTO notifications (id, type, receiverId, senderId, content, options, isActive)
VALUES
(1, 'ACCOUNT-001', 1, 2, 'Welcome Notification', '', 1),
(2, 'ACCOUNT-002', 2, 3, 'Password Changed', '', 1),
(3, 'ACCOUNT-003', 3, 4, 'Profile Updated', '', 1),
(4, 'ACCOUNT-004', 4, 5, 'Account Deactivated', '', 1),
(5, 'COURSE-001', 5, 6, 'New Course Release', '', 1),
(6, 'PAYMENT-001', 6, 7, 'Payment Successful', '', 1),
(7, 'PAYMENT-002', 7, 8, 'Payment Failed', '', 1),
(8, 'EXAM-001', 8, 9, 'Upcoming Exam Reminder', '', 1),
(9, 'EXAM-002', 9, 10, 'Exam Results Released', '', 1),
(11, 'GENERAL-001', 10, 1, 'System Maintenance Alert', '', 1),
(12, 'GENERAL-002', 10, 1, 'Feedback Reminder', '', 1),
(13, 'CLASS-001', 10, 1, 'Upcoming Class Reminder', '', 1),
(14, 'CLASS-002', 10, 1, 'Class Cancel', '', 1),
(15, 'CLASS-003', 10, 1, '', '', 1);

INSERT INTO users_programs (id, userId, programId, time, isActive)
VALUES
(1, 1, 1, '2024-01-10 09:00:00', 1),
(2, 2, 2, '2024-01-15 10:00:00', 1),
(3, 3, 3, '2024-02-01 14:00:00', 1),
(4, 4, 4, '2024-03-01 16:00:00', 1),
(5, 5, 5, '2024-03-15 13:00:00', 1),
(6, 6, 6, '2024-04-10 11:00:00', 1),
(7, 7, 7, '2024-05-01 12:00:00', 1),
(8, 8, 8, '2024-05-15 14:00:00', 1),
(9, 9, 9, '2024-06-01 09:00:00', 1),
(10, 10, 10, '2024-06-15 10:00:00', 1);

INSERT INTO lessons_documents (id, lessonId, documentId, time, isActive)
VALUES
(1, 1, 1, '2024-01-10 09:00:00', 1),
(2, 2, 2, '2024-01-15 10:00:00', 1),
(3, 3, 3, '2024-02-01 14:00:00', 1),
(4, 4, 4, '2024-03-01 16:00:00', 1),
(5, 5, 5, '2024-03-15 13:00:00', 1),
(6, 6, 6, '2024-04-10 11:00:00', 1),
(7, 7, 7, '2024-05-01 12:00:00', 1),
(8, 8, 8, '2024-05-15 14:00:00', 1),
(9, 9, 9, '2024-06-01 09:00:00', 1),
(10, 10, 10, '2024-06-15 10:00:00', 1);