package com.ge.techpedia.service;

import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ge.techpedia.service.helper.ProjectServiceHelper;
import com.techpedia.email.exception.EmailServiceException;
import com.techpedia.projectmanagement.bean.AddCommVO;
import com.techpedia.projectmanagement.bean.ApproveOrDeclineMentorRequestVO;
import com.techpedia.projectmanagement.bean.DeleteCommVO;
import com.techpedia.projectmanagement.bean.DeleteDocVO;
import com.techpedia.projectmanagement.bean.DisplayProjectsMacroBranchVO;
import com.techpedia.projectmanagement.bean.DisplayTeamCommVO;
import com.techpedia.projectmanagement.bean.DownloadDocVO;
import com.techpedia.projectmanagement.bean.FacInitProjVO;
import com.techpedia.projectmanagement.bean.FacRejectProjVO;
import com.techpedia.projectmanagement.bean.FacultyMarkedProjectAsCompletedVO;
import com.techpedia.projectmanagement.bean.FacultyVO;
import com.techpedia.projectmanagement.bean.FollowProjectVO;
import com.techpedia.projectmanagement.bean.MentorVO;
import com.techpedia.projectmanagement.bean.ProjFollowVO;
import com.techpedia.projectmanagement.bean.ProjSubmit;
import com.techpedia.projectmanagement.bean.Project;
import com.techpedia.projectmanagement.bean.ReplaceTeamLead;
import com.techpedia.projectmanagement.bean.RequestToBeMentorVO;
import com.techpedia.projectmanagement.bean.SearchByKeyVO;
import com.techpedia.projectmanagement.bean.TeamMember;
import com.techpedia.projectmanagement.bean.UploadProjDocVO;
import com.techpedia.projectmanagement.bean.UserProfileVO;
import com.techpedia.projectmanagement.exception.AddCommentException;
import com.techpedia.projectmanagement.exception.AddNewFacultyException;
import com.techpedia.projectmanagement.exception.AddNewMentorException;
import com.techpedia.projectmanagement.exception.AddTeamMembersException;
import com.techpedia.projectmanagement.exception.ApproveOrDeclineMentorRequestException;
import com.techpedia.projectmanagement.exception.BulkUploadException;
import com.techpedia.projectmanagement.exception.CheckProjectFollowException;
import com.techpedia.projectmanagement.exception.CreateProjectException;
import com.techpedia.projectmanagement.exception.DeleteDocumentException;
import com.techpedia.projectmanagement.exception.DeleteProjectException;
import com.techpedia.projectmanagement.exception.DownloadProjDocException;
import com.techpedia.projectmanagement.exception.FacultyClosedProjectException;
import com.techpedia.projectmanagement.exception.FacultyInitiatedProjectException;
import com.techpedia.projectmanagement.exception.FacultyMarkedProjectAsCompletedException;
import com.techpedia.projectmanagement.exception.FacultyRejectedProjectException;
import com.techpedia.projectmanagement.exception.FollowTheProjectException;
import com.techpedia.projectmanagement.exception.GetAllFollowedProjectException;
import com.techpedia.projectmanagement.exception.GetAllMentorsException;
import com.techpedia.projectmanagement.exception.GetAllProjectException;
import com.techpedia.projectmanagement.exception.GetDetailOfTeamException;
import com.techpedia.projectmanagement.exception.GetPopularityException;
import com.techpedia.projectmanagement.exception.GetProjectDetailsException;
import com.techpedia.projectmanagement.exception.GetProjectFollowersException;
import com.techpedia.projectmanagement.exception.GetProjectTypeException;
import com.techpedia.projectmanagement.exception.OtherCommentsNotFoundException;
import com.techpedia.projectmanagement.exception.ProjectByLoggedInUserException;
import com.techpedia.projectmanagement.exception.RemoveCommentException;
import com.techpedia.projectmanagement.exception.RemoveMentorException;
import com.techpedia.projectmanagement.exception.RemoveProjectFollowException;
import com.techpedia.projectmanagement.exception.RemoveTeamMembersException;
import com.techpedia.projectmanagement.exception.ReplaceTeamLeadException;
import com.techpedia.projectmanagement.exception.RequestToBeMentorException;
import com.techpedia.projectmanagement.exception.SaveProjectPhotoException;
import com.techpedia.projectmanagement.exception.ResubmitProjectException;
import com.techpedia.projectmanagement.exception.SearchProjectException;
import com.techpedia.projectmanagement.exception.SubmitProjectsException;
import com.techpedia.projectmanagement.exception.SuggestedBranchNotFoundException;
import com.techpedia.projectmanagement.exception.SuggestedFacultyNotFoundException;
import com.techpedia.projectmanagement.exception.SuggestedTeamMembersNotFoundException;
import com.techpedia.projectmanagement.exception.SuggestedkeywordsNotFoundException;
import com.techpedia.projectmanagement.exception.TeamCommentsNotFoundException;
import com.techpedia.projectmanagement.exception.UpdateProjectException;
import com.techpedia.projectmanagement.exception.UploadProjDocException;

