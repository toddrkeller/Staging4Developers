using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using Newtonsoft.Json;


/// <summary>
/// Summary description for main
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]

[System.Web.Script.Services.ScriptService]
public class main : System.Web.Services.WebService {
    public class InstructorInfo
    {
	   public string Email;
	   public string FirstName;
	   public string LastName;
	   public string FullName;
	   public string Password;
	   public string ClassID;

	   public InstructorInfo(String email, String firstname, String lastname, String fullname, String password, String classid) //, String classtitle)
	   {
		  this.Email = email;
		  this.FirstName = firstname;
		  this.LastName = lastname;
		  this.FullName = fullname;
		  this.Password = password;
		  this.ClassID = classid;
	   }
    }

    public class ClassInfo
    {
	   public string ClassID;
	   public string Title;
	   public string Description;
	   public string ClassCode;

	   public ClassInfo(string classcode, string classid, String title, String description) //, String instructor, String email)
	   {
		  this.ClassID = classid;
		  this.Title = title;
		  this.Description = description;
		  this.ClassCode = classcode;
	   }
    }
    
    public class Unit
    {
	   public int UnitID;
	   public String Title;
	   public List<Lesson> Lessons;

	   public Unit(int UnitID, String Title)
	   {
		  this.UnitID = UnitID;
		  this.Title = Title;
		  this.Lessons = new List<Lesson>();
	   }

	   public void addLesson(Lesson NewLesson)
	   {
		  this.Lessons.Add(NewLesson);
	   }
    }

    public class Lesson
    {
	   public int lessonID;
	   public int unitID;
	   public string title;
	   public string lessonType;

	   public Lesson(
		  int lessonID,
		  int unitID,
		  string title,
		  string lessonType)
	   {
		  this.lessonID = lessonID;
		  this.unitID = unitID;
		  this.title = title;
		  this.lessonType = lessonType;
	   }
    }

    public class DebugLogMessage
    {
        public string DateTime;
        public string UserID;
        public string Message;

        public DebugLogMessage(string DateTime, string UserID, string Message)
        {
            this.DateTime = DateTime;
            this.UserID = UserID;
            this.Message = Message;
        }
    
    }

    public class StudentInfo
    {
	   public string Email;
	   public string FirstName;
	   public string LastName;
	   public string FullName;
	   public string Password;
	   public string ClassID;
	   public string ClassTitle;

	   public StudentInfo(String email, String firstname, String lastname, String fullname, String password, String classid, String classtitle)
	   {
		  this.Email = email;
		  this.FirstName = firstname;
		  this.LastName = lastname;
		  this.FullName = fullname;
		  this.Password = password;
		  this.ClassID = classid;
		  this.ClassTitle = classtitle;
	   }
    }

    public class GlossaryItem
    {
	   public String Word;
	   public String Word_tl;
	   public String Context = "";
	   public int Lesson = -1;
	   public int Activity = -1;

	   public GlossaryItem(String Word, String Word_tl)
	   {
		  this.Word = Word;
		  this.Word_tl = Word_tl;
	   }
    }


    public main () {
        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public List<Unit> GetUnits(String Language)
    {
	   List<Unit> Units = new List<Unit>();
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   string sql = "";
	   sql = "EXEC [dbo].[GetUnits] ";
	   sql += "@Language = N'{0}'";
	   sql = String.Format(sql, Language);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   SqlCommand cmd2;
	   SqlDataReader reader2;
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  if (reader.HasRows)
		  {
			 int Unit;
			 String Title;
			 while (reader.Read())
			 {
				Unit = Convert.ToInt32(reader["unitNumber"]);
				Title = reader["UnitTitle"].ToString();
				Unit newUnit = new Unit(Unit, Title);
				Units.Add(newUnit);
			 }
			 reader.Close();
		  }

		  foreach (Unit u in Units)
		  {
			 int Unit = u.UnitID;

			 sql = "EXEC [dbo].[GetLessons] ";
			 sql += "@Language = N'{0}',";
			 sql += "@Unit = {1}";
			 sql = String.Format(sql, Language, Unit);
			 cmd2 = new SqlCommand(sql, con);
			 reader2 = cmd2.ExecuteReader();
			 if (reader2.HasRows)
			 {
				while (reader2.Read())
				{
				    int lessonID = Convert.ToInt32(reader2["lessonNumber"]);
				    String LessonTitle = reader2["LessonTitle"].ToString();
				    String LessonType = reader2["LessonType"].ToString();
				    Lesson newLesson = new Lesson(lessonID, Unit, LessonTitle, LessonType);
				    u.addLesson(newLesson);
				}
			 }
		  }
	   }
	   catch (Exception err)
	   {
		  con.Close();
	   }
	   finally
	   {
		  con.Close();
	   }

	   return Units;
    }

