package com.techpedia.usermanagement.dataobject;
public class RecentNewsDO {

	private String newsDate;
	private String colgId;
	private String newsHeadline;
	private String newsDescription;
	
	public RecentNewsDO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public RecentNewsDO(String newsDate, String colgId, String newsHeadline, String newsDescription) {
		super();
		this.newsDate = newsDate;
		this.setColgId(colgId);
		this.newsHeadline = newsHeadline;
		this.newsDescription = newsDescription;
	}
	/**
	 * @return the newsDate
	 */
	public String getNewsDate() {
		return newsDate;
	}
	/**
	 * @param newsDate the newsDate to set
	 */
	public void setNewsDate(String newsDate) {
		this.newsDate = newsDate;
	}
	/**
	 * @return the newsHeadline
	 */
	public String getNewsHeadline() {
		return newsHeadline;
	}
	/**
	 * @param newsHeadline the newsHeadline to set
	 */
	public void setNewsHeadline(String newsHeadline) {
		this.newsHeadline = newsHeadline;
	}
	/**
	 * @return the newsDescription
	 */
	public String getNewsDescription() {
		return newsDescription;
	}
	/**
	 * @param newsDescription the newsDescription to set
	 */
	public void setNewsDescription(String newsDescription) {
		this.newsDescription = newsDescription;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "RecentNewsDO [newsDate=" + newsDate + ", colgId="
				+ colgId + ", newsHeadline=" + newsHeadline
				+ ", newsDescription=" + newsDescription + "]";
	}
	/**
	 * @return the colgId
	 */
	public String getColgId() {
		return colgId;
	}
	/**
	 * @param colgId the colgId to set
	 */
	public void setColgId(String colgId) {
		this.colgId = colgId;
	}
	
	

}