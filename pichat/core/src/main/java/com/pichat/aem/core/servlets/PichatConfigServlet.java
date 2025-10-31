package com.pichat.aem.core.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
  service = Servlet.class,
  property = {
    ServletResolverConstants.SLING_SERVLET_PATHS + "=/bin/pichat/config",
    ServletResolverConstants.SLING_SERVLET_METHODS + "=POST",
    ServletResolverConstants.SLING_SERVLET_METHODS + "=GET",
  }
)
public class PichatConfigServlet extends SlingAllMethodsServlet {

  private static final long serialVersionUID = 1L;
  private static final Logger LOG = LoggerFactory.getLogger(
    PichatConfigServlet.class
  );
  private static final String CONFIG_NODE_PATH = "/var/pichat/config";
  private static final String SERVICE_USER = "pichat-service";

  @Reference
  private ResourceResolverFactory resourceResolverFactory;

  @Override
  protected void doPost(
    SlingHttpServletRequest request,
    SlingHttpServletResponse response
  ) throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    JSONObject jsonResponse = new JSONObject();

    try {
      // ResourceResolver resolver = getServiceResourceResolver();
      // temp: use request resource resolver
      ResourceResolver resolver = request.getResourceResolver();
      String theme = request.getParameter("theme");
      Resource configResource = ResourceUtil.getOrCreateResource(resolver, CONFIG_NODE_PATH, "nt:unstructured", "nt:unstructured", false);
      if (configResource == null) {
        jsonResponse.put("success", false);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("error", "Config resource not found");
        response.getWriter().write(jsonResponse.toString());
        return;
      }
      String remove = request.getParameter("remove");
      if (theme != null) {
        Resource themeResource = configResource.getChild(theme);
        if (remove != null && remove.equals("true")) {
          resolver.delete(themeResource);
          resolver.commit();
          jsonResponse.put("success", true);
          jsonResponse.put("testUpdate", true);
          jsonResponse.put("removed", true);
          response.getWriter().write(jsonResponse.toString());
          return;
        }
        if (themeResource == null) {
          themeResource = ResourceUtil.getOrCreateResource(resolver, CONFIG_NODE_PATH + "/" + theme, "nt:unstructured", "nt:unstructured", false);
        }
        ModifiableValueMap modifiableValueMap = themeResource.adaptTo(ModifiableValueMap.class);
        JSONObject requestJson = getRequestJson(request);
        Iterator<String> keys = requestJson.keys();
        while (keys.hasNext()) {
          String key = keys.next();
          if (requestJson.get(key) instanceof JSONArray) {
            String[] values = new String[((JSONArray) requestJson.get(key)).length()];
            for (int i = 0; i < ((JSONArray) requestJson.get(key)).length(); i++) {
              values[i] = ((JSONArray) requestJson.get(key)).getString(i);
            }
            modifiableValueMap.put(key, values);
          } else if (requestJson.get(key) instanceof Integer) {
            modifiableValueMap.put(key, requestJson.getInt(key));
          } else if (requestJson.get(key) instanceof Long) {
            modifiableValueMap.put(key, requestJson.getLong(key));
          } else if (requestJson.get(key) instanceof Boolean) {
            modifiableValueMap.put(key, requestJson.getBoolean(key));
          } else if (requestJson.get(key) instanceof Double) {
            modifiableValueMap.put(key, requestJson.getDouble(key));
          } else if (requestJson.get(key) instanceof String) {
            modifiableValueMap.put(key, requestJson.getString(key));
          } else {
            modifiableValueMap.put(key, requestJson.get(key));
          }
        }
        resolver.commit();
        jsonResponse.put("success", true);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("updatedConfig", valueMapToJson(modifiableValueMap));
      }else {
        jsonResponse.put("success", false);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("error", "Config resource not found");
      }
      response.getWriter().write(jsonResponse.toString());
    } catch (Exception e) {
      LOG.error("Error processing request", e);
      sendError(response, "Error processing request: " + e.getMessage(), 500);
    }
  }

  @Override
  protected void doGet(
    SlingHttpServletRequest request,
    SlingHttpServletResponse response
  ) throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    JSONObject jsonResponse = new JSONObject();

    try {
      // ResourceResolver resolver = getServiceResourceResolver();
      // temp: use request resource resolver
      ResourceResolver resolver = request.getResourceResolver();
      String theme = request.getParameter("theme");
      String path = request.getParameter("path");
      Resource configResource = resolver.getResource(CONFIG_NODE_PATH);
      if (configResource == null) {
        jsonResponse.put("success", false);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("error", "Config resource not found");
        response.getWriter().write(jsonResponse.toString());
        return;
      }
      if (path != null) {
        for (Resource themeResource : configResource.getChildren()) {
          String[] themePaths = themeResource.getValueMap().get("themePaths", String[].class);
          if (themePaths != null) {
            for (String themePath : themePaths) {
              if (path.startsWith(themePath)) {
                jsonResponse.put("success", true);
                jsonResponse.put("testUpdate", true);
                jsonResponse.put("theme", valueMapToJson(themeResource.getValueMap()));
                response.getWriter().write(jsonResponse.toString());
                return;
              }
            }
          }
        }
        jsonResponse.put("success", false);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("error", "Path not found");
        response.getWriter().write(jsonResponse.toString());
        return;
      } else if (theme != null && theme.equals("all")) {
        JSONArray themes = new JSONArray();
        if (configResource != null) {
          int index = 0;
          for (Resource themeResource : configResource.getChildren()) {
            if (!themeResource.getResourceType().equals("nt:unstructured")) {
              continue;
            }
            JSONObject themeObject = new JSONObject();
            themeObject.put("name", themeResource.getValueMap().get("themeName"));
            themeObject.put("id", themeResource.getName());
            themeObject.put("active", index == 0);
            index++;
            themes.put(themeObject);
          }
        }
        jsonResponse.put("success", true);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("themes", themes);
        response.getWriter().write(jsonResponse.toString());
        return;
      } else if (theme != null) {
        Resource themeResource = configResource.getChild(theme);
        if (themeResource != null) {
          jsonResponse.put("success", true);
          jsonResponse.put("testUpdate", true);
          jsonResponse.put("theme", valueMapToJson(themeResource.getValueMap()));
          response.getWriter().write(jsonResponse.toString());
          return;
        }
      } else {
        jsonResponse.put("success", false);
        jsonResponse.put("testUpdate", true);
        jsonResponse.put("error", "Path not found");
        response.getWriter().write(jsonResponse.toString());
        return;
      }
      response.getWriter().write(jsonResponse.toString());
    } catch (Exception e) {
      LOG.error("Error processing request", e);
      sendError(response, "Error processing request: " + e.getMessage(), 500);
    }
  }

  private JSONObject getRequestJson(SlingHttpServletRequest request) throws IOException {
    JSONObject json = new JSONObject();
    BufferedReader reader = request.getReader();
    StringBuilder sb = new StringBuilder();
    String line;
    while ((line = reader.readLine()) != null) {
      sb.append(line);
    }
    try {
      json = new JSONObject(sb.toString());
    } catch (JSONException e) {
      LOG.error("Error converting request to JSON", e);
    }
    return json;
  }

  private JSONObject valueMapToJson(ValueMap valueMap) {
    JSONObject json = new JSONObject();
    if (valueMap != null) {
      try {
        for (String key : valueMap.keySet()) {
          if (valueMap.get(key) instanceof String[]) {
            JSONArray array = new JSONArray();
            for (String value : (String[]) valueMap.get(key)) {
              array.put(value);
            }
            json.put(key, array);
          } else {
            json.put(key, valueMap.get(key));
          }
        }
      } catch (JSONException e) {
        LOG.error("Error converting value map to JSON", e);
      }
    } else {
      LOG.error("Value map is null");
    }
    return json;
  }

  private ResourceResolver getServiceResourceResolver() throws LoginException {
    Map<String, Object> params = new HashMap<>();
    params.put(ResourceResolverFactory.SUBSERVICE, SERVICE_USER);
    return resourceResolverFactory.getServiceResourceResolver(params);
  }

  private void sendError(
    SlingHttpServletResponse response,
    String message,
    int statusCode
  ) throws IOException {
    response.setStatus(statusCode);
    try {
      JSONObject error = new JSONObject();
      error.put("success", false);
      error.put("error", message);
      response.getWriter().write(error.toString());
    } catch (Exception e) {
      response
        .getWriter()
        .write("{\"success\":false,\"error\":\"" + message + "\"}");
    }
  }
}
