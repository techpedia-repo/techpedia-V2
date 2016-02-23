<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html ng-app="techpedia">
<body style="background-color: white">
	<div class="loaderBody"></div>
	<style>
.loaderBody {
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	z-index: 9999;
	background: url('images/prettyPhoto/dark_rounded/loader.gif') 50% 50%
		no-repeat rgb(249, 249, 249);
}

.icon_table {
	width: 100%;
	font-color: #ffffff !important;
	/* height: 75px; */
}

.modal-body {
	max-height: calc(100vh - 210px);
	overflow-y: auto;
}

.icon_td {
	align-items: center;
	align-content: center;
	font-color: #ffffff !important;
}
</style>

	<script src="js/script.min.js"></script>
	<script src="js/select2.min.js"></script>
	<jsp:include page="template/NewHeader.jsp" />
	<script type="text/javascript">
		$(window).load(function() {
			$(".loaderBody").fadeOut("slow");
		})
	</script>
	<link rel="stylesheet"
		href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	<img src="images/View-Team-banner_V3.jpg" class="img-responsive"
		style="width: 100%; hegiht: 25%;">
	<div class="clearfix"></div>
	<div class="container customFont borderRadius style">
		<div class="page-container">
			<!-- BEGIN SIDEBAR -->
			<div class="page-sidebar-wrapper">
				<%-- 	<jsp:include page="template/dashboardMenu.jsp" /> --%>
			</div>

			<div class="page-content-wrapper"
				ng-controller="TeamDetailsController" ng-init="initLoad()">
				<div class="page-content">
					<div class="row">
						<div class="col-md-12">
							<!-- BEGIN PAGE TITLE & BREADCRUMB-->
							<!-- <h3 class="page-title">
						<i class="fa fa-share" id="icon-size"></i> Team Details
						<small>dashboard & statistics</small>
					</h3> -->
							<ul class="page-breadcrumb breadcrumb">
								<li><a href="./">Home</a> &raquo; <a href="dashboard">Dashboard</a>
									&raquo; Teams</li>

								<!-- <li class="pull-right">
							<div id="dashboard-report-range" class="dashboard-date-range tooltips"
								data-placement="bottom" data-original-title="Change dashboard date range">
								<i class="icon-calendar"></i> <span></span> <i class="fa fa-angle-down"></i>
							</div>
						</li> -->
							</ul>


						</div>
					</div>
					<div class="clearfix"></div>

					<div class="row" style="background-color: white;">
						<div class="col s12"
							style="border-radius: 8px; /* width: 1079px; margin-left: 20px; */ height: 35px; padding-top: 9px; padding-left: 12px; background-color: #262626; color: white; margin-top: -20px;">
							{{teamName}}</div>
						<!-- <div class="col-md-12 left-border">
					<div class="col-md-6" style="top: 8px;">Team Name &raquo; {{teamName}}</div>
					<div class="col-md-6" style="top: 8px;">Project Name &raquo; {{projectName}}</div>
					<div class="col-md-3">
						<a href="addTeamMember" data-toggle="modal" id="search-new-members-button"
							data-target=".bs-modal-sm" class="btn btn-info add">Add new Member</a>
						<div class="col-md-12"></div>
					</div>
				</div> -->
						<br> <br> <br>
						<div class="col-md-12 col s12"
							style="background-color: #CCC; margin-top: -40px; margin-bottom: 30px; border-radius: 8px;">
							<div class="col-md-3 one1" ng-repeat="member in members"
								onmouseenter="$(this).children('.sticky1').show(200)"
								onmouseleave="$(this).children('.sticky1').hide(200)"
								style="border-radius: 5px">
								<!-- <table class="icon_table"> -->
								<!-- <tr> -->

								<!-- <div class="col-xs-4 sticky1" style="width: 250px; display:none; background-color:black; opacity:0.7; position: rea;">
								<table border="2px">
									<tr>
										<td>Student Name</td>
										<td>{{member.teamMemFName}}{{member.teamMemMName}} {{member.teamMemLName}}</td>
									</tr>
									<tr>
										<td>College</td>
										<td>{{member.college}}</td>
									</tr>
									<tr>
										<td>Branch</td>
										<td>Mechanical</td>
									</tr>
								</table>
							</div> -->

								<div class="col-xs-12" style="margin-top: 12px">
									<img ng-file="file"
										ng-show="(member.photo=='data:undefined;base64,undefined')||(member.photo=='Photo path')"
										src="images/profile_icon.png"
										style="height: 175px; width: 235px; z-index: 0; border-radius: 8px; z-index: 0;"
										width=100% /> <img ng-file="file"
										ng-hide="(member.photo=='data:undefined;base64,undefined')||(member.photo=='Photo path')"
										style="height: 175px; width: 235px; z-index: 0; border-radius: 8px; z-index: 0;"
										src="{{member.photo||'images/profile_icon.png'}}" width=100% />
									<div
										style="font-family: arial; font-size: 12; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px; padding-top: 3px; bottom: 0; width: 235px; height: 60px; position: absolute; text-align: center; color: white; font-weight: bolder; opacity: 0.9; filter: alpha(opacity = 90); z-index: 4; background-color: #3f94ae;">

										<table class="icon_table">
											<tr>
												<td align="center"
													style="font-size: 14px; font-family: Arial;"><img
													id="" alt="" src="images/faculty-icon.png" /></td>
												<td align="center"
													style="font-size: 14px; font-family: Arial;"><img
													src="images/College-icon.png" /></td>
												<td align="center"
													style="font-size: 14px; font-family: Arial;"><img
													src="images/branches-icon.png" /></td>
											</tr>
											<tr>
												<td align="center"
													style="padding-top: 7px; color: #ffffff; font-size: 12px; font-family: Arial; text-overflow: ellipsis !important; overflow: hidden !important;"
													class="icon_td">{{member.teamMemFName}}</td>
												<td align="center"
													style="padding-top: 7px; color: #ffffff; font-size: 12px; font-family: Arial; text-overflow: ellipsis !important; overflow: hidden !important;"
													class="icon_td">{{member.college
													|truncate:true:18:'...'}}</td>
												<td align="center"
													style="padding-top: 7px; color: #ffffff; font-size: 12px; font-family: Arial; text-overflow: ellipsis !important; overflow: hidden !important;"
													class="icon_td">{{member.branchName |
													truncate:true:6:' '}}</td>
											</tr>

										</table>






										<!-- <div class="col-xs-3">
									
									
									{{member.teamMemFName}} {{member.teamMemMName}} {{member.teamMemLName}}
									</div>
									
									<div class="col-xs-3">
									
									{{member.teamMemFName}} {{member.teamMemMName}} {{member.teamMemLName}}
									</div>
									<div class="col-xs-3">
									{{member.branchName}}
									</div> -->

									</div>
									<!-- <div style="float: left; padding-left: 12px;">
										<img
											style="height: 185px; width: 235px; padding-top: 15px; position: absolute; z-index: 0;"
											src="{{member.photo||'images/UserDefault.jpg'}}"
											alt="" />
										<div
											style="margin-top: 56%; padding-top: 13px; bottom: 0; left: 0; width: 235px; height: 54px; position: relative; text-align: center; color: black; font-weight: bolder; opacity: 0.7; filter: alpha(opacity = 70); z-index: 4; background-color: white;">{{project.projTitle}}</div>
									</div> -->



									<!-- </tr> -->
									<!-- <div
									style="margin-top: 56%; padding-top: 13px; bottom: 0; left: 0; width: 235px; height: 54px; position: relative; text-align: center; color: black; font-weight: bolder; opacity: 0.7; filter: alpha(opacity = 70); z-index: 4; background-color: white;"> -->

									<!-- <td align="center"
										style="font-size: 12px; color: white; font-family: Arial;"
										class="icon_td"><img id="" alt=""
										src="images/student-icon.png" />
										<div
											style="text-overflow: ellipsis !important; overflow: hidden !important;">{{member.teamMemFName}}
											{{member.teamMemMName}} {{member.teamMemLName}}</div></td>
									<td align="center"
										style="font-size: 12px; color: white; font-family: Arial;"
										class="icon_td"><img alt="" src="images/College-icon.png" />
										<div>{{member.college}}</div></td> -->

								</div>


								<!-- </table> -->
								<i id="removeMember"
									ng-show="member.teamLeaderId ==<%=session.getAttribute("id")%> && member.teamLeaderId != member.teamMemRegstrId"
									ng-disabled=""
									style="color: #555; font-size: 20px; float: right; position: relative; top: -186px; left: 16px;"
									class="fa fa-times-circle" ng-click="removeMember(member)"></i>

								<!-- <div class="col-xs-12">
								<p>{{member.state}}</p>
								<p>{{member.country}}</p>
								<p>{{member.college}}</p>
							</div> -->



							</div>
							<div id="added-new-members"></div>

							<div class="clearfix"></div>

							<%-- 		<%
												
												if(session.getAttribute("username") != null){
												long registrId=((Long)session.getAttribute("id"));
												System.err.println("inJsp Value"+registrId);
												String rValue=String.valueOf(registrId);
												
												if(rValue != null){
													%>
											
													<c:set var="teamLeadrId" value="${member.teamLeadrId}" />
													
													<c:set var="rid" value="<%=registrId %>" scope="session" />
													
													<c:if test="${teamLeadrId == rid}"> --%>
							<div class="alert alert-sm alert-info alert-dismissible"
								role="alert" id="hide" ng-show="message.length>0">
								<p style="text-align: center">
									<!-- <button  disabled>Show more</button> -->
								<p ng-repeat="msg in message" style="text-align: center">{{msg}}</p>
								</p>
							</div>


							<!-- Replace Team Lead code Starts here  -->


							<div>
								<button id="replace"
									ng-click="replaceTeamLead(<%=session.getAttribute("id")%>)"
									style="float: left; padding-right: 10px; margin-right: 10px; margin-top: 15px; margin-bottom: 15px; margin-left: 700px; border-color: #4cae4c; background-color: #5cb85c"
									class="btn btn-danger">
									<i class="glyphicon glyphicon-refresh" style="font-size: 17px;">&nbsp;</i>Replace
									Team Lead
								</button>
							</div>



							<!-- Replace Team Lead code Ends here  -->
							<div ng-controller="MyCtrl"
								ng-repeat="member in members|limitTo:1">
								<div>
									<button id="mybutton" class="btn btn-info btn-small"
										style="cursor: pointer; border-color: #4cae4c; background-color: #5cb85c; margin-top: 15px; margin-bottom: 15px;"
										ng-click="showAlert()"
										ng-show="member.teamLeaderId==<%=session.getAttribute("id")%>">
										<i class="fa fa-user-plus" style="font-size: 20px;">&nbsp;</i>Add
										Team Member
									</button>
								</div>
								<div class="col-md-12"></div>
								<div>
									<div ng-show="myvalue" class="hideByDefault">
										<div class="row" id="addTeamMember">
											<div class="col-xs-12">
												<div class="panel panel-primary">
													<div class="panel-heading"
														style="background-color: #217690 !important;">Add
														Team Member</div>
													<div class="panel-body">
														<!-- <div class="panel panel-primary">
								<div class="panel-heading">Choose project</div>
								<div class="panel-body">
									<div class="btn-group">
										<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
											{{chosenProject.projTitle}} <span class="caret"></span>
										</button>
										<ul class="dropdown-menu" role="menu">
											<li ng-repeat="project in projects"><a href="#" ng-click="chooseProject(project)">{{project.projTitle}}
											</a></li>
										</ul>
									</div>
								</div>
							</div> -->
														<form name="searchTeamMembers" novalidate>
															<!-- //firstName -->
															<div class="col-xs-6">
																<div style="height: 33px;">

																	<div class="col-xs-4"
																		style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; height: 33px; background-color: #217690;">
																		<div
																			style="font-family: arial; color: white; margin-top: 6px; text-align: center;">First
																			Name</div>
																	</div>

																	<div class="col-xs-8 " style="height: 33px;">
																		<input
																			style="height: 33px; width: 100%; margin-left: -17px;"
																			type="text" name="firstName" class="form-control"
																			placeholder="First Name" ng-model="search.firstName">
																	</div>
																</div>

																<div class="col-xs-12">&nbsp;</div>


																<!-- //MiddleName -->
																<div style="height: 33px;">

																	<div class="col-xs-4 "
																		style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; height: 33px; background-color: #217690;">
																		<div
																			style="font-family: arial; color: white; margin-top: 6px; text-align: center;">Middle
																			Name</div>
																	</div>

																	<div class="col-xs-8 " style="height: 33px;">
																		<input
																			style="height: 33px; width: 100%; margin-left: -17px;"
																			type="text" name="midName" class="form-control"
																			placeholder="Middle Name" ng-model="search.midName">
																	</div>
																</div>
																<div class="col-xs-12" style="height: 15px">&nbsp;</div>

																<!-- //lastName -->
																<div style="height: 33px;">

																	<div class="col-xs-4 "
																		style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; height: 33px; background-color: #217690;">
																		<div
																			style="font-family: arial; color: white; margin-top: 6px; text-align: center;">Last
																			Name</div>
																	</div>

																	<div class="col-xs-8 " style="height: 33px;">
																		<input
																			style="height: 33px; width: 100%; margin-left: -17px;"
																			type="text" name="lastName" class="form-control"
																			placeholder="Last Name" ng-model="search.lastName">
																	</div>
																</div>
																<div class="col-xs-12">&nbsp;</div>

																<!-- //College -->
																<div style="height: 33px;">

																	<div class="col-xs-4 "
																		style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; height: 33px; background-color: #217690;">
																		<div
																			style="font-family: arial; color: white; margin-top: 6px; text-align: center;">College</div>
																	</div>

																	<div class="col-xs-8" style="height: 33px;">
																		<input
																			style="height: 34px; width: 100%; margin-left: -17px;"
																			type="text" class="form-control"
																			placeholder="Search College" id="CollegeNames2"
																			name="college" ng-model="search.collge">
																	</div>
																</div>
																<div class="col-xs-12">&nbsp;</div>

																<!-- rollNo/Enrolment -->
																<div style="height: 33px;">

																	<div class="col-xs-4 "
																		style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; height: 33px; background-color: #217690;">
																		<div
																			style="font-family: arial; color: white; margin-top: 6px; text-align: center;">Roll#/Enrolment
																			ID</div>
																	</div>

																	<div class="col-xs-8 " style="height: 33px;">
																		<input
																			style="height: 33px; width: 100%; margin-left: -17px;"
																			type="text" name="studentID" class="form-control"
																			placeholder="Enrollment" ng-model="search.studentID">
																	</div>
																</div>







																<!-- <div class="panel-body no-collapse">
														<form name="searchTeamMembers" novalidate>
															<div class="col-xs-6  one1">
																<div class="col-xs-12">
																	<div class="input-group">
																		<div class="input-group-addon col-xs-4">First
																			Name</div>
																		<input type="text" name="firstName"
																			class="form-control" placeholder="First Name"
																			ng-model="search.firstName">
																	</div>
																</div>

																<div class="col-xs-12">&nbsp;</div>
																<div class="col-xs-12">
																	<div class="input-group">
																		<div class="input-group-addon col-xs-4">Mid Name</div>
																		<input type="text" name="midName" class="form-control"
																			placeholder="Middle Name" ng-model="search.midName">
																	</div>
																</div>

																<div class="col-xs-12">&nbsp;</div>
																<div class="col-xs-12">
																	<div class="input-group">
																		<span class="input-group-addon col-xs-4">Last
																			Name </span> <input type="text" name="lastName"
																			class="form-control" placeholder="Last Name"
																			ng-model="search.lastName">
																	</div>
																</div>

																<div class="col-xs-12">&nbsp;</div>
																<div class="col-xs-12">
																	<div class="input-group">
																		<span class="input-group-addon col-xs-4">College
																		</span> <input type="text" class="form-control"
																			placeholder="Search Colleges" id="CollegeNames2"
																			name="college" ng-model="search.collge">
																	</div>
																</div>
																<div class="col-xs-12">&nbsp;</div>
																<div class="col-xs-12">
																	<div class="input-group">
																		<span class="input-group-addon col-xs-4">Roll#
																		</span> <input type="text" name="studentID"
																			class="form-control" placeholder="Enrollment"
																			ng-model="search.studentID">
																	</div>
																</div> -->
																<div class="col-xs-12">&nbsp;</div>
																<div class="col-xs-12" style="text-align: center;">
																	<button data-toggle="modal"
																		data-target="#addmemberModal"
																		ng-click=searchMember(search) type="submit"
																		name="submit" class="btn btn-sm btn-success">
																		<i class="glyphicon glyphicon-search"></i>&nbsp;Search
																	</button>
																</div>
															</div>
														</form>

														<!-- Add member modal -->
														<div class="modal fade" id="addmemberModal" tabindex="-1"
															role="dialog" aria-labelledby="myModalLabel"
															aria-hidden="true">
															<div class="modal-dialog">
																<div class="modal-content">
																	<div class="modal-header">
																		<button type="button" class="close"
																			data-dismiss="modal" aria-hidden="true">&times;</button>
																		<h4 class="modal-title">Add Team Member</h4>
																	</div>
																	<div class="modal-body">
																		<div ng-show="searchResults.length>0">

																			<div class="panel-body col-xs-12  no-collapse">
																				<i style="font-size: 25px;" class="fa fa-filter"></i>&nbsp;<input
																					type="text" ng-model="filterSearch"
																					style="border-radius: 5px;" placeholder="Type Here"><br />
																				<br />
																				<ul class="list-group">
																					<li class="list-group-item" style="height: 50px"
																						ng-repeat="result in searchResults | filter:filterSearch">{{result[1]}}
																						<btn style="float: right;height: 34px;"
																							class="btn btn-info btn-small"
																							ng-click="addMember(result[0],result[1])">Choose</btn>
																						<!-- <btn style="cursor: pointer;"  
class="btn btn-info btn-small" 
											
												ng-click="viewProject(project.projId)">View</btn> -->
																					</li>
																				</ul>
																			</div>
																		</div>
																	</div>
																	<div class="modal-footer">
																		<div
																			class="alert alert-sm alert-info alert-dismissible"
																			role="alert" id="hide" ng-show="message1.length>0">
																			<p style="text-align: center">
																				<!-- <button  disabled>Show more</button> -->
																			<p ng-repeat="msg in message1"
																				style="text-align: center">{{msg}}</p>
																			</p>
																		</div>
																		<button type="button" class="btn btn-default"
																			data-dismiss="modal" ng-click="initLoad()"onClick="window.location.reload() href="javascript:window.location.reload(true)">Close</button>

																	</div>
																</div>
															</div>
														</div>

















														<!-- <div ng-show="searchResults.length>0">

															<div class="panel-body col-xs-6 pull-right no-collapse">
																<i style="font-size: 25px;" class="fa fa-filter"></i>&nbsp;<input
																	type="text" ng-model="filterSearch"
																	style="border-radius: 5px;" placeholder="Type Here"><br />
																<br />
																<ul class="list-group">
																	<li class="list-group-item" style="height: 50px"
																		ng-repeat="result in searchResults | filter:filterSearch">{{result[1]}}
																		<btn style="float: right;height: 34px;"
																			class="btn btn-info btn-small"
																			ng-click="addMember(result[0])">Choose</btn> <btn style="cursor: pointer;"  class="btn btn-info btn-small" 
											
												ng-click="viewProject(project.projId)">View</btn>
																	</li>
																</ul>
															</div>
														</div> -->
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>




					</div>
				</div>

			</div>
		</div>
	</div>

	<!-- END CONTAINER
BEGIN FOOTER -->





	<script>
		function MyCtrl($scope) {

			$scope.myvalue = false;

			$('#CollegeNames2').select2({
				minimumInputLength : 1,
				tags : [],
				tokenSeparators : [ "," ],
				maximumSelectionSize : 1,
				placeholder : "Choose Colleges",
				ajax : { // instead of writing the function to
					// execute the request we
					// use Select2's convenient helper
					url : "getSuggestedCollegeList",
					dataType : 'json',
					type : "GET",
					data : function(term) {

						return {
							q : term
						};
					},
					results : function(data) {
						return {
							results : $.map(data, function(item) {
								return {
									text : item,
									id : item
								};
							})
						};
					}
				}
			});
			$('#CollegeNames2').on("select2-blur", function(e) {

				$scope.search.collge = $('#CollegeNames2').val();
			});
			$scope.search.collge = $('#CollegeNames2').select2('data').text;
			$scope.showAlert = function() {
				$scope.myvalue = true;
			};
		}
	</script>
	<!-- END FOOTER -->
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<!-- BEGIN CORE PLUGINS -->
	<!--[if lt IE 9]>
<script src="../../assets/global/plugins/respond.min.js"></script>
<script src="../../assets/global/plugins/excanvas.min.js"></script> 
<![endif]-->

</body>
<!-- END BODY -->
</html>
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<link rel="stylesheet" href="css/select2-bootstrap.css">
<link rel="stylesheet" href="css/select2.css">
<link rel="stylesheet" href="css/jquery-ui.css">
<link rel="stylesheet" href="css/customStyle.css">
<jsp:include page="template/footer.jsp" />
