USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: Aug 24, 2012
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddClass')
   DROP PROCEDURE [AddClass];
GO
CREATE PROCEDURE  [dbo].[AddClass]
	-- Add the parameters for the stored procedure here
	@ClassID int,
	@ClassCode [nvarchar](50),
	@ClassTitle [nvarchar](150),
	@Description [nvarchar](150)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF (@ClassID > -1) 
	BEGIN
		-- Update class
		UPDATE [class] SET Title=@ClassTitle, [Description] = @Description, ClassCode=@ClassCode
		WHERE ClassID=@ClassID;
		SELECT 'success';
	END
	ELSE IF (EXISTS (Select ClassID FROM [class] WHERE ClassCode = @ClassCode))
	BEGIN
		-- Already exists.  Return a -1
		SELECT 'fail:Class Code already exists';
	END
	ELSE
	BEGIN
		INSERT INTO [class] 
			(Title, [Description], ClassCode) 
		VALUES
			(@ClassTitle, @Description, @ClassCode)
		SELECT 'success';
	END
END
GO