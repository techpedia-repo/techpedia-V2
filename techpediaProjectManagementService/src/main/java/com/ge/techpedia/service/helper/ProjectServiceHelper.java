package com.ge.techpedia.service.helper;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ge.techpedia.constant.ProjectManagementServiceConstant;
import com.ge.techpedia.service.response.ProjectServiceResponse;
import com.google.gson.Gson;
import com.techpedia.email.exception.EmailServiceException;
import com.techpedia.projectmanagement.bean.AddCommVO;
import com.techpedia.projectmanagement.bean.AddNewFacultyResponseVO;
import com.techpedia.projectmanagement.bean.ApproveOrDeclineMentorRequestResponse;
import com.techpedia.projectmanagement.bean.ApproveOrDeclineMentorRequestVO;
import com.techpedia.projectmanagement.bean.Branch;
import com.techpedia.projectmanagement.bean.CreateProjectResponseVO;
import com.techpedia.projectmanagement.bean.DeleteCommVO;
import com.techpedia.projectmanagement.bean.DeleteDocVO;
import com.techpedia.projectmanagement.bean.DisplayProjectsMacroBranchVO;
import com.techpedia.projectmanagement.bean.DisplayTeamCommVO;
import com.techpedia.projectmanagement.bean.DownloadDocVO;
import com.techpedia.projectmanagement.bean.FacInitProjVO;
import com.techpedia.projectmanagement.bean.FacRejectProjResponse;
import com.techpedia.projectmanagement.bean.FacRejectProjVO;
import com.techpedia.projectmanagement.bean.Faculty;
import com.techpedia.projectmanagement.bean.FacultyMarkedProjectAsCompletedResponse;
import com.techpedia.projectmanagement.bean.FacultyMarkedProjectAsCompletedVO;
import com.techpedia.projectmanagement.bean.FacultyVO;
import com.techpedia.projectmanagement.bean.FollowProjectVO;
import com.techpedia.projectmanagement.bean.MentorVO;
import com.techpedia.projectmanagement.bean.ProjFollowVO;
import com.techpedia.projectmanagement.bean.ProjSubmit;
import com.techpedia.projectmanagement.bean.Project;
import com.techpedia.projectmanagement.bean.ProjectDocument;
import com.techpedia.projectmanagement.bean.ProjectTeamComment;
import com.techpedia.projectmanagement.bean.ProjectTeamDetailVO;
import com.techpedia.projectmanagement.bean.ProjectType;
import com.techpedia.projectmanagement.bean.ReplaceTeamLead;
import com.techpedia.projectmanagement.bean.RequestToBeMentorResponse;
import com.techpedia.projectmanagement.bean.RequestToBeMentorVO;
import com.techpedia.projectmanagement.bean.SaveProjectPhoto;
import com.techpedia.projectmanagement.bean.ResubmitProjectResponse;
import com.techpedia.projectmanagement.bean.SearchByKeyVO;
import com.techpedia.projectmanagement.bean.Team;
import com.techpedia.projectmanagement.bean.TeamMember;
import com.techpedia.projectmanagement.bean.UploadProjDocVO;
import com.techpedia.projectmanagement.bean.UserProfileVO;
import com.techpedia.projectmanagement.dao.ProjectDao;
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
public class ProjectServiceHelper {

	private Logger log = LoggerFactory.getLogger(ProjectServiceHelper.class.getName());
	
