package com.ge.techpedia.service.helper;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.ge.techpedia.constant.ProjectManagementServiceConstant;
import com.ge.techpedia.service.response.ProjectServiceResponse;
import com.google.gson.Gson;
import com.techpedia.logger.TechPediaLogger;
import com.techpedia.projectmanagement.dao.ProjectDao;
import com.techpedia.projectmanagement.exception.BulkUploadException;

@Service
public class BulkUploadServiceHelper {
	
	@Autowired
	@Qualifier("projectDao")
	ProjectDao projectDao;
	
	private static final Logger logger = Logger.getLogger(BulkUploadServiceHelper.class.getName());
	
	/*@Autowired
	@Qualifier("springTestDao")
	SpringTestDao springTestDao;*/
	
	public String bulkUploadProject(String fileName) throws BulkUploadException{
		
		String result = null;
		ProjectServiceResponse response = new ProjectServiceResponse();
		try {
			logger.info("Calling the bulkUploadProject method in projectDao : start");
			result = projectDao.bulkUploadProjectAsXLS(fileName);
			logger.info("Calling the bulkUploadProject method in projectDao : end");
			logger.info("Result :: "+result);
			//springTestDao.springTest();
			
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
		} catch (Exception e) {			
			throw new BulkUploadException(e.getMessage());
		}		
	}
}
