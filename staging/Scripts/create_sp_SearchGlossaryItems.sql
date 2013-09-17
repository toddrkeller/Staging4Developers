USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 3/15/13
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SearchGlossaryItems')
   DROP PROCEDURE SearchGlossaryItems;
GO

CREATE PROCEDURE [dbo].SearchGlossaryItems
	@SearchString [nvarchar](200),
	@Language [nvarchar] (50) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT [word], [tlWord], [context], [lessonID], [activityID] FROM glossary WHERE word LIKE('%' + @SearchString + '%') AND [language] = @Language
	ORDER BY word
END
GO

GRANT Execute ON SearchGlossaryItems TO iLearn_system;
GO