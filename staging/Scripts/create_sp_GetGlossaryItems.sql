USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 3/05/13
--
--	   String sql = "EXEC [dbo].[GetGlossaryItems] ";
--	   sql += "@GlossaryIndex = {0}, ";
--	   sql += "@Language = {0}";
--	   sql = String.Format(sql, GlossaryIndex, Language);
--
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetGlossaryItems')
   DROP PROCEDURE GetGlossaryItems;
GO

CREATE PROCEDURE [dbo].GetGlossaryItems
	@GlossaryIndex [nvarchar](2),
	@Language [nvarchar] (50) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

--	SELECT [word], [tlWord], lessonID, activityID, [context], [language] FROM glossary WHERE LEFT(tlWord, 1) = @GlossaryIndex AND [language] = @Language
--	ORDER BY tlWord

	SELECT DISTINCT [word], [tlWord] FROM glossary WHERE LEFT(tlWord, 1) = @GlossaryIndex AND [language] = @Language
	ORDER BY tlWord
END
GO

GRANT Execute ON GetGlossaryItems TO iLearn_system;
GO