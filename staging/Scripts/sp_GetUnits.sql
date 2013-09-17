USE [iLearn]
GO

/****** Object:  StoredProcedure [dbo].[WriteProgress]    Script Date: 11/15/2012 11:00:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		David Neff
-- Create date: Nov 15, 2012
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetUnits')
   DROP PROCEDURE [GetUnits];
GO

CREATE PROCEDURE [dbo].[GetUnits]
	@Language NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;
	
	SELECT u.unitNumber, u.title AS UnitTitle
		FROM unit u
		ORDER BY u.unitNumber

END

GO

GRANT Execute ON [GetUnits] TO iLearn_system;
GO