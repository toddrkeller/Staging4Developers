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
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetStudentDetails')
   DROP PROCEDURE [GetStudentDetails];
GO

CREATE PROCEDURE [dbo].[GetStudentDetails]
	@email [nvarchar](50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

--declare @email nvarchar(50);
--select @email = 'student2@gmail.com'

	IF (NOT EXISTS (SELECT Title FROM class cl, student_classes c WHERE c.ClassID = cl.ClassID AND c.StudentEmail = @email))
	BEGIN
		SELECT u.LastName + ', ' + u.FirstName as FullName, FirstName, LastName, [password], u.userID as StudentEmail, c.ClassID, '---' AS Title
		FROM [user] u  LEFT OUTER JOIN student_classes c ON u.userID=c.StudentEmail
		WHERE u.userID = @email AND u.UserType = 'Student'
		ORDER BY LastName
	END
	ELSE
	BEGIN
		SELECT u.LastName + ', ' + u.FirstName as FullName, FirstName, LastName, [password], u.userID as StudentEmail, c.ClassID, cl.Title
		FROM [user] u  LEFT OUTER JOIN student_classes c ON u.userID=c.StudentEmail, class cl
		WHERE u.userID = @email AND u.UserType = 'Student' AND c.ClassID = cl.ClassID
		ORDER BY LastName
	END
END
GO

GRANT Execute ON [GetStudentDetails] TO iLearn_system;
GO