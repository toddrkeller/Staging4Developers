USE [iLearn]
GO

/****** Object:  Table [dbo].[answerLog]    Script Date: 03/20/2013 10:36:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[answerLog](
	[language] [nchar](10) NOT NULL,
	[lessonID] [int] NOT NULL,
	[activityID] [int] NOT NULL,
	[studentID] [nvarchar](100) NOT NULL,
	[questionID] [int] NOT NULL,
	[studentAnswer] [text] NOT NULL,
	[contextID] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Index [uniqueKey]    Script Date: 03/20/2013 10:36:54 ******/
CREATE NONCLUSTERED INDEX [uniqueKey] ON [dbo].[answerLog] 
(
	[language] ASC,
	[lessonID] ASC,
	[activityID] ASC,
	[studentID] ASC,
	[questionID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO

CREATE TABLE [dbo].[answerLogContext](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[language] [nchar](10) NOT NULL,
	[lessonID] [int] NOT NULL,
	[activityID] [int] NOT NULL,
	[questionID] [int] NOT NULL,
	[context] [text] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

USE [iLearn]
GO

/****** Object:  Index [uniqueIndex]    Script Date: 03/20/2013 10:37:29 ******/
CREATE NONCLUSTERED INDEX [uniqueIndex] ON [dbo].[answerLogContext] 
(
	[language] ASC,
	[lessonID] ASC,
	[activityID] ASC,
	[questionID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
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
	@QuestionContext text
AS
BEGIN
	SET NOCOUNT ON;


	IF (EXISTS (SELECT [id] FROM [dbo].answerLogContext WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID))
	BEGIN
		UPDATE answerLogContext SET context=@QuestionContext
		WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID
	END
	ELSE
	BEGIN
		INSERT INTO answerLogContext ([language], lessonID, activityID, questionID, context) 
		VALUES (@Language,
				@LessonID,
				@ActivityID,
				@QuestionID,
				@QuestionContext)	
	END
	
	DECLARE @ContextID int;

	SET @ContextID = (SELECT id FROM answerLogContext WHERE [language]=@Language
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID);

	IF (EXISTS (SELECT lessonID FROM answerLog WHERE [language]=@Language
		AND studentID	= @StudentID
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
		AND questionID	= @QuestionID))
	BEGIN
		UPDATE answerLog SET studentAnswer=@StudentAnswer, contextID=@ContextID
		WHERE [language]=@Language
		AND studentID	= @StudentID
		AND lessonID	= @LessonID
		AND activityID	= @ActivityID 
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