@Service
@Path("projectservice")
public class ProjectService {	
	
	@Autowired
	ProjectServiceHelper projectServiceHelper;
	
	/**
	 * @param project
	 * @return result flag
	 * @throws SaveProjectPhotoException 
	 */
	@POST
	@Path("createproject")
	@Consumes({"application/json"})
	public Response createProject(Project project) throws CreateProjectException, EmailServiceException, SaveProjectPhotoException{
		return Response.ok().status(200).entity(projectServiceHelper.createProject(project)).type("application/json").build();
	}

	/**
	 * @param branchIds
	 * @return list of suggested keyword
	 */
	@POST
	@Path("getsuggestedkeywords")
	@Consumes({"application/json"})
	@Produces({"application/json"})
	public Response getSuggestedkeywords(ArrayList<String> branchIds) throws NumberFormatException, SuggestedkeywordsNotFoundException{			
		return Response.ok().status(200).entity(projectServiceHelper.getSuggestedkeywords(branchIds)).type("application/json").build();
	}
	
	/**
	 * @param userProfileVO
	 * @return list of suggested team
	 */
	@POST
	@Path("getsuggestedteammembers")
	@Consumes({"application/json"})
	@Produces({"application/json"})
	public Response getSuggestedTeamMembers(UserProfileVO userProfileVO) throws SuggestedTeamMembersNotFoundException{
		return Response.ok().status(200).entity(projectServiceHelper.getSuggestedTeamMembers(userProfileVO)).type("application/json").build();		
	}
	
	/**
	 * @param term
	 * @return list of suggested branch
	 */
	@POST
	@Path("getsuggestedbranches")
	@Consumes({"application/json"})
	@Produces({"application/json"})
	public Response getSuggestedBranches(String term) throws SuggestedBranchNotFoundException{		
		return Response.ok().status(200).entity(projectServiceHelper.getSuggestedBranches(term)).type("application/json").build();
	}
	
	/**
	 * @param userId
	 * @return list of suggested faculty
	 */
	@POST
	@Path("getsuggestedfaculty")
	@Consumes({"application/json"})
	@Produces({"application/json"})
	public Response getSuggestedFaculty(String userId) throws SuggestedFacultyNotFoundException{		
		return Response.ok().status(200).entity(projectServiceHelper.getSuggestedFaculty(userId)).type("application/json").build();
	}
	
	/**
	 * @param facultyVO
	 * @return result flag
	 */
	@POST
	@Path("addnewfaculty")
	@Consumes({"application/json"})
	public Response addNewFaculty(FacultyVO facultyVO) throws AddNewFacultyException{
		return Response.ok().status(200).entity(projectServiceHelper.addNewFaculty(facultyVO)).type("application/json").build();
	}
	
	/**
	 * @param projId
	 * @return result flag
	 */
	@POST
	@Path("deleteproject")
	@Consumes("application/json")
	public Response deleteProject(long projId) throws DeleteProjectException{		
		return Response.ok().status(200).entity(projectServiceHelper.deleteProject(projId)).type("application/json").build();
	}
	
	/**
	 * @param projId
	 * @return Project
	 */
	@POST
	@Path("getprojectdetails")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getProjectDetails(long projId) throws GetProjectDetailsException{		
		return Response.ok().status(200).entity(projectServiceHelper.getProjectDetails(projId)).type("application/json").build();		
	}
	
	/**
	 * @param iterationCount
	 * @return ArrayList<Project>
	 */
	@POST
	@Path("getallproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getAllProject(String iterationCount) throws GetAllProjectException{				
		return Response.ok().status(200).entity(projectServiceHelper.getAllProject(iterationCount)).type("application/json").build();
	}
	
