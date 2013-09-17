USE [iLearn]
GO

/****** Object:  Table [dbo].[answerCountAttempt]    Script Date: 04/02/2013 09:20:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[answerCountAttempt](
	[language] [nchar](10) NOT NULL,
	[lessonID] [int] NOT NULL,
	[activityID] [int] NOT NULL,
	[studentID] [nvarchar](100) NOT NULL,
	[questionID] [int] NOT NULL,
	[attemptCount] [int] NOT NULL,
	[activityType] [nchar](2) NOT NULL
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[answerCountAttempt] ADD  CONSTRAINT [DF_answerCountAttempt_activityType]  DEFAULT (N'hw') FOR [activityType]
GO


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
		INSERT INTO answerCountAttempt ([language], studentID, lessonID, activityID, questionID, attemptCount) 
		VALUES (@Language,
				@StudentID,
				@LessonID,
				@ActivityID,
				@QuestionID,
				@attemptCount)
	END
END

GO
