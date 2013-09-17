USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 4/16/12
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetClasses')
   DROP PROCEDURE [GetClasses];
GO

CREATE PROCEDURE [dbo].[GetClasses]
	@Active int = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	-- SELECT distinct c.ClassID, c.Title, c.[Description], u.LastName + ', ' + u.FirstName as Instructor, u.email as InstructorEmail
	--SELECT A.ClassID, A.Title, A.[Description], A.email as InstructorEmail, u.LastName + ', ' + u.FirstName as Instructor FROM (
	--SELECT distinct c.ClassID, c.Title, c.[Description], i.InstructorEmail as email
	--FROM [class] c LEFT OUTER JOIN [instructor_classes] i ON c.ClassID = i.ClassID
	-- ) A LEFT OUTER JOIN [user] u ON A.email = u.email
	--ORDER BY ClassID

	IF (@Active IS NULL)
	BEGIN
		SELECT distinct c.ClassID, c.Title, c.[Description], c.ClassCode, c.Active
		FROM [class] c
		WHERE Active = 1
		ORDER BY c.ClassCode
	END
	ELSE
	BEGIN
		SELECT distinct c.ClassID, c.Title, c.[Description], c.ClassCode, c.Active
		FROM [class] c
		WHERE Active = @Active
		ORDER BY c.ClassCode
	END
END
GO
GRANT Execute ON [GetClasses] TO iLearn_system;
GO