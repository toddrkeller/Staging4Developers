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
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetLessons')
   DROP PROCEDURE [GetLessons];
GO

CREATE PROCEDURE [dbo].[GetLessons]
	@Language NVARCHAR(50),
	@Unit tinyint
AS
BEGIN
	SET NOCOUNT ON;
	
	SELECT u.unitNumber, u.title AS UnitTitle, l.lessonNumber, l.title AS LessonTitle, l.lessonType AS LessonType
		FROM unit u, lesson l
		WHERE u.unitNumber = l.unit AND u.unitNumber = @Unit
		ORDER BY u.unitNumber, l.lessonNumber

END

GO

GRANT Execute ON [GetLessons] TO iLearn_system;
GO