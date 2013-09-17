USE [iLearn]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		David Neff
-- Create date: 1/29/13
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'RemoveClass')
   DROP PROCEDURE [RemoveClass];
GO

CREATE PROCEDURE [dbo].[RemoveClass]
	@ClassID int
AS
BEGIN

	SET NOCOUNT ON;

--DECLARE @ClassID int;
--SET @ClassID = 10;
	DECLARE @ClassCode nvarchar(50);
	DECLARE @NewClassCode nvarchar(50);
	DECLARE @IncrementVal int;
	DECLARE @DashPosition int;
-- SW103

	-- Remove class sets Active = 0 and renames the ClassCode
	IF (EXISTS (Select ClassID FROM [class] WHERE ClassID = @ClassID AND Active=1))
	BEGIN
		-- check for any non-active classes.  If there are any then we need to increment
		-- ClassCode and assign to this class as we set it to Active=0
		SELECT @ClassCode = ClassCode 
				FROM [class] 
				WHERE ClassID = @ClassID;
				
		IF ( EXISTS (SELECT ClassCode 
			FROM [class] 
			WHERE ClassCode LIKE @ClassCode + '%' AND Active=0))
		BEGIN
			SELECT @NewClassCode = MAX(ClassCode) FROM [class] WHERE ClassCode LIKE @ClassCode + '%';
			SELECT @DashPosition = CHARINDEX('-', @NewClassCode)+1;
			SELECT @IncrementVal = CAST( SUBSTRING(@NewClassCode, @DashPosition, 2) AS int) + 1;
			SELECT @NewClassCode = SUBSTRING(@NewClassCode, 1, @DashPosition-1) + CAST(@IncrementVal AS nvarchar(2)); 
		END
		ELSE
		BEGIN
			SELECT @NewClassCode = @ClassCode + '-1';
		END
		
		UPDATE [class] SET ClassCode=@NewClassCode, Active=0 WHERE ClassID=@ClassID;
		DELETE FROM student_classes WHERE ClassID=@ClassID;
		
	END
	SELECT 'SUCCESS';
END
GO

GRANT Execute ON [RemoveClass] TO iLearn_system;
GO