USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: Jan 19, 2013
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'RemoveStudentFromClass')
   DROP PROCEDURE [RemoveStudentFromClass];
GO
CREATE PROCEDURE  [dbo].[RemoveStudentFromClass]
	-- Add the parameters for the stored procedure here
	@email [nvarchar](50),
	@ClassID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

		DELETE FROM [student_classes] 
		WHERE
			StudentEmail = @email AND 
			ClassID = @ClassID
		SELECT 'success:Student Removed';
END
GO

GRANT Execute ON [RemoveStudentFromClass] TO iLearn_system;
GO