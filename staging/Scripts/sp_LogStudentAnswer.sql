USE [iLearn]
GO

/****** Object:  StoredProcedure [dbo].[WriteProgress]    Script Date: 11/15/2012 11:00:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		David Neff
-- Create date: March 19, 2013
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'LogStudentAnswer')
   DROP PROCEDURE [LogStudentAnswer];
GO

CREATE PROCEDURE [dbo].[LogStudentAnswer]
	@Language NVARCHAR(50),
	@StudentID NVARCHAR(200),
	@LessonID smallint,
	@ActivityID smallint,
	@QuestionID smallint,
	@StudentAnswer text,
	@QuestionContext text,
	@ActivityType NVARCHAR(5)
AS
BEGIN
	SET NOCOUNT ON;


	IF (EXISTS (SELECT [id] FROM [dbo].answerLogContext WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID
		AND activityType = @ActivityType))
	BEGIN
		UPDATE answerLogContext SET context=@QuestionContext
		WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID
		AND activityType = @ActivityType
	END
	ELSE
	BEGIN
		INSERT INTO answerLogContext ([language], lessonID, activityID, questionID, context, activityType) 
		VALUES (@Language,
				@LessonID,
				@ActivityID,
				@QuestionID,
				@QuestionContext,
				@ActivityType)	
	END
	
	DECLARE @ContextID int;

	SET @ContextID = (SELECT id FROM answerLogContext WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID);

	IF (EXISTS (SELECT lessonID FROM answerLog WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND studentID	= @StudentID
		AND questionID	= @QuestionID))
	BEGIN
		UPDATE answerLog SET studentAnswer=@StudentAnswer, contextID=@ContextID
		WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND studentID	= @StudentID
		AND questionID	= @QuestionID
	END
	ELSE
	BEGIN
		INSERT INTO answerLog ([language], studentID, lessonID, activityID, questionID, studentAnswer, contextID) 
		VALUES (@Language,
				@StudentID,
				@LessonID,
				@ActivityID,
				@QuestionID,
				@StudentAnswer,
				@ContextID)
	END
END

GO

GRANT Execute ON [LogStudentAnswer] TO iLearn_system;
GO