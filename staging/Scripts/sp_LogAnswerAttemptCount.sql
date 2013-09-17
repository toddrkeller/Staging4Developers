USE [iLearn]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		David Neff
-- Create date: March 26, 2013
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'LogAnswerAttemptCount')
   DROP PROCEDURE [LogAnswerAttemptCount];
GO

CREATE PROCEDURE [dbo].[LogAnswerAttemptCount]
	@Language NVARCHAR(50),
	@StudentID NVARCHAR(200),
	@LessonID smallint,
	@ActivityID smallint,
	@QuestionID smallint,
	@AttemptCount int,
	@ActivityType NVARCHAR(5)	
AS
BEGIN
	SET NOCOUNT ON;

--DECLARE @Language nvarchar(50);
--DECLARE @StudentID nvarchar(200);
--DECLARE @LessonID smallint;
--DECLARE @ActivityID smallint;
--DECLARE @ActivityType nvarchar(5);
--DECLARE @QuestionID smallint;
--DECLARE @AttemptCount smallint;

--SET @AttemptCount = 3;
--SET @Language  = 'ja';
--SET @StudentID  = 'dneff68@gmail.com';
--SET @LessonID  = 0;
--SET @ActivityID  = 0;
--SET @ActivityType  = 'cl';
--SET @QuestionID  = 0;

	IF (EXISTS (SELECT lessonID FROM answerCountAttempt WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND studentID	= @StudentID
		AND questionID	= @QuestionID
		AND activityType = @ActivityType))
	BEGIN
		UPDATE answerCountAttempt SET attemptCount=@AttemptCount
		WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND studentID	= @StudentID
		AND questionID	= @QuestionID
		AND activityType = @ActivityType
	END
	ELSE
	BEGIN	
		INSERT INTO answerCountAttempt ([language], studentID, lessonID, activityID, questionID, attemptCount, activityType) 
		VALUES (@Language,
				@StudentID,
				@LessonID,
				@ActivityID,
				@QuestionID,
				@attemptCount,
				@activityType)
	END
END

GO

GRANT Execute ON [LogAnswerAttemptCount] TO iLearn_system;
GO