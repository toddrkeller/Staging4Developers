using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Security;
/// <summary>
/// Summary description for login
/// </summary>
[WebService(Namespace = "http://microsoft.com/webservices/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class login : System.Web.Services.WebService
{

    protected String ConnectionString = HttpContext.Current.Request.Url.AbsoluteUri.ToLower().IndexOf("localhost") >= 0 ? "localConnectionString" : "iLearnConnectionString";

    public login()
    {
	   //Uncomment the following line if using designed components 
	   //InitializeComponent(); 
    }


    [WebMethod]
    public String RecoverPassword(String Email)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);


	   String sql = "EXEC [dbo].[RecoverPassword] ";
	   sql += "@Email = '{0}'";
	   sql = String.Format(sql, Email);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  if (result.IndexOf("success") >= 0)
		  {
			 //String pw = result.Substring(result.IndexOf(":") + 1);
			 //main.SendEmail(Email, "CAP2 System Email Recovery", String.Format("<h3>Your CAP2 login password is: {0}</h3>", pw));
			 result = "success";
		  }

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
    public String RegisterUser(String email, String FirstName, String LastName, String Password, String Type)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   if (Password == "")
	   {
		  Password = Guid.NewGuid().ToString().Substring(0, 6);
	   }


	   String sql = "EXEC [dbo].[AddUser] ";
	   sql += "@email = N'{0}', ";
	   sql += "@FirstName = N'{1}', ";
	   sql += "@LastName = N'{2}', ";
	   sql += "@password = N'{3}', ";
	   sql += "@type = N'{4}'";
	   sql = String.Format(sql, email, FirstName, LastName, Password, Type);
	   SqlCommand cmd = new SqlCommand(sql, con);
	   try
	   {
		  //var returnParameter = cmd.Parameters.Add("@ReturnVal", SqlDbType.Int);
		  //returnParameter.Direction = ParameterDirection.ReturnValue;
		  con.Open();
		  String result = (string)cmd.ExecuteScalar();
		  resultVal = result == "success" ? result + ":" + Password : result;
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
    public String VerifyUser(String email, String Password)
    {
	   String resultVal = "fail:Unknown Error";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);


	   String sql = "EXEC [dbo].[VerifyUser] ";
	   sql += "@email = N'{0}', ";
	   sql += "@password = N'{1}' ";
	   sql = String.Format(sql, email, Password);
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
    public String AddStudentToClass(String Email, String ClassID)
    {
	   String resultVal = "";
	   SqlConnection con = new SqlConnection(
		   WebConfigurationManager.ConnectionStrings["iLearnConnectionString"].ConnectionString);

	   String sql = "EXEC [dbo].[AddStudentToClass] ";
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

}
