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
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddUser')
   DROP PROCEDURE [AddUser];
GO
CREATE PROCEDURE  [dbo].[AddUser]
	-- Add the parameters for the stored procedure here
	@email [nvarchar](50),
	@FirstName [nvarchar](50),
	@LastName [nvarchar](50),
	@password [nvarchar](50),
	@type [nvarchar] (50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (EXISTS (Select userID FROM [user] WHERE userID = @email))
	BEGIN
		-- Already exists.  Return a -1
		SELECT 'fail:User already exists';
	END
	ELSE
	BEGIN
		INSERT INTO [user] 
			(userID, FirstName, LastName, [password], UserType) 
		VALUES
			(@email, @FirstName, @LastName, @password, @type)
		SELECT 'success';
	END
END
GO
GRANT Execute ON [AddUser] TO iLearn_system;
GO