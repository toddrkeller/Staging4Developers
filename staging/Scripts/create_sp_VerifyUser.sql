USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: April 11, 2012
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'VerifyUser')
   DROP PROCEDURE [VerifyUser];
GO
CREATE PROCEDURE  [dbo].[VerifyUser]
	-- Add the parameters for the stored procedure here
	@email [nvarchar](50),
	@password [nvarchar](50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (EXISTS (Select userType FROM [user] WHERE userID = @email AND password = @password))
	BEGIN
		-- SUCCESS
		DECLARE @UserInfo NVARCHAR(150);
		SET @UserInfo = (SELECT [userType] + ':' + [firstName] + ':' + [lastName] AS [UserInfo] FROM [user] WHERE userID = @email AND password = @password);
		SELECT 'success:' + @UserInfo;
	END
	ELSE
	BEGIN
		SELECT 'fail';
	END
END
GO