    protected int GetLessonIndex(int unitID, int lessonID)
    {
	   return (10 * (unitID-1)) + lessonID;
    }

    [WebMethod]
    public string GetProgress(String Language, String UserID)
    {
	   string resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   string sql = "";
	   sql = "EXEC [dbo].[GetProgress] ";
	   sql += "@Language = N'{0}',";
	   sql += "@StudentID = N'{1}'";
	   sql = String.Format(sql, Language, UserID);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  if (reader.HasRows)
		  {
			 String Lesson;
			 String ActivityNumber;
			 String Progress;
			 String Duration;
			 while (reader.Read())
			 {
				Lesson = reader["LessonID"].ToString();
				ActivityNumber = reader["ActivityNumber"].ToString();
				Progress = reader["Progress"].ToString();
				Duration = reader["Duration"].ToString();
				resultVal += String.Format("{0}|{1}|{2}~", Lesson, ActivityNumber, Progress + "-" + Duration);
			 }
		  }
	   }
	   catch (SqlException err)
	   {
		  con.Close();
		  resultVal = err.ToString();
	   }
	   finally
	   {
		  con.Close();
	   }
	   return resultVal;
    }


    [WebMethod]
    public string LogMessage(string Language, string UserID, string Message)
    {

	   SqlConnection con = new SqlConnection(
	   	   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String resultVal = "success";
	   String sql = "EXEC [dbo].[LogMessage] ";
	   sql += "@Language = N'{0}', ";
	   sql += "@UserID = N'{1}', ";
	   sql += "@Message = N'{2}' ";
	   sql = String.Format(sql, Language, UserID, Message);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  resultVal = result;
	   }
	   catch (Exception err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }

	   return resultVal;
    }

    [WebMethod]
    public List<DebugLogMessage> GetLogMessages(String Language, String UserID, String SearchStr)
    {

        List<DebugLogMessage> LogMessages = new List<DebugLogMessage>();

        string msg = "";
	   
        SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

        string sql = "";

        sql = "EXEC [dbo].[GetLogMessages] ";
        sql += "@Language = '{0}',";
        sql += "@UserID = '{1}',";
        sql += "@SearchStr = '{2}'";
        sql = String.Format(sql, Language, UserID, SearchStr);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  if (reader.HasRows)
		  {
			 String DateTime;
             String sUserID;
			 String Message;
			 while (reader.Read())
			 {
				DateTime = reader["DateTime"].ToString();
                sUserID = reader["UserID"].ToString();
				Message = reader["Message"].ToString();
                DebugLogMessage newLogMessage = new DebugLogMessage(DateTime, sUserID, Message);
                LogMessages.Add(newLogMessage);
			 }
		  }
	   }
	   catch (SqlException err)
	   {
          msg = err.Message;
		  con.Close();
	   }
	   finally
	   {
		  con.Close();
	   }
	   return LogMessages;
    }

    [WebMethod]
    public string DeleteLogMessages(String Language, String UserID, String SearchStr)
    {
        string msg = "success";

        SqlConnection con = new SqlConnection(
           WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

        string sql = "";
        sql = "EXEC [dbo].[DeleteLogMessages] ";
        sql += "@Language = '{0}',";
        sql += "@UserID = '{1}',";
        sql += "@SearchStr = '{2}'";
        sql = String.Format(sql, Language, UserID, SearchStr);

        SqlCommand cmd = new SqlCommand(sql, con);
        try
        {
            con.Open();
            cmd.ExecuteNonQuery();
        }
        catch (SqlException err)
        {
            con.Close();
            msg = err.Message;
        }
        finally
        {
            con.Close();
        }
        return msg;
    }

    [WebMethod]
    public string WriteProgress(string Language, string UserID, string progress)
    {
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   bool success = true;
	   string msg = "success";
	   String[] ActivityItems = progress.Split('~');

	   foreach (String ProgressItem in ActivityItems)
	   {
		  String Duration = "0";
		  if (ProgressItem.Length == 0) continue;
		  String[] ProgressParts = ProgressItem.Split('|');
		  String Lesson = ProgressParts[0];
		  String ActivityNumber = ProgressParts[1];
		  String Progress = ProgressParts[2];

		  if (Progress.IndexOf('-') > 0)
		  {
			  ProgressParts = Progress.Split('-');
			  Progress = ProgressParts[0];
			  Duration = ProgressParts[1];
		  }

		  String[] LessonParts = Lesson.Split('-');
		  int LessonIndex = GetLessonIndex(Convert.ToInt16(LessonParts[0]), Convert.ToInt16(LessonParts[1]));

		  String sql = "EXEC [dbo].[WriteProgress] ";
		  sql += "@Language = N'{0}',";
		  sql += "@StudentID = N'{1}',";
		  sql += "@LessonID = {2},";
		  sql += "@ActivityNumber = {3},";
		  sql += "@Progress = {4},";
		  sql += "@Duration = {5}";
		  sql = String.Format(sql, Language, UserID, LessonIndex.ToString(), ActivityNumber, Progress, Duration);
		  SqlCommand cmd = new SqlCommand(sql, con);
		  try
		  {
			 con.Open();
			 String result = (string)cmd.ExecuteScalar();
		  }
		  catch (SqlException err)
		  {
			 success = false;
			 msg = err.Message;
		  }
		  finally
		  {
			 con.Close();
		  }
	   }

	   return success ? "success" : msg;
    }

    [WebMethod]
    public String AddClass(int ClassID, String ClassCode, String ClassTitle, String Description)
    {
	   String resultVal = "";
	   String sql;
	   SqlCommand cmd;

	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   sql = "EXEC [dbo].[AddClass] ";
	   sql += "@ClassID = {0},";
	   sql += "@ClassCode = N'{1}',";
	   sql += "@ClassTitle = N'{2}',";
	   sql += "@Description = N'{3}'";
	   sql = String.Format(sql, ClassID, ClassCode, ClassTitle, Description);
	   cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  
		  resultVal = result;
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }
	   return resultVal;
    }

    [WebMethod]
    public List<InstructorInfo> GetInstructors(String ClassID)
    {
	   List<InstructorInfo> Instructors = new List<InstructorInfo>();
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetInstructors] ";
	   sql += String.Format("@ClassID = {0}", ClassID);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 Instructors.Add(new InstructorInfo(reader["userID"].ToString(), reader["FirstName"].ToString(), reader["LastName"].ToString(), reader["FullName"].ToString(), reader["password"].ToString(), reader["ClassID"].ToString())); //, reader["ClassTitle"].ToString()));
		  }
	   }
	   catch (Exception err)
	   {

	   }
	   finally
	   {
		  con.Close();
	   }
	   return Instructors;
    }
    
    [WebMethod]
    public List<ClassInfo> GetClasses()
    {
	   List<ClassInfo> Classes = new List<ClassInfo>();
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetClasses] ";
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 Classes.Add(new ClassInfo(reader["ClassCode"].ToString(), reader["ClassID"].ToString(), reader["Title"].ToString(), reader["Description"].ToString())); //, reader["Instructor"].ToString(), reader["InstructorEmail"].ToString()));
		  }
	   }
	   catch (SqlException err)
	   {
	   }
	   finally
	   {
		  con.Close();
	   }
	   return Classes;
    }

    [WebMethod]
    public String ClearClassInstructors(String ClassID)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[ClearClassInstructors] ";
	   sql += "@ClassID = {0} ";
	   sql = String.Format(sql, ClassID);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  resultVal = result;
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }
	   return resultVal;

    }

    [WebMethod]
    public String SetClassInstructors(String Emails, String ClassID)
    {
	   String resultVal = "";
	   String sql;
	   SqlCommand cmd;

	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   string[] instructors = Emails.Split(':');
	   foreach (string email in instructors)
	   {
		  if (email == "") continue;
		  sql = "EXEC [dbo].[SetClassInstructor] ";
		  sql += "@email = N'{0}', ";
		  sql += "@ClassID = {1} ";
		  sql = String.Format(sql, email, ClassID);
		  cmd = new SqlCommand(sql, con);
		  try
		  {
			 con.Open();
			 String result = (string)cmd.ExecuteScalar();
			 resultVal += result + ":";
		  }
		  catch (SqlException err)
		  {
			 resultVal = "fail:" + err.Message;
		  }
		  finally
		  {
			 con.Close();
		  }
	   }
	   return resultVal;
    }

    [WebMethod]
    public String RemoveClass(int ClassID)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[RemoveClass] ";
	   sql += "@ClassID = {0}";
	   sql = String.Format(sql, ClassID);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  resultVal = result;
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }
	   return resultVal;
    }

    [WebMethod]
    public String DeleteInstructor(String Email)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[DeleteInstructor] ";
	   sql += "@email = N'{0}'";
	   sql = String.Format(sql, Email);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  resultVal = result;
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }

	   return resultVal;
    }

    [WebMethod]
    public List<StudentInfo> GetStudents(String ClassID)
    {
	   List<StudentInfo> Students = new List<StudentInfo>();
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetStudents] ";
	   sql += "@ClassID = {0} ";
	   sql = String.Format(sql, ClassID);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 StudentInfo StInfo = new StudentInfo(reader["userID"].ToString(), reader["firstName"].ToString(), reader["lastName"].ToString(), reader["FullName"].ToString(), reader["password"].ToString(), reader["ClassID"].ToString(), reader["Title"].ToString());
			 Students.Add(StInfo);
		  }
	   }
	   catch (SqlException err)
	   {
	   }
	   finally
	   {
		  con.Close();
	   }
	   return Students;
    }

    [WebMethod]
    public List<GlossaryItem> GetGlossaryItems(String GlossaryIndex, String Language)
    {
	   List<GlossaryItem> GlossaryItems = new List<GlossaryItem>();
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetGlossaryItems]";
	   sql += "@GlossaryIndex = N'{0}',";
	   sql += "@Language = N'{1}'";
	   sql = String.Format(sql, GlossaryIndex, Language);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 GlossaryItem glossaryInfo = new GlossaryItem(reader["word"].ToString(), reader["tlword"].ToString());
			 GlossaryItems.Add(glossaryInfo);
		  }
	   }
	   catch (SqlException err)
	   {
	   }
	   finally
	   {
		  con.Close();
	   }
	   return GlossaryItems;
    }

    [WebMethod]
    public List<GlossaryItem> GetGlossaryItemDetails(String GlossaryIndex, String Language)
    {
	   List<GlossaryItem> GlossaryItems = new List<GlossaryItem>();

	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetGlossaryItemDetails]";
	   sql += "@GlossaryWord = N'{0}',";
	   sql += "@Language = N'{1}'";
	   sql = String.Format(sql, GlossaryIndex, Language);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 GlossaryItem glossaryInfo   = new GlossaryItem(reader["word"].ToString(), reader["tlWord"].ToString());
			 glossaryInfo.Context	    = reader["context"].ToString();
			 glossaryInfo.Lesson	    = Convert.ToInt32(reader["lessonID"]);
			 glossaryInfo.Activity	    = Convert.ToInt32(reader["activityID"]);
			 GlossaryItems.Add(glossaryInfo);
		  }
	   }
	   catch (SqlException err)
	   {
	   }
	   finally
	   {
		  con.Close();
	   }
	   return GlossaryItems;
    }

    [WebMethod]
    public String GetInstructorDetails(String Email)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetInstructorDetails] ";
	   sql += "@email = N'{0}'";
	   sql = String.Format(sql, Email);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
