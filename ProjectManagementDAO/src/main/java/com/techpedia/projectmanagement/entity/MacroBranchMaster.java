/**
 * 
 */
package com.techpedia.projectmanagement.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author charan.teja
 *
 */
@Entity
@Table(name="tb_tech001_mast_macro_branch")
public class MacroBranchMaster{

	@Id
	@GeneratedValue
	@Column(name="MACRO_BRANCH_ID")
	private int macroBranchId;
	
	@Column(name="MACRO_BRANCH_NAME")
	private String macroBranchName;

	/**
	 * 
	 */
	public MacroBranchMaster() {}

	/**
	 * @return the macroBranchId
	 */
	public int getMacroBranchId() {
		return macroBranchId;
	}

	/**
	 * @param macroBranchId the macroBranchId to set
	 */
	public void setMacroBranchId(int macroBranchId) {
		this.macroBranchId = macroBranchId;
	}

	/**
	 * @return the macroBranchName
	 */
	public String getMacroBranchName() {
		return macroBranchName;
	}

	/**
	 * @param macroBranchName the macroBranchName to set
	 */
	public void setMacroBranchName(String macroBranchName) {
		this.macroBranchName = macroBranchName;
	}
	
	
}
