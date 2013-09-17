USE [iLearn]
GO

/****** Object:  StoredProcedure [dbo].[WriteProgress]    Script Date: 11/15/2012 11:00:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		David Neff
-- Create date: Nov 15, 2012
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'WriteProgress')
   DROP PROCEDURE [WriteProgress];
GO

CREATE PROCEDURE [dbo].[WriteProgress]
	@Language NVARCHAR(50),
	@StudentID NVARCHAR(200),
	@LessonID INT,
	@ActivityNumber smallint,
	@Progress smallint,
	@Duration int
AS
BEGIN
	SET NOCOUNT ON;

	IF (EXISTS (SELECT LessonID FROM CourseProgress WHERE [Language]=@Language
		AND StudentID=@StudentID
		AND LessonID=@LessonID
		AND ActivityNumber=@ActivityNumber))
	BEGIN
		UPDATE CourseProgress SET Progress=@Progress, Duration=@Duration
		WHERE [Language]=@Language
		AND StudentID=@StudentID
		AND LessonID=@LessonID
		AND ActivityNumber=@ActivityNumber
	END
	ELSE
	BEGIN
		INSERT INTO CourseProgress ([Language], StudentID, LessonID, ActivityNumber, Progress, Duration) 
		VALUES (@Language,
				@StudentID,
				@LessonID,
				@ActivityNumber,
				@Progress,
				@Duration)
	END
END

GO

GRANT Execute ON [WriteProgress] TO iLearn_system;
GO