//		  if (reader.Read())
		  while (reader.Read())
		  {
			 String ClassID = reader["ClassID"].ToString();
			 String Title = reader["Title"].ToString();
			 String Description = reader["Description"].ToString();
			 String InstructorFullname = reader["Instructor"].ToString();
			 resultVal += String.Format("{0}~{1}~{2}~{3}~{4}", Email, InstructorFullname, ClassID, Title, Description) + "|";
		  }

		  if (!reader.HasRows)
			 return "fail:Instructor Not Found";
		  else
			 return resultVal;
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }

	   return resultVal;
    }

    [WebMethod]
    public String GetStudentDetails(String Email)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetStudentDetails] ";
	   sql += "@email = N'{0}'";
	   sql = String.Format(sql, Email);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  if (reader.Read())
		  {
			 String FullName = reader["FullName"].ToString();
			 String FirstName = reader["FirstName"].ToString();
			 String LastName = reader["LastName"].ToString();
			 String Password = reader["Password"].ToString();
			 String ClassID = reader["ClassID"].ToString();
			 String ClassTitle = reader["Title"].ToString();
			 return String.Format("{0}~{1}~{2}~{3}~{4}~{5}~{6}", Email, FullName, FirstName, LastName, Password, ClassID, ClassTitle);
		  }
		  else
			 return "fail:Student Not Found";
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }

	   return resultVal;
    }

    [WebMethod]
    public String RemoveStudentFromClass(String Email, String ClassID)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[RemoveStudentFromClass] ";
	   sql += "@email = N'{0}', ";
	   sql += "@ClassID = {1} ";
	   sql = String.Format(sql, Email, ClassID);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  resultVal = result;
	   }
	   catch (SqlException err)
	   {
		  resultVal = "fail:" + err.Message;
	   }
	   finally
	   {
		  con.Close();
	   }

	   return resultVal;
    }

    [WebMethod]
    public List<GlossaryItem> SearchGlossary(String SearchString, String Language)
    {
	   List<GlossaryItem> GlossaryItems = new List<GlossaryItem>();
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[SearchGlossaryItems]";
	   sql += "@SearchString = N'{0}',";
	   sql += "@Language = N'{1}'";
	   sql = String.Format(sql, SearchString, Language);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 GlossaryItem glossaryInfo = new GlossaryItem(reader["word"].ToString(), reader["tlword"].ToString());
			 GlossaryItems.Add(glossaryInfo);
		  }
	   }
	   catch (SqlException err)
	   {
	   }
	   finally
	   {
		  con.Close();
	   }
	   return GlossaryItems;
    }

    public class StudentAnswer
    {
	   public String Language;
	   public String StudentID;
	   public String LessonID;
	   public String ActivityID;
	   public String QuestionID;
	   public String Answer;
	   public String QuestionContext;
	   public String ActivityType;

	   public StudentAnswer(String Language, String StudentID, String LessonID, String ActivityID, String QuestionID, String Answer, String QuestionContext, String ActivityType)
	   {
		  this.Language = Language;
		  this.StudentID = StudentID;
		  this.LessonID = LessonID;
		  this.ActivityID = ActivityID;
		  this.QuestionID = QuestionID;
		  this.Answer = Answer;
		  this.QuestionContext = QuestionContext;
		  this.ActivityType = ActivityType;
	   }
    }

    [WebMethod]
    public String LogActivityAnswer(String AnswerCollection)
    {
	   String resultVal = "success";
	   List<StudentAnswer> Answers = null;
	   try
	   {
		  Answers = JsonConvert.DeserializeObject<List<StudentAnswer>>(AnswerCollection);
	   }
	   catch (Exception err)
	   {
		  resultVal = "fail:" + err.Message;
	   }

	   SqlConnection con = new SqlConnection(
	   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   foreach (StudentAnswer Answer in Answers)
	   {

		  String sql = "EXEC [dbo].[LogStudentAnswer]";
		  sql += "@Language = N'{0}',";
		  sql += "@StudentID = N'{1}',";
		  sql += "@LessonID = {2},";
		  sql += "@ActivityID = {3},";
		  sql += "@QuestionID = {4},";
		  sql += "@StudentAnswer = N'{5}',";
		  sql += "@QuestionContext = N'{6}',";
		  sql += "@ActivityType = N'{7}'";
		  sql = String.Format(sql, Answer.Language, Answer.StudentID, Answer.LessonID, Answer.ActivityID, Answer.QuestionID, Answer.Answer, Answer.QuestionContext, Answer.ActivityType);
		  SqlCommand cmd = new SqlCommand(sql, con);
		  try
		  {
			 con.Open();
			 cmd.ExecuteNonQuery();
		  }
		  catch (SqlException err)
		  {
			 resultVal = "fail:" + err.Message;
		  }
		  finally
		  {
			 con.Close();
		  }
	   }
	   return resultVal;
    }

    public class StudentAnswerAttempts
    {
	   public String Language;
	   public String StudentID;
	   public String LessonID;
	   public String ActivityID;
	   public String QuestionID;
	   public String ActivityType;
	   public String Attempts;

	   public StudentAnswerAttempts(String Language, String StudentID, String LessonID, String ActivityID, String QuestionID, String Attempts, String ActivityType)
	   {
		  this.Language = Language;
		  this.StudentID = StudentID;
		  this.LessonID = LessonID;
		  this.ActivityID = ActivityID;
		  this.QuestionID = QuestionID;
	   	  this.ActivityType = ActivityType;
		  this.Attempts = Attempts;
	   }
    }

    [WebMethod]
    public String LogAnswerAttemptCount(String AnswerCollection)
    {
	   String resultVal = "success";
	   List<StudentAnswerAttempts> Answers = null;
	   try
	   {
		  Answers = JsonConvert.DeserializeObject<List<StudentAnswerAttempts>>(AnswerCollection);
	   }
	   catch (Exception err)
	   {
		  resultVal = "fail:" + err.Message;
	   }

	   SqlConnection con = new SqlConnection(
	   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   foreach (StudentAnswerAttempts Answer in Answers)
	   {

		  String sql = "EXEC [dbo].[LogAnswerAttemptCount]";
		  sql += "@Language = N'{0}',";
		  sql += "@StudentID = N'{1}',";
		  sql += "@LessonID = {2},";
		  sql += "@ActivityID = {3},";
		  sql += "@QuestionID = {4},";
		  sql += "@AttemptCount = {5},";
		  sql += "@ActivityType = N'{6}'";
		  sql = String.Format(sql, Answer.Language, Answer.StudentID, Answer.LessonID, Answer.ActivityID, Answer.QuestionID, Answer.Attempts, Answer.ActivityType);
		  SqlCommand cmd = new SqlCommand(sql, con);
		  try
		  {
			 con.Open();
			 cmd.ExecuteNonQuery();
		  }
		  catch (SqlException err)
		  {
			 resultVal = "fail:" + err.Message;
		  }
		  finally
		  {
			 con.Close();
		  }
	   }
	   return resultVal;
    }

    public class StudentActivityAnswer
    {
	   public String StudentName;
	   public String StudentID;
	   public int QuestionID;
	   public String Answer;
	   public String Context;
	   public String ActivityType;
	   public int ClassID;

	   public StudentActivityAnswer(String StudentName, String StudentID, int QuestionID, String Answer, String Context, String ActivityType, int ClassID)
	   {
	   	  this.StudentName = StudentName;
		  this.StudentID = StudentID;
		  this.QuestionID = QuestionID;
		  this.Answer = Answer;
		  this.Context = Context;
		  this.ActivityType = ActivityType;
		  this.ClassID = ClassID;
	   }
    }

    [WebMethod]
    public List<StudentActivityAnswer> GetStudentAnswers(String Language, String LessonID, String ActivityID, String ClassID)
    {
	   List<StudentActivityAnswer> AnswerItems = new List<StudentActivityAnswer>();

	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[GetStudentAnswers]";
	   sql += "@Language = N'{0}',";
	   sql += "@LessonID = {1},";
	   sql += "@ActivityID = {2},";
	   sql += "@ClassID = {3}";
	   sql = String.Format(sql, Language, LessonID, ActivityID, ClassID);

	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  SqlDataReader reader = cmd.ExecuteReader();
		  while (reader.Read())
		  {
			 StudentActivityAnswer AnswerItem = new StudentActivityAnswer(
			 	reader["studentName"].ToString(),
				reader["studentID"].ToString(), 
				Convert.ToInt32(reader["questionID"]),
				reader["Answer"].ToString(),
				reader["context"].ToString(),
				reader["activityType"].ToString(),
				Convert.ToInt32(reader["ClassID"]));

			 AnswerItems.Add(AnswerItem);
		  }
	   }
	   catch (SqlException err)
	   {
		  // 
	   }
	   finally
	   {
		  con.Close();
	   }
	   return AnswerItems;
    }

}
