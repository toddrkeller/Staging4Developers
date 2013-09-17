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
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetProgress')
   DROP PROCEDURE [GetProgress];
GO

CREATE PROCEDURE [dbo].[GetProgress]
	@Language NVARCHAR(50),
	@StudentID NVARCHAR(200)
AS
BEGIN
	SET NOCOUNT ON;
	
	SELECT LessonID, ActivityNumber, Progress, Duration
		FROM CourseProgress 
		WHERE [Language]=@Language
			AND StudentID=@StudentID
		ORDER BY LessonID, ActivityNumber

END

GO

GRANT Execute ON [GetProgress] TO iLearn_system;
GO