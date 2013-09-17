USE [iLearn]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		David Neff
-- Create date: Dec 26, 2012
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'LogMessage')
   DROP PROCEDURE [LogMessage];
GO

CREATE PROCEDURE [dbo].[LogMessage]
	@Language NVARCHAR(50),
	@UserID NVARCHAR(200),
	@Message NVARCHAR(1000)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO messageLog ([Language], UserID, [DateTime], [Message]) VALUES (@Language, @UserID, GetDate(), @Message);

END

GO

GRANT Execute ON [LogMessage] TO iLearn_system;
GO