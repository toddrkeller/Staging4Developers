USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: April 18, 2012
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddStudentToClass')
   DROP PROCEDURE [AddStudentToClass];
GO
CREATE PROCEDURE  [dbo].[AddStudentToClass]
	-- Add the parameters for the stored procedure here
	@email [nvarchar](50),
	@ClassID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (EXISTS (Select c.ClassID FROM [class] c, [student_classes] sc WHERE c.ClassID=sc.ClassID AND c.ClassID = @ClassID AND sc.StudentEmail = @email AND c.Active=1))
	BEGIN
		-- Already exists.  Return a -1
		SELECT 'fail:Student is already in the class';
	END
	ELSE IF (NOT EXISTS (Select ClassID FROM [class] WHERE ClassID = @ClassID))
	BEGIN
		-- Class doesn't exist
		SELECT 'fail:Class does not exist';
	END
	ELSE IF (EXISTS (Select c.ClassID FROM [class] c, [student_classes] sc WHERE c.ClassID=sc.ClassID AND c.ClassID != @ClassID AND sc.StudentEmail = @email AND c.Active=1))
	BEGIN
		-- Student is enrolled in another class already
		SELECT 'fail:Student is already enrolled in another class';
	END
	ELSE
	BEGIN
		INSERT INTO [student_classes] 
			(StudentEmail, ClassID) 
		VALUES
			(@email, @ClassID)
		SELECT 'success:Student Added';
	END
END
GO