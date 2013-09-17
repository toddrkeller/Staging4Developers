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
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'DeleteInstructor')
   DROP PROCEDURE [DeleteInstructor];
GO
CREATE PROCEDURE  [dbo].[DeleteInstructor]
	-- Add the parameters for the stored procedure here
	@email [nvarchar](50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DELETE FROM [user] WHERE userID = @email;
	SELECT 'success';
END
GO
GRANT Execute ON [DeleteInstructor] TO iLearn_system;
GO