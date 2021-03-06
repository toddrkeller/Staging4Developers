USE [iLearn]
GO
/****** Object:  Table [dbo].[user]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[glossary](
	[tlWord] [nvarchar](500) NOT NULL,
	[word] [nvarchar](500) NULL,
	[lessonID] [nvarchar](50) NULL,
	[activityID] [nvarchar](50) NULL,
	[context] [nvarchar](1000) NULL,
	[language] [nvarchar](50) NULL
) ON [PRIMARY]

GO

CREATE TABLE [dbo].[user](
	[userID] [nvarchar](100) NOT NULL,
	[firstName] [nvarchar](50) NULL,
	[lastName] [nvarchar](50) NULL,
	[password] [nvarchar](50) NULL,
	[lastActivity] [nvarchar](50) NULL,
	[activated] [int] NULL,
	[admin] [int] NULL,
	[userType] [nvarchar](50) NULL,
 CONSTRAINT [PK_user] PRIMARY KEY CLUSTERED 
(
	[userID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[unit]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[unit](
	[unitNumber] [tinyint] NOT NULL,
	[language] [nvarchar](10) NULL,
	[title] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[student_classes]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[student_classes](
	[StudentEmail] [nvarchar](50) NULL,
	[ClassID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[messageLog]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[messageLog](
	[Language] [nvarchar](10) NOT NULL,
	[UserID] [nvarchar](150) NOT NULL,
	[DateTime] [datetime] NOT NULL,
	[Message] [nvarchar](1000) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lesson]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lesson](
	[lessonNumber] [int] NOT NULL,
	[unit] [tinyint] NOT NULL,
	[title] [nvarchar](50) NULL,
	[lessonType] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[instructor_classes]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[instructor_classes](
	[InstructorEmail] [nvarchar](50) NULL,
	[ClassID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CourseProgress]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CourseProgress](
	[Language] [nvarchar](50) NOT NULL,
	[StudentID] [nvarchar](150) NOT NULL,
	[LessonID] [int] NOT NULL,
	[ActivityNumber] [smallint] NOT NULL,
	[Progress] [smallint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[class]    Script Date: 02/01/2013 09:34:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[class](
	[ClassID] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ClassCode] [nvarchar](50) NULL,
	[Active] [tinyint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Default [DF_class_Active]    Script Date: 02/01/2013 09:34:45 ******/
ALTER TABLE [dbo].[class] ADD  CONSTRAINT [DF_class_Active]  DEFAULT ((1)) FOR [Active]
GO
/****** Object:  Default [DF_lesson_lessonType]    Script Date: 02/01/2013 09:34:45 ******/
ALTER TABLE [dbo].[lesson] ADD  CONSTRAINT [DF_lesson_lessonType]  DEFAULT (N'Classroom') FOR [lessonType]
GO
/****** Object:  Default [DF_user_activated]    Script Date: 02/01/2013 09:34:45 ******/
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_activated]  DEFAULT ((0)) FOR [activated]
GO
