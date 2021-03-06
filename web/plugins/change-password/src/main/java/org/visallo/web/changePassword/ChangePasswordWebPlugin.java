package org.visallo.web.changePassword;

import org.visallo.webster.Handler;
import org.visallo.webster.handlers.StaticResourceHandler;
import org.visallo.core.model.Description;
import org.visallo.core.model.Name;
import org.visallo.web.VisalloCsrfHandler;
import org.visallo.web.WebApp;
import org.visallo.web.WebAppPlugin;
import org.visallo.web.privilegeFilters.ReadPrivilegeFilter;

import javax.servlet.ServletContext;

@Name("Change Password")
@Description("Allows a user to change their password")
public class ChangePasswordWebPlugin implements WebAppPlugin {
    @Override
    public void init(WebApp app, ServletContext servletContext, Handler authenticationHandler) {
        Class<? extends Handler> authenticationHandlerClass = authenticationHandler.getClass();
        Class<? extends Handler> csrfHandlerClass = VisalloCsrfHandler.class;

        app.registerJavaScript("/org/visallo/web/changePassword/changePassword.js");
        app.registerCss("/org/visallo/web/changePassword/changePassword.css");
        app.registerResourceBundle("/org/visallo/web/changePassword/messages.properties");

        app.registerJavaScriptTemplate("/org/visallo/web/changePassword/template.hbs");

        app.post("/changePassword", authenticationHandlerClass, csrfHandlerClass, ReadPrivilegeFilter.class, ChangePassword.class);
    }
}
