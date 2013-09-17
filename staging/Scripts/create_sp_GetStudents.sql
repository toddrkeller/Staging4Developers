USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 1/29/13
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetStudents')
   DROP PROCEDURE [GetStudents];
GO

CREATE PROCEDURE [dbo].[GetStudents]
	@ClassID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
--DECLARE @ClassID int
--SELECT @ClassID = 4

	DECLARE @MoreWhere NVARCHAR(100)
	SELECT @MoreWhere = ''
	if (@ClassID > 0)
	BEGIN
		SELECT @MoreWhere = ' AND sc.ClassID = ' + Convert(NVARCHAR(20), @ClassID)
	END


    
--SELECT
--    col.name, col.collation_name
--FROM 
--    sys.columns col
--WHERE
--    object_id = OBJECT_ID('student_classes')
    
--ALTER TABLE [user]
--  ALTER COLUMN [userID]
--    nvarchar(100) COLLATE Japanese_90_CI_AS NOT NULL    

--SELECT
--    col.name, col.collation_name
--FROM 
--    sys.columns col
--WHERE
--    object_id = OBJECT_ID('user')
    
    DECLARE @SQL_String NVARCHAR(1000);
	SELECT @SQL_String = 'SELECT u.[userID]
		  ,u.[firstName]
		  ,u.[lastName]
		  ,u.lastName + '', '' + u.firstName as FullName
		  ,u.[password]
		  ,u.[userType]
		  ,c.Title
		  ,sc.[ClassID]
	  FROM [dbo].[user] u 
	  LEFT OUTER JOIN [student_classes] sc ON u.userID=sc.StudentEmail
	  LEFT OUTER JOIN [dbo].[class] c ON sc.ClassID=c.ClassID
	  WHERE u.UserType = ''Student'' ' + @MoreWhere + '
	  ORDER BY u.LastName, u.FirstName'
	  EXEC sp_executesql @SQL_String
END
GO

GRANT Execute ON [GetStudents] TO iLearn_system;
GO