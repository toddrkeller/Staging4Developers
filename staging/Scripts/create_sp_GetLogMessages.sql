USE [iLearn]
GO
/****** Object:  StoredProcedure [dbo].[GetLogMessages]    Script Date: 01/28/2013 11:25:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetLogMessages')
   DROP PROCEDURE [GetLogMessages];
GO

CREATE PROCEDURE [dbo].[GetLogMessages]
@Language NVARCHAR(50),
@UserID NVARCHAR(100),
@SearchStr NVARCHAR(200)
AS
BEGIN
	/**** DECLARE @Language NVARCHAR(50);
	DECLARE @SearchStr NVARCHAR(50);
	SET @Language = 'tg'
	SET @SearchStr = 'debug' ****/
	-- ConstrainByDate will be 0 or 1
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF ('*' = @SearchStr)
	BEGIN
		SELECT TOP 50 m.Language, m.UserID, m.DateTime, m.Message
		FROM [messageLog] m
		WHERE m.Language = @Language AND m.UserID = @UserID
		ORDER BY DateTime DESC
	END
	ELSE
	BEGIN
		SELECT TOP 50 m.Language, m.UserID, m.DateTime, m.Message
		FROM [messageLog] m
		WHERE m.Message LIKE '%' + @SearchStr + '%' AND m.Language = @Language AND m.UserID = @UserID
		ORDER BY m.DateTime DESC
	END

END
