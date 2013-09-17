USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 3/05/13
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetGlossaryItemDetails')
   DROP PROCEDURE GetGlossaryItemDetails;
GO

CREATE PROCEDURE [dbo].GetGlossaryItemDetails
	@GlossaryWord [nvarchar](200),
	@Language [nvarchar] (50) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	
	SELECT [word], [tlWord], lessonID, activityID, [context], [language] FROM glossary WHERE tlWord = @GlossaryWord AND [language] = @Language
	ORDER BY lessonID, activityID
	
	END
GO

GRANT Execute ON GetGlossaryItemDetails TO iLearn_system;
GO