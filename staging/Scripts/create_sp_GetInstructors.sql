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
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetInstructors')
   DROP PROCEDURE [GetInstructors];
GO

CREATE PROCEDURE [dbo].[GetInstructors]
	@ClassID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


 --   SELECT A.email, u.FirstName, u.LastName, u.LastName + ', ' + u.FirstName as FullName, u.password, A.ClassID, A.Title  as ClassTitle
 --   FROM 
 --   (
	--	SELECT distinct c.ClassID, c.Title, c.[Description], i.InstructorEmail as email
	--	FROM [class] c LEFT OUTER JOIN [instructor_classes] i ON c.ClassID = i.ClassID
	--) A LEFT OUTER JOIN [user] u ON A.email = u.email
 --   WHERE u.UserType = 'Instructor' and ClassID = CASE @ClassID 
 --    WHEN 0 THEN ClassID ELSE @ClassID END
 --   ORDER BY FullName 
 
 --DECLARE @ClassID int
 --SET @ClassID = 0;   
 
 SELECT U.userID, U.FirstName, U.LastName, u.FullName, u.password, c.ClassID
 FROM
 (
    SELECT userID, FirstName, LastName, u.LastName + ', ' + u.FirstName as FullName, u.password
    FROM [user] u 
    WHERE UserType = 'Instructor'
  ) AS U LEFT OUTER JOIN instructor_classes c ON U.userID = c.InstructorEmail
  ORDER BY U.userID
    
END
GO
GRANT Execute ON [GetInstructors] TO iLearn_system;
GO