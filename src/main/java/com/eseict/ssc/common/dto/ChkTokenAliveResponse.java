package com.eseict.ssc.common.dto;

public class ChkTokenAliveResponse {

	// 호출 결과 코드
	public String result;
	// 호출 결과 메시지
	public String message;
	// 시스템 정보
	public SysInfo data;

	public String getResult() { return result; }
	public void setResult(String result) { this.result = result; }

	public String getMessage() { return message; }
	public void setMessage(String message) { this.message = message; }

	public SysInfo getData() { return data; }
	public void setData(SysInfo data) { this.data = data; }

	public class SysInfo {
		public String sysName;
		public String url;

		public String getSysName() { return sysName; }
		public void setSysName(String sysName) { this.sysName = sysName; }

		public String getUrl() { return url; }
		public void setUrl(String url) { this.url = url; }
	}
}
