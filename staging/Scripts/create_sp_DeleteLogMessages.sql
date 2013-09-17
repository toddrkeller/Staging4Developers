USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ed Hoskins
-- Create date: January 1, 2013
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'DeleteLogMessages')
   DROP PROCEDURE [DeleteLogMessages];
GO
CREATE PROCEDURE  [dbo].[DeleteLogMessages]
	-- Add the parameters for the stored procedure here
@Language NVARCHAR(50),
@UserID NVARCHAR(100),
@SearchStr NVARCHAR(200)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF ('*' = @SearchStr)
	BEGIN
		DELETE FROM [messageLog] WHERE Language = @Language AND UserID = @UserID;
		SELECT 'success';
	END
	ELSE
	BEGIN
		DELETE FROM [messageLog] WHERE Message LIKE '%' + @SearchStr + '%' AND Language = @Language AND UserID = @UserID;
		SELECT 'success';
	END

END
GO