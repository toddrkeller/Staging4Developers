USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 1/28/13
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetInstructorDetails')
   DROP PROCEDURE [GetInstructorDetails];
GO

CREATE PROCEDURE [dbo].[GetInstructorDetails]
	@email [nvarchar](50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
--DECLARE @email [nvarchar](50);
--SET @email = 'instructor1@gmail.com';
	SELECT c.ClassID, c.Title, c.[Description], u.LastName + ', ' + u.FirstName as Instructor, u.userID as InstructorEmail
	FROM [class] c LEFT OUTER JOIN [instructor_classes] ic ON c.ClassID = ic.ClassID, [user] u 
	WHERE ic.InstructorEmail=@email AND u.userID=@email AND u.UserType = 'Instructor' AND c.Active=1
	ORDER BY c.Title
	
	
	
END
GO

GRANT Execute ON [GetInstructorDetails] TO iLearn_system;
GO