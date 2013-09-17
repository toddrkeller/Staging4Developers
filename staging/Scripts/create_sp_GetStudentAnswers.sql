USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 4/03/13
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetStudentAnswers')
   DROP PROCEDURE [GetStudentAnswers];
GO

CREATE PROCEDURE [dbo].[GetStudentAnswers]
	@Language [nvarchar](2),
	@LessonID smallint,
	@ActivityID smallint,
	@ClassID int
AS
BEGIN
	SET NOCOUNT ON;

--DECLARE @Language [nvarchar](2);
--DECLARE @LessonID smallint;
--DECLARE @ActivityID smallint;
--DECLARE @ClassID int;

--SET @Language = 'ja';
--SET @LessonID = 1;
--SET @ActivityID = 1;
--SET @ClassID = 4;
        
	SELECT u.lastName + ', ' + u.firstName as studentName, a.studentID, a.questionID, a.studentAnswer AS Answer, c.context, c.activityType, sc.ClassID
	FROM answerLog a JOIN student_classes sc on a.studentID=sc.StudentEmail, answerLogContext c, [user] u
	WHERE a.contextID = c.id AND sc.ClassID = @ClassID AND a.studentID=u.userID
	AND a.[language] = @Language 
	AND a.lessonID = @LessonID
	AND a.activityID = @ActivityID
	ORDER BY a.questionID, a.studentID

END
GO

GRANT Execute ON [GetStudentAnswers] TO iLearn_system;
GO