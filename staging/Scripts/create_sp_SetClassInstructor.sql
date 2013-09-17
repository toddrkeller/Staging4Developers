USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: Jan 11, 2013
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SetClassInstructor')
   DROP PROCEDURE [SetClassInstructor];
GO
CREATE PROCEDURE  [dbo].[SetClassInstructor]
	-- Add the parameters for the stored procedure here
	@email [nvarchar](50),
	@ClassID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF (EXISTS (Select userID FROM [user] WHERE userID = @email AND UserType!='Instructor'))
	BEGIN
		DECLARE @UserName NVARCHAR(150);
		SET @UserName = (SELECT firstName + ' ' + lastName  AS UserName FROM [user] WHERE userID=@email);
		SELECT 'fail:' + @UserName + ' is not an Instructor';
	END
	ELSE
	BEGIN
		-- SUCCESS
		IF (NOT EXISTS (Select ClassID FROM [instructor_classes] WHERE InstructorEmail = @email AND ClassID = @ClassID)) 
		BEGIN
			INSERT INTO [instructor_classes] (InstructorEmail, ClassID) VALUES (@email, @ClassID);
		END
		
		SELECT u.lastName + ', ' + u.firstName as FullName FROM [user] u WHERE u.userID = @email;
	END
END
GO

GRANT Execute ON [SetClassInstructor] TO iLearn_system;
GO