	/**
	 * @return ArrayList<Project>
	 */
	@POST
	@Path("getRecentproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getRecentproject() throws GetAllProjectException{				
		return Response.ok().status(200).entity(projectServiceHelper.getRecentproject()).type("application/json").build();
	}
	/**
	 * @return ArrayList<Project>
	 */
	@POST
	@Path("getLatestproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getLatestproject() throws GetAllProjectException{				
		return Response.ok().status(200).entity(projectServiceHelper.getLatestproject()).type("application/json").build();
	}
	
	
	/**
	 * @param iterationCount
	 * @return
	 */
	@POST
	@Path("getallmentors")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getAllMentors(String iterationCount) throws GetAllMentorsException{
		return Response.ok().status(200).entity(projectServiceHelper.getAllMentors(iterationCount)).type("application/json").build();
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */
	@POST
	@Path("getpopularity")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getPopularity(String rgstrId) throws GetPopularityException{				
		return Response.ok().status(200).entity(projectServiceHelper.getPopularity(rgstrId)).type("application/json").build();
	}
	
	/**
	 * @param project
	 * @return
	 */
	@POST
	@Path("updateproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response updateProject(Project project) throws UpdateProjectException{
		return Response.ok().status(200).entity(projectServiceHelper.updateProject(project)).type("application/json").build();
	}
	
	/**
	 * @param teamMembers
	 * @return
	 */
	@POST
	@Path("addteammembers")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response addTeamMembers(ArrayList<TeamMember> teamMembers) throws AddTeamMembersException{
		return Response.ok().status(200).entity(projectServiceHelper.addTeamMembers(teamMembers)).type("application/json").build();
	}
	
	/**
	 * @param teamMembers
	 * @return
	 */
	@POST
	@Path("removeteammembers")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response removeTeamMembers(ArrayList<TeamMember> teamMembers) throws RemoveTeamMembersException{
		return Response.ok().status(200).entity(projectServiceHelper.removeTeamMembers(teamMembers)).type("application/json").build();
	}
	
	/**
	 * @param term
	 * @param iterationCount
	 * @return
	 */
	@POST
	@Path("searchprojectbykeyword")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response searchProjectByKeyword(SearchByKeyVO searchByKeyVO) throws SearchProjectException{
		return Response.ok().status(200).entity(projectServiceHelper.searchProjectByKeyword(searchByKeyVO)).type("application/json").build();
	}
	
	/**
	 * @param projId
	 * @param mentorRgstrId
	 * @return
	 */
	@POST
	@Path("addnewmentor")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response addNewMentor(MentorVO mentorVO) throws AddNewMentorException{		
		return Response.ok().status(200).entity(projectServiceHelper.addNewMentor(mentorVO)).type("application/json").build();
	}
	
	/**
	 * @param projId
	 * @param mentorRgstrId
	 * @return
	 */
	@POST
	@Path("deletementor")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response deleteMentor(MentorVO mentorVO) throws RemoveMentorException{		
		return Response.ok().status(200).entity(projectServiceHelper.deleteMentor(mentorVO)).type("application/json").build();
	}
	
	/**
	 * @param projId
	 * @param userRgstrNo
	 * @return
	 */
	@POST
	@Path("followtheproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response followTheProject(FollowProjectVO followProjectVO) throws FollowTheProjectException{		
		return Response.ok().status(200).entity(projectServiceHelper.followTheProject(followProjectVO)).type("application/json").build();
	}
	
	/**
	 * @param projId
	 * @return
	 */
	@POST
	@Path("displayteamcomments")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response displayTeamComments(DisplayTeamCommVO displayTeamCommVO) throws TeamCommentsNotFoundException{
		return Response.ok().status(200).entity(projectServiceHelper.displayTeamComments(displayTeamCommVO)).type("application/json").build();
	}

	/**
	 * @param projId
	 * @param regstrId
	 * @param projComment
	 * @return
	 */
	@POST
	@Path("addcomment")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response addComment(AddCommVO addCommVO) throws AddCommentException{		
		return Response.ok().status(200).entity(projectServiceHelper.addComment(addCommVO)).type("application/json").build();
	}

	/**
	 * @param projectId
	 * @param commentId
	 * @param rgstrId
	 * @return
	 */
	@POST
	@Path("deletecomment")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response deleteComment(DeleteCommVO deleteCommVO) throws RemoveCommentException{		
		return Response.ok().status(200).entity(projectServiceHelper.deleteComment(deleteCommVO)).type("application/json").build();
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */	
	@POST
	@Path("getallfollowedproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getAllFollowedProject(String rgstrId) throws GetAllFollowedProjectException{
		return Response.ok().status(200).entity(projectServiceHelper.getAllFollowedProject(rgstrId)).type("application/json").build();
	}
	
	/**
	 * @param teamId
	 * @return
	 */
	@POST
	@Path("getdetailofteam")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getDetailOfTeam(String teamId) throws GetDetailOfTeamException{
		return Response.ok().status(200).entity(projectServiceHelper.getDetailOfTeam(teamId)).type("application/json").build();
	}
	
	/**
	 * @param projFollowVO
	 * @return
	 */
	@POST
	@Path("removeprojectfollow")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response removeProjectFollow(ProjFollowVO projFollowVO) throws RemoveProjectFollowException{
		return Response.ok().status(200).entity(projectServiceHelper.removeProjectFollow(projFollowVO)).type("application/json").build();
	}
	
	/**
	 * @param projFollowVO
	 * @return
	 */
	@POST
	@Path("checkprojectfollow")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response checkProjectFollow(ProjFollowVO projFollowVO) throws CheckProjectFollowException{
		return Response.ok().status(200).entity(projectServiceHelper.checkProjectFollow(projFollowVO)).type("application/json").build();
	}
	
	/**
	 * @param projSubmit
	 * @return
	 * @throws SubmitProjectsException
	 * @throws EmailServiceException
	 */
	@POST
	@Path("submitproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response submitProject(ProjSubmit projSubmit) throws SubmitProjectsException, EmailServiceException{		
		return Response.ok().status(200).entity(projectServiceHelper.submitProject(projSubmit)).type("application/json").build();
	}
	
	/**
	 * @param uploadProjDocVO
	 * @return
	 */
	@POST
	@Path("uploadprojectdocument")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response uploadProjectDocument(UploadProjDocVO uploadProjDocVO) throws UploadProjDocException{
		return Response.ok().status(200).entity(projectServiceHelper.uploadProjectDocument(uploadProjDocVO)).type("application/json").build();
	}
	
	/**
	 * @param downloadDocVO
	 * @return
	 */
	@POST
	@Path("downloadprojectdocument")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response downloadProjectDocument(DownloadDocVO downloadDocVO) throws DownloadProjDocException{
		return Response.ok().status(200).entity(projectServiceHelper.downloadProjectDocument(downloadDocVO)).type("application/json").build();
	}
	
	/**
	 * @param displayTeamCommVO
	 * @return
	 */
	@POST
	@Path("displayothercomments")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response displayOtherComments(DisplayTeamCommVO displayTeamCommVO) throws OtherCommentsNotFoundException{
		return Response.ok().status(200).entity(projectServiceHelper.displayOtherComments(displayTeamCommVO)).type("application/json").build();
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */
	@POST
	@Path("getprojectsbyLoggedinuser")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getProjectsByLoggedInUser(String rgstrId) throws ProjectByLoggedInUserException{
		return Response.ok().status(200).entity(projectServiceHelper.getProjectsByLoggedInUser(rgstrId)).type("application/json").build();
	}
	
	/**
	 * @param exlByteArray
	 * @return
	 */
	@POST
	@Path("bulkuploadproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response bulkUploadProject(String exlByteArray) throws BulkUploadException{
		return Response.ok().status(200).entity(projectServiceHelper.bulkUploadProject(exlByteArray)).type("application/json").build();
	}
	
	@POST
	@Path("getprojectfollowers")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getProjectFollowers() throws GetProjectFollowersException{
		return Response.ok().status(200).entity(projectServiceHelper.getProjectFollowers()).type("application/json").build();
	}
	
	@POST
	@Path("deleteprojectdocument")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response deleteProjectDocument(DeleteDocVO deleteDocVO) throws DeleteDocumentException{
		return Response.ok().status(200).entity(projectServiceHelper.deleteProjectDocument(deleteDocVO)).type("application/json").build();
	}
	
	@POST
	@Path("facultyinitiatedproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response facultyInitiatedProject(FacInitProjVO facInitProjVO) throws FacultyInitiatedProjectException{
		return Response.ok().status(200).entity(projectServiceHelper.facultyInitiatedProject(facInitProjVO)).type("application/json").build();
	}
	
	@POST
	@Path("facultyclosedproject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response facultyClosedProject(FacInitProjVO facInitProjVO) throws FacultyClosedProjectException{
		return Response.ok().status(200).entity(projectServiceHelper.facultyClosedProject(facInitProjVO)).type("application/json").build();
	}	
	
	@POST
	@Path("getprojecttype")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getProjectType() throws GetProjectTypeException{
		return Response.ok().status(200).entity(projectServiceHelper.getProjectType()).type("application/json").build();
	}
	
	@POST
	@Path("getProjectsByMacroBranch")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getProjectsByMacroBranch(DisplayProjectsMacroBranchVO displayProjectsMacroBranchVO) throws ProjectByLoggedInUserException{
		return Response.ok().status(200).entity(projectServiceHelper.getProjectsByMacroBranch(displayProjectsMacroBranchVO)).type("application/json").build();
	}
	
	@POST
	@Path("replaceTeamLead")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response replaceTeamLead(ReplaceTeamLead replaceTeamLead) throws ReplaceTeamLeadException {
		return Response.ok().status(200).entity(projectServiceHelper.replaceTeamLead(replaceTeamLead)).type("application/json").build();
	}
	
	@POST
	@Path("getCompletedProject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getCompletedProject() throws GetAllProjectException{				
		return Response.ok().status(200).entity(projectServiceHelper.getCompletedProject()).type("application/json").build();
	}
	
	@POST
	@Path("getWorkingProject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getWorkingProject() throws GetAllProjectException{				
		return Response.ok().status(200).entity(projectServiceHelper.getWorkingProject()).type("application/json").build();
	}
	
	@POST
	@Path("getCompletedProjectByLoggedInUser")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getCompletedProjectByLoggedInUser(String rgstrId) throws ProjectByLoggedInUserException{
		return Response.ok().status(200).entity(projectServiceHelper.getCompletedProjectByLoggedInUser(rgstrId)).type("application/json").build();
	}
	
	@POST
	@Path("getWorkingProjectByLoggedInUser")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response getWorkingProjectByLoggedInUser(String rgstrId) throws ProjectByLoggedInUserException{
		return Response.ok().status(200).entity(projectServiceHelper.getWorkingProjectByLoggedInUser(rgstrId)).type("application/json").build();
	}
	
	@POST
	@Path("facultyRejectedProject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response facultyRejectedProject(FacRejectProjVO facRejectProjVO) throws FacultyRejectedProjectException, EmailServiceException{
		return Response.ok().status(200).entity(projectServiceHelper.facultyRejectedProject(facRejectProjVO)).type("application/json").build();
	}
	
	@POST
	@Path("resubmitProject")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response resubmitProject(String projId) throws ResubmitProjectException, EmailServiceException{
		return Response.ok().status(200).entity(projectServiceHelper.resubmitProject(projId)).type("application/json").build();
	}
	
	@POST
	@Path("facultyMarkedProjectAsCompleted")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response facultyMarkedProjectAsCompleted(FacultyMarkedProjectAsCompletedVO facultyMarkedProjectAsCompletedVO) throws FacultyMarkedProjectAsCompletedException, EmailServiceException{
		return Response.ok().status(200).entity(projectServiceHelper.facultyMarkedProjectAsCompleted(facultyMarkedProjectAsCompletedVO)).type("application/json").build();
	}	
	
	@POST
	@Path("requestToBeMentor")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response requestToBeMentor(RequestToBeMentorVO requestToBeMentorVO) throws RequestToBeMentorException, EmailServiceException {
		return Response.ok().status(200).entity(projectServiceHelper.requestToBeMentor(requestToBeMentorVO)).type("application/json").build();
	}
	
	@POST
	@Path("approveOrDeclineMentorRequest")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response approveOrDeclineMentorRequest(ApproveOrDeclineMentorRequestVO approveOrDeclineMentorRequestVO) throws ApproveOrDeclineMentorRequestException, EmailServiceException {
		return Response.ok().status(200).entity(projectServiceHelper.approveOrDeclineMentorRequest(approveOrDeclineMentorRequestVO)).type("application/json").build();
	}
}
