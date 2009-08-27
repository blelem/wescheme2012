<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="org.wescheme.user.SessionManager" %>
<%@ page import="org.wescheme.user.Session" %>
<%
    String publicId = request.getParameter("publicId");
    String encodedId = java.net.URLEncoder.encode(publicId, "utf-8");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head><title>WeScheme</title>
<link rel="stylesheet" type="text/css" href="css/view.css" id="style" />
<script src="/editor/jquery.js"></script>
<script src="/heartbeat.js"></script>
<script src="/js/submitpost.js"></script>

<script>
function runIt() {
    window.location = "/run?publicId=<%= encodedId%>";
}

function viewSource() {
    window.location = "/openEditor?publicId=<%= encodedId%>";
}

function updateProgramTitle() {

        // TODO: notify the user if the program uses some
        // permissions

	var callback = function(data) {
	    var dom = jQuery(data);
            jQuery("#programTitle").text(dom.find("title").text());

	};
	jQuery.get("/loadProject", 
                   {publicId: decodeURIComponent("<%= encodedId %>")},
                   callback, 
                   "xml");
}




</script>
</head>


<body onload='setInterval("beat()",1800000); updateProgramTitle()'>
<h1>WeScheme</h1>
<h2 id="programTitle">&nbsp;</h2>
<input id="runIt" value="Run it!" type="button" onclick="runIt()" />
	

<input id="viewSource" value="View source" type="button" onclick="viewSource()" %>

	
	
<h2>Sometimes YouTube. Perhaps iPhone. Together, WeScheme</h2>




<div id="footer">
<a href="#">About</a>

<a href="#">Contact</a>
<a href="#">Copyright</a>
</div>

</body></html>