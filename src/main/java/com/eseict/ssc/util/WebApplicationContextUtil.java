package com.eseict.ssc.util;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.FrameworkServlet;

import javax.servlet.ServletContext;

public class WebApplicationContextUtil extends WebApplicationContextUtils {
    private static WebApplicationContext wac;
    private static WebApplicationContext requiredWac;
    private static ServletContext servletContext;

    public WebApplicationContextUtil() {
    }

    public static void setServletContext(ServletContext servletContext) {
        WebApplicationContextUtil.servletContext = servletContext;
    }
    public static WebApplicationContext getRequiredWebApplicationContext() {
        requiredWac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
        return requiredWac;
    }

    public static Object getBeanFromRoot(String beanName) {
        return getRequiredWebApplicationContext().getBean(beanName);
    }
}