	@Autowired
	ProjectDao projectDao;
	
	
	/**
	 * @param project
	 * @return result flag
	 * @throws SaveProjectPhotoException 
	 */
	public  String createProject(Project project) throws CreateProjectException, EmailServiceException, SaveProjectPhotoException{

		//log.debug("ProjectServiceHelper.createProject:Start");
		ProjectServiceResponse response = new ProjectServiceResponse();
		CreateProjectResponseVO createProjectResponseVO;	
		String result = "N";
		try {
			createProjectResponseVO = projectDao.createProject(project);
			if(!(project.getImgName().equalsIgnoreCase("")&&project.getFooterImgName().equalsIgnoreCase(""))){
			SaveProjectPhoto saveProjectPhoto =new SaveProjectPhoto();
			saveProjectPhoto.setProjectId(project.getProjId());
			saveProjectPhoto.setImgName(project.getImgName());
			saveProjectPhoto.setImgByteArray(project.getImgByteArray());
			saveProjectPhoto.setFooterImgName(project.getFooterImgName());
			saveProjectPhoto.setFooterImgByteArray(project.getFooterImgByteArray());
			result = projectDao.UploadProjectPhoto(saveProjectPhoto);
			}
			
			if(createProjectResponseVO.getStatus() == "Y" && project.getImgName().equalsIgnoreCase("") && project.getFooterImgName().equalsIgnoreCase("")){	
				
				//ProjectManagementEMailHelper.sendEmail(project, createProjectResponseVO);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_CREATE_SUCCESS);
				return gson.toJson(response);
			}
			else if(createProjectResponseVO.getStatus() == "Y" && result == "Y"){
				//ProjectManagementEMailHelper.sendEmail(project, createProjectResponseVO);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_CREATE_SUCCESS);
				return gson.toJson(response);
			}
			else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_CREATE_FAILURE);
				return gson.toJson(response);
			}
		} catch (CreateProjectException e) {
			throw e;
		}		
	}

	/**
	 * @param branchIds
	 * @return list of suggested keyword
	 */
	public  String getSuggestedkeywords(ArrayList<String> branchIds) throws NumberFormatException, SuggestedkeywordsNotFoundException{
		
		ArrayList<Integer> branches = null;
		ArrayList<String> suggestedKeywords = null;		
		try {
			branches = new ArrayList<Integer>(branchIds.size()); 
			for (String branchId : branchIds) { 
				branches.add(Integer.valueOf(branchId)); 
			}
			suggestedKeywords = projectDao.getSuggestedkeywords(branches);
			if(suggestedKeywords != null){
				Gson gson = new Gson();
				return gson.toJson(suggestedKeywords);
			}
		} catch (NumberFormatException e) {
			throw e;
		} catch (SuggestedkeywordsNotFoundException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;			
	}
	
	/**
	 * @param userProfileVO
	 * @return list of suggested team
	 */
	public  String getSuggestedTeamMembers(UserProfileVO userProfileVO) throws SuggestedTeamMembersNotFoundException{
		ArrayList<Team> teams = null;		
		try {
			teams = projectDao.getSuggestedTeamMembers(userProfileVO);
			if(teams != null){
				Gson gson = new Gson();
				return gson.toJson(teams);
			}
		} catch (SuggestedTeamMembersNotFoundException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param term
	 * @return list of suggested branch
	 */
	public  String getSuggestedBranches(String term) throws SuggestedBranchNotFoundException{		
		ArrayList<Branch> branches = null;		
		try {
			branches = projectDao.getSuggestedBranches(term);
			if(branches != null){
				Gson gson = new Gson();
				return gson.toJson(branches);
			}
		} catch (SuggestedBranchNotFoundException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param userId
	 * @return list of suggested faculty
	 */
	public  String getSuggestedFaculty(String userId) throws SuggestedFacultyNotFoundException{
		ArrayList<Faculty> faculties = null;		
		try {
			faculties = projectDao.getSuggestedFaculty(userId);
			if(faculties != null){
				Gson gson = new Gson();
				return gson.toJson(faculties);
			}
		} catch (SuggestedFacultyNotFoundException e) {
			e.printStackTrace();
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param facultyVO
	 * @return result flag
	 */
	public  String addNewFaculty(FacultyVO facultyVO){
		AddNewFacultyResponseVO addNewFacultyResponseVO = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			addNewFacultyResponseVO = projectDao.addNewFaculty(facultyVO);
			if(addNewFacultyResponseVO.getRgstrId() != ""){
				FacultyEMailHelper.sendEmail(facultyVO, addNewFacultyResponseVO);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_CREATE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_CREATE_FAILURE);
				return gson.toJson(response);
			}
		} catch (AddNewFacultyException e) {
			e.printStackTrace();
		} catch (EmailServiceException e) {
			e.printStackTrace();
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param projId
	 * @return result flag
	 */
	public  String deleteProject(long projId) throws DeleteProjectException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.deleteProject(projId);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_DELETE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_DELETE_FAILURE);
				return gson.toJson(response);
			}
		} catch (DeleteProjectException e) {
			throw e;
		}		
	}
	
	/**
	 * @param projId
	 * @return Project
	 */
	public  String getProjectDetails(long projId) throws GetProjectDetailsException{
		Project project = null;
		try {
			project = projectDao.getProjectDetails(projId);
			if(project != null){
				Gson gson = new Gson();
				return gson.toJson(project);
			}
		} catch (GetProjectDetailsException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param iterationCount
	 * @return ArrayList<Project>
	 */
	public  String getAllProject(String iterationCount) throws GetAllProjectException{
		ArrayList<Project> projects = null;
		try {
			projects = projectDao.getAllProject(iterationCount);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetAllProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public  String getRecentproject() throws GetAllProjectException{
		ArrayList<Project> projects =null;
		try {
			projects = projectDao.getRecentProject();
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetAllProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public  String getLatestproject() throws GetAllProjectException{
		ArrayList<Project> projects =null;
		try {
			projects = projectDao.getLatestProject();
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetAllProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	/**
	 * @param iterationCount
	 * @return
	 */
	public  String getAllMentors(String iterationCount) throws GetAllMentorsException{
		ArrayList<UserProfileVO> userProfileVOs = null;
		//log.debug("ProjectServiceHelper.getAllMentors:Start");
		try {
			userProfileVOs = projectDao.getAllMentors(iterationCount);
			if(userProfileVOs != null){
				Gson gson = new Gson();
				return gson.toJson(userProfileVOs);
			}
		} catch (GetAllMentorsException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */
	public  String getPopularity(String rgstrId) throws GetPopularityException{
		String popularity = null;
		try {
			popularity = projectDao.getPopularity(rgstrId);
			if(popularity != null){
				Gson gson = new Gson();
				return gson.toJson(popularity);
			}
		} catch (GetPopularityException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param project
	 * @return
	 */
	public  String updateProject(Project project) throws UpdateProjectException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.updateProject(project);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_UPDATE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_UPDATE_FAILURE);
				return gson.toJson(response);
			}
		} catch (UpdateProjectException e) {
			throw e;
		}		
	}
	
	/**
	 * @param teamMembers
	 * @return
	 */
	public  String addTeamMembers(ArrayList<TeamMember> teamMembers) throws AddTeamMembersException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.addTeamMembers(teamMembers);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.TEAM_MEMBER_ADD_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.TEAM_MEMBER_ADD_FAILURE);
				return gson.toJson(response);
			}
		} catch (AddTeamMembersException e) {
			throw e;
		}		
	}
	
	/**
	 * @param teamMembers
	 * @return
	 */
	public  String removeTeamMembers(ArrayList<TeamMember> teamMembers) throws RemoveTeamMembersException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.removeTeamMembers(teamMembers);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.TEAM_MEMBER_REMOVE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.TEAM_MEMBER_REMOVE_FAILURE);
				return gson.toJson(response);
			}
		} catch (RemoveTeamMembersException e) {
			throw e;
		}		
	}
	
	/**
	 * @param term
	 * @param iterationCount
	 * @return
	 */
	public  String searchProjectByKeyword(SearchByKeyVO searchByKeyVO) throws SearchProjectException{
		ArrayList<Project> projects = null;
		try {
			projects = projectDao.searchProjectByKeyword(searchByKeyVO);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (SearchProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param projId
	 * @param mentorRgstrId
	 * @return
	 */
	public  String addNewMentor(MentorVO mentorVO) throws AddNewMentorException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.addNewMentor(mentorVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.MENTOR_ADD_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.MENTOR_ADD_FAILURE);
				return gson.toJson(response);
			}
		} catch (AddNewMentorException e) {
			throw e;
		}		
	}
	
	/**
	 * @param projId
	 * @param mentorRgstrId
	 * @return
	 */
	public  String deleteMentor(MentorVO mentorVO) throws RemoveMentorException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.deleteMentor(mentorVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.MENTOR_REMOVE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.MENTOR_REMOVE_FAILURE);
				return gson.toJson(response);
			}
		} catch (RemoveMentorException e) {
			throw e;
		}		
	}
	
	/**
	 * @param projId
	 * @param userRgstrNo
	 * @return
	 */
	public  String followTheProject(FollowProjectVO followProjectVO) throws FollowTheProjectException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.followTheProject(followProjectVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FOLLOW_PROJECT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.FOLLOW_PROJECT_FAILURE);
				return gson.toJson(response);
			}
		} catch (FollowTheProjectException e) {
			throw e;
		}		
	}
	
	/**
	 * @param projId
	 * @return
	 */
	public  String displayTeamComments(DisplayTeamCommVO displayTeamCommVO) throws TeamCommentsNotFoundException{
		 ArrayList<ProjectTeamComment> comments = null;
		try {
			comments = projectDao.displayTeamComments(displayTeamCommVO);
			if(comments != null){
				Gson gson = new Gson();
				return gson.toJson(comments);
			}
		} catch (TeamCommentsNotFoundException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}

	/**
	 * @param projId
	 * @param regstrId
	 * @param projComment
	 * @return
	 */
	public  String addComment(AddCommVO addCommVO) throws AddCommentException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.addComment(addCommVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.COMMENT_ADD_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.COMMENT_ADD_FAILURE);
				return gson.toJson(response);
			}
		} catch (AddCommentException e) {
			throw e;
		}		
	}

	/**
	 * @param projectId
	 * @param commentId
	 * @param rgstrId
	 * @return
	 */
	public  String deleteComment(DeleteCommVO deleteCommVO) throws RemoveCommentException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.deleteComment(deleteCommVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.DELETE_COMMENT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.DELETE_COMMENT_FAILURE);
				return gson.toJson(response);
			}
		} catch (RemoveCommentException e) {
			throw e;
		}		
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */	
	public  String getAllFollowedProject(String rgstrId) throws GetAllFollowedProjectException{
		ArrayList<Project> projects = null;
		try {
			projects = projectDao.getAllFollowedProject(rgstrId);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetAllFollowedProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param teamId
	 * @return
	 */
	public  String getDetailOfTeam(String teamId) throws GetDetailOfTeamException{
		ArrayList<ProjectTeamDetailVO> teamDetailVOs = null;
		try {
			teamDetailVOs = projectDao.getDetailOfTeam(teamId);
			if(teamDetailVOs != null){
				Gson gson = new Gson();
				return gson.toJson(teamDetailVOs);
			}
		} catch (GetDetailOfTeamException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param projFollowVO
	 * @return
	 */
	public  String removeProjectFollow(ProjFollowVO projFollowVO) throws RemoveProjectFollowException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.removeProjectFollow(projFollowVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.DELETE_FOLLOW_PROJECT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.DELETE_FOLLOW_PROJECT_FAILURE);
				return gson.toJson(response);
			}
		} catch (RemoveProjectFollowException e) {			
			throw e;
		}
	}
	
	/**
	 * @param projFollowVO
	 * @return
	 */
	public  String checkProjectFollow(ProjFollowVO projFollowVO) throws CheckProjectFollowException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.checkProjectFollow(projFollowVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.CHECK_FOLLOW_PROJECT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.CHECK_FOLLOW_PROJECT_FAILURE);
				return gson.toJson(response);
			}
		} catch (CheckProjectFollowException e) {			
			throw e;
		}
	}
	
	/**
	 * @param projSubmit
	 * @return
	 * @throws SubmitProjectsException
	 * @throws EmailServiceException
	 */
	public  String submitProject(ProjSubmit projSubmit) throws SubmitProjectsException, EmailServiceException{		
		Project project = new Project();
		String result = "N";
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			project = projectDao.submitProject(projSubmit);
			if(project.getProjTitle() != ""){
				ProjectManagementEMailHelper.sendEmail(project);
				result = "Y";
				if(result == "Y"){				
					Gson gson = new Gson();
					response.setStatus(ProjectManagementServiceConstant.SUCCESS);
					response.setDescription(ProjectManagementServiceConstant.PROJECT_SUBMITION_SUCCESS);
					return gson.toJson(response);
				}else{
					Gson gson = new Gson();
					response.setStatus(ProjectManagementServiceConstant.FAILURE);
					response.setDescription(ProjectManagementServiceConstant.PROJECT_SUBMITION_FAILURE);
					return gson.toJson(response);
				}
			}
		} catch (SubmitProjectsException e) {			
			throw e;
		}
		return result;
	}
	
	/**
	 * @param uploadProjDocVO
	 * @return
	 */
	public  String uploadProjectDocument(UploadProjDocVO uploadProjDocVO) throws UploadProjDocException{
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.uploadProjectDocument(uploadProjDocVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_DOC_UPLOAD_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_DOC_UPLOAD_FAILURE);
				return gson.toJson(response);
			}
		} catch (UploadProjDocException e) {			
			throw e;
		}		
	}
	
	/**
	 * @param downloadDocVO
	 * @return
	 */
	public  String downloadProjectDocument(DownloadDocVO downloadDocVO) throws DownloadProjDocException{
		ArrayList<ProjectDocument> projectDocuments = null;
		try {
			projectDocuments = projectDao.downloadProjectDocument(downloadDocVO);
			if(projectDocuments != null){
				Gson gson = new Gson();
				return gson.toJson(projectDocuments);
			}
		} catch (DownloadProjDocException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param displayTeamCommVO
	 * @return
	 */
	public  String displayOtherComments(DisplayTeamCommVO displayTeamCommVO) throws OtherCommentsNotFoundException{
		ArrayList<ProjectTeamComment> projectTeamComments = null;
		try {
			projectTeamComments = projectDao.displayOtherComments(displayTeamCommVO);
			if(projectTeamComments != null){
				Gson gson = new Gson();
				return gson.toJson(projectTeamComments);
			}
		} catch (OtherCommentsNotFoundException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */
	public  String getProjectsByLoggedInUser(String rgstrId) throws ProjectByLoggedInUserException{
		ArrayList<Project> projects = new ArrayList<Project>();
		try {
			projects = projectDao.getProjectsByLoggedInUser(rgstrId);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (ProjectByLoggedInUserException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param exlByteArray
	 * @return
	 */
	public  String bulkUploadProject(String exlByteArray) throws BulkUploadException{
		String result = null;
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			result = projectDao.bulkUploadProject(exlByteArray);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_UPLOAD_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_UPLOAD_FAILURE);
				return gson.toJson(response);
			}
		} catch (BulkUploadException e) {			
			throw e;
		}		
	}
	
	public  String getProjectFollowers() throws GetProjectFollowersException{
		ArrayList<Project> projects = null;
		try {
			projects = projectDao.getProjectFollowers();
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetProjectFollowersException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public  String deleteProjectDocument(DeleteDocVO deleteDocVO) throws DeleteDocumentException{
		String result = null;
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			result = projectDao.deleteProjectDocument(deleteDocVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_DOC_DELETE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_DOC_DELETE_FAILURE);
				return gson.toJson(response);
			}
		} catch (DeleteDocumentException e) {			
			throw e;
		}		
	}
	
	public  String facultyInitiatedProject(FacInitProjVO facInitProjVO) throws FacultyInitiatedProjectException{
		String result = null;
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			result = projectDao.facultyInitiatedProject(facInitProjVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_INITIATED_PROJECT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_INITIATED_PROJECT_FAILURE);
				return gson.toJson(response);
			}
		} catch (FacultyInitiatedProjectException e) {			
			throw e;
		}		
	}
	
	public  String facultyClosedProject(FacInitProjVO facInitProjVO) throws FacultyClosedProjectException{
		String result = null;
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			result = projectDao.facultyClosedProject(facInitProjVO);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_CLOSED_PROJECT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_CLOSED_PROJECT_FAILURE);
				return gson.toJson(response);
			}
		} catch (FacultyClosedProjectException e) {			
			throw e;
		}		
	}
	
	public  String getProjectType() throws GetProjectTypeException{
		ArrayList<ProjectType> projectTypes = null;
		try {
			projectTypes = projectDao.getProjectType();
			if(projectTypes != null){
				Gson gson = new Gson();
				return gson.toJson(projectTypes);
			}
		} catch (GetProjectTypeException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public  String getProjectsByMacroBranch(DisplayProjectsMacroBranchVO displayProjectsMacroBranchVO) throws ProjectByLoggedInUserException{
		ArrayList<Project> projects = null;
		try {
			projects = projectDao.getProjectsByMacroBranch(displayProjectsMacroBranchVO);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (ProjectByLoggedInUserException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public  String replaceTeamLead(ReplaceTeamLead replaceTeamLead) throws ReplaceTeamLeadException {
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			result = projectDao.replaceTeamLead(replaceTeamLead);
			if(result == "Y"){				
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.TEAM_LEADER_REPLACE_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.TEAM_LEADER_REPLACE_FAILURE);
				return gson.toJson(response);
			}
		} catch (ReplaceTeamLeadException e) {			
			throw e;
		}		
	}
	
	public Object getCompletedProject() throws GetAllProjectException{
		ArrayList<Project> projects =null;
		try {
			projects = projectDao.getCompletedProject();
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetAllProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public Object getWorkingProject() throws GetAllProjectException{
		ArrayList<Project> projects =null;
		try {
			projects = projectDao.getWorkingProject();
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (GetAllProjectException e) {
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */
	public  String getCompletedProjectByLoggedInUser(String rgstrId) throws ProjectByLoggedInUserException{
		ArrayList<Project> projects = new ArrayList<Project>();
		try {
			projects = projectDao.getCompletedProjectByLoggedInUser(rgstrId);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (ProjectByLoggedInUserException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	/**
	 * @param rgstrId
	 * @return
	 */
	public  String getWorkingProjectByLoggedInUser(String rgstrId) throws ProjectByLoggedInUserException{
		ArrayList<Project> projects = new ArrayList<Project>();
		try {
			projects = projectDao.getWorkingProjectByLoggedInUser(rgstrId);
			if(projects != null){
				Gson gson = new Gson();
				return gson.toJson(projects);
			}
		} catch (ProjectByLoggedInUserException e) {			
			throw e;
		}
		return ProjectManagementServiceConstant.EMPTY_STRING;
	}
	
	public  String facultyRejectedProject(FacRejectProjVO facRejectProjVO) throws FacultyRejectedProjectException, EmailServiceException{
		
		FacRejectProjResponse facRejectProjResponse = new FacRejectProjResponse();
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			facRejectProjResponse = projectDao.facultyRejectedProject(facRejectProjVO);
			if(facRejectProjResponse.getStatus() == "Y"){
				//FacultyEMailHelper.sendFacultyRejectedProjectEmail(facRejectProjResponse);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_REJECTED_PROJECT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_REJECTED_PROJECT_FAILURE);
				return gson.toJson(response);
			}
		} catch (FacultyRejectedProjectException e) {			
			throw e;
		}		
	}

	public String resubmitProject(String projId) throws ResubmitProjectException, EmailServiceException {
		
		ResubmitProjectResponse resubmitProjectResponse = new ResubmitProjectResponse();
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			resubmitProjectResponse = projectDao.resubmitProject(projId);
			if(resubmitProjectResponse.getStatus() == "Y"){
				ProjectManagementEMailHelper.sendResubmitProjectEmail(resubmitProjectResponse.getProject(), resubmitProjectResponse);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_RESUBMIT_SUCCESS);
				return gson.toJson(response);
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.PROJECT_RESUBMIT_FAILURE);
				return gson.toJson(response);
			}
		} catch (ResubmitProjectException e) {			
			throw e;
		}	
	}

	public String facultyMarkedProjectAsCompleted(FacultyMarkedProjectAsCompletedVO facultyMarkedProjectAsCompletedVO)  throws FacultyMarkedProjectAsCompletedException, EmailServiceException {
		FacultyMarkedProjectAsCompletedResponse facultyMarkedProjectAsCompletedResponse = new FacultyMarkedProjectAsCompletedResponse();
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			facultyMarkedProjectAsCompletedResponse = projectDao.facultyMarkedProjectAsCompleted(facultyMarkedProjectAsCompletedVO);
			if(facultyMarkedProjectAsCompletedResponse.getStatus() == "Y"){		
				//FacultyEMailHelper.sendFacultyMarkedProjectAsCompleteEmail(facultyMarkedProjectAsCompletedResponse);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_MARKED_PROJECT_AS_COMPLETED_SUCCESS);
				return gson.toJson(response);
			}else if(facultyMarkedProjectAsCompletedResponse.getStatus() == "N"){
				//FacultyEMailHelper.sendFacultyRejectedProjectAtClosureEmail(facultyMarkedProjectAsCompletedResponse);
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_REJECTED_PROJECT_AT_CLOSURE_SUCCESS);
				return gson.toJson(response);
				
			}else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.FACULTY_MARKED_PROJECT_AS_COMPLETED_FAILURE);
				return gson.toJson(response);
			}
		} catch (FacultyMarkedProjectAsCompletedException e) {			
			throw e;
		}		
	}

	public String requestToBeMentor(RequestToBeMentorVO requestToBeMentorVO) throws EmailServiceException, RequestToBeMentorException {
		RequestToBeMentorResponse requestToBeMentorResponse = new RequestToBeMentorResponse();
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			requestToBeMentorResponse = projectDao.requestToBeMentor(requestToBeMentorVO);
			
			//to be commented
			if(requestToBeMentorResponse.getStatus() == "Y"){
				log.info("getMentorEmailId :: "+requestToBeMentorResponse.getMentorEmailId());
				log.info("getMentorFname :: "+requestToBeMentorResponse.getMentorFname());
				log.info("getMentorLname :: "+requestToBeMentorResponse.getMentorLname());
				log.info("getProjTitle :: "+requestToBeMentorResponse.getProjTitle());
				log.info("getTeamLeaderEmailId :: "+requestToBeMentorResponse.getTeamLeaderEmailId());
				log.info("getTeamLeaderFname :: "+requestToBeMentorResponse.getTeamLeaderFname());
				log.info("getTeamLeaderLname :: "+requestToBeMentorResponse.getTeamLeaderLname());
				log.info("getTeamLeaderMname :: "+requestToBeMentorResponse.getTeamLeaderMname());
				log.info("getStatus :: "+requestToBeMentorResponse.getStatus());
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.REQUEST_TO_BE_MENTOR_SUCCESS);
				return gson.toJson(response);
			}
			
			//to be uncommented
			/*if(requestToBeMentorResponse.getStatus() == "Y" && ProjectManagementEMailHelper.sendRequestToBeMentorEmail(requestToBeMentorResponse)){		
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.REQUEST_TO_BE_MENTOR_SUCCESS);
				return gson.toJson(response);
			}*/
			else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.REQUEST_TO_BE_MENTOR_FAILURE);
				return gson.toJson(response);
			}
		} catch (RequestToBeMentorException e) {			
			throw e;
		}
	}

	public String approveOrDeclineMentorRequest(ApproveOrDeclineMentorRequestVO approveOrDeclineMentorRequestVO) throws EmailServiceException, ApproveOrDeclineMentorRequestException {
		ApproveOrDeclineMentorRequestResponse approveOrDeclineMentorRequestResponse = new ApproveOrDeclineMentorRequestResponse();
		ProjectServiceResponse  response = new ProjectServiceResponse();
		try {
			approveOrDeclineMentorRequestResponse = projectDao.approveOrDeclineMentorRequest(approveOrDeclineMentorRequestVO);
			
			//to be commented
			if(approveOrDeclineMentorRequestResponse.getStatus() == "Y"){
				log.info("getMentorEmailId :: "+approveOrDeclineMentorRequestResponse.getMentorEmailId());
				log.info("getMentorFname :: "+approveOrDeclineMentorRequestResponse.getMentorFname());
				log.info("getMentorLname :: "+approveOrDeclineMentorRequestResponse.getMentorLname());
				log.info("getProjTitle :: "+approveOrDeclineMentorRequestResponse.getProjTitle());
				log.info("getTeamLeaderEmailId :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderEmailId());
				log.info("getTeamLeaderFname :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderFname());
				log.info("getTeamLeaderLname :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderLname());
				log.info("getTeamLeaderMname :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderMname());
				log.info("getStatus :: "+approveOrDeclineMentorRequestResponse.getStatus());
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.APPROVE_MENTOR_REQUEST_SUCCESS);
				return gson.toJson(response);
			}
			
			//to be uncommented
			/*if(approveOrDeclineMentorRequestResponse.getStatus() == "Y" && ProjectManagementEMailHelper.sendApproveOrDeclineMentorRequestEmail(approveOrDeclineMentorRequestResponse)){		
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.REQUEST_TO_BE_MENTOR_SUCCESS);
				return gson.toJson(response);
			}*/
			
			//to be commented
			else if(approveOrDeclineMentorRequestResponse.getStatus() == "N"){
				log.info("getMentorEmailId :: "+approveOrDeclineMentorRequestResponse.getMentorEmailId());
				log.info("getMentorFname :: "+approveOrDeclineMentorRequestResponse.getMentorFname());
				log.info("getMentorLname :: "+approveOrDeclineMentorRequestResponse.getMentorLname());
				log.info("getProjTitle :: "+approveOrDeclineMentorRequestResponse.getProjTitle());
				log.info("getTeamLeaderEmailId :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderEmailId());
				log.info("getTeamLeaderFname :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderFname());
				log.info("getTeamLeaderLname :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderLname());
				log.info("getTeamLeaderMname :: "+approveOrDeclineMentorRequestResponse.getTeamLeaderMname());
				log.info("getStatus :: "+approveOrDeclineMentorRequestResponse.getStatus());
				log.info("getStatus :: "+approveOrDeclineMentorRequestResponse.getDeclineComments());
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.DECLINE_MENTOR_REQUEST_SUCCESS);
				return gson.toJson(response);
				
			}
			
			
			//to be uncommented
			/*else if(approveOrDeclineMentorRequestResponse.getStatus() == "N" && ProjectManagementEMailHelper.sendApproveOrDeclineMentorRequestEmail(approveOrDeclineMentorRequestResponse)){
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.SUCCESS);
				response.setDescription(ProjectManagementServiceConstant.DECLINE_MENTOR_REQUEST_SUCCESS);
				return gson.toJson(response);
				
			}*/
			else{
				Gson gson = new Gson();
				response.setStatus(ProjectManagementServiceConstant.FAILURE);
				response.setDescription(ProjectManagementServiceConstant.APPROVE_OR_DECLINE_MENTOR_REQUEST_FAILURE);
				return gson.toJson(response);
			}
		} catch (ApproveOrDeclineMentorRequestException e) {			
			throw e;
		}
	}
	
	/**
	 * @return ProjectDao
	 *//*
	private  ProjectDao getProjectDao() {
		
		if (projectDao == null) {
			projectDao = new ProjectDaoImpl();
		}
		return projectDao;
	}*/

	

}
