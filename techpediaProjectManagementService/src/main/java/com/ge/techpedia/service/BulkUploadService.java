package com.ge.techpedia.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ge.techpedia.service.helper.BulkUploadServiceHelper;
import com.techpedia.logger.TechPediaLogger;
import com.techpedia.projectmanagement.exception.BulkUploadException;


@Path("bulkUploadservice")
@Service
public class BulkUploadService {

	@Autowired 
	BulkUploadServiceHelper bulkUploadServiceHelper;
	
	private static final Logger logger = Logger.getLogger(BulkUploadService.class.getName());
	
	@POST
	@Path("uploadFile")
	@Consumes("application/json")
	@Produces({"application/json"})
	public Response bulkUploadProject(String fileName) throws BulkUploadException{
		logger.info("Bulk Upload Service : start");
		logger.info("File to be uploaded :: "+fileName);
		return Response.ok().status(200).entity(bulkUploadServiceHelper.bulkUploadProject(fileName)).type("application/json").build();
	}
}
