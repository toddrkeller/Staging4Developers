USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: Jan 17, 2013
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'ClearClassInstructors')
   DROP PROCEDURE [ClearClassInstructors];
GO
CREATE PROCEDURE  [dbo].[ClearClassInstructors]
	-- Add the parameters for the stored procedure here
	@ClassID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DELETE FROM instructor_classes WHERE ClassID=@ClassID;			
	SELECT 'success';
END
GO

GRANT Execute ON [ClearClassInstructors] TO iLearn_system;
GO