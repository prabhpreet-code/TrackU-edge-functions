// const express = require("./node_modules/express");
// import { Express } from "express";
// const cors = require("./node_modules/cors");
const { v4: uuidv4 } = require("../node_modules/uuid");
const { default: axios } = require("../node_modules/axios");

export const main = async (params, req) => {
  const BASE_URL = "";
  const API_KEY = "";
  const { path, body, query, headers } = params;

  const registerUser = async () => {
    try {
        let data = JSON.stringify({
          dataSource: "TEST-1",
          database: "test",
          collection: "users",
          document: {
            walletAddress: body.walletAddress,
            apiKey: uuidv4(),
            email: body.email,
            phone: body.phone,
            country: body.country,
            projects: [],
          },
        });
  
        let config = {
          method: "post",
          url: `${BASE_URL}/action/insertOne`,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            apiKey: API_KEY,
          },
          data,
        };
  
        let createdUser = await axios(config);

        let dataFetch = JSON.stringify({
          dataSource: "TEST-1",
          database: "test",
          collection: "users",
          filter: { _id: { $oid: createdUser.data.insertedId } },
        });
  
        let configFetch = {
          method: "post",
          url: `${BASE_URL}/action/findOne`,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            apiKey: API_KEY,
          },
          data: dataFetch,
        };
  
        let foundUser = await axios(configFetch);
  
        if (foundUser.data.document) {
          return (foundUser.data.document);
        } else {
          return (false);
        }

      } catch (error) {
        return ({ message: error.message });
      }
  }

const checkUser = async() => {
    const walletAddress = query.walletAddress

    try {
      let data = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "users",
        filter: { walletAddress: walletAddress },
      });

      let config = {
        method: "post",
        url: `${BASE_URL}/action/findOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data,
      };

      let foundUser = await axios(config);

      if (foundUser.data.document) {
        return (foundUser.data.document);
      } else {
        return (false);
      }
    } catch (error) {
      return ({ message: error.message, status: 500 });
    }
  }

  const submitEvent = async () => {
    // extract token api key
    const authHeader = headers["authorization"];
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7, authHeader.length);
    //   req.token = token;
    } else {
    //   req.token = null;
    }

    // const token = req.token;
    // check and verify api key from db

    const userId = body.userId;
    const event = body.event;
    const data = body.data;
    const date = body.date;

    // save all the events in db
    try {
      let dataEvents = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "events",
        document: {
          apiKey: token,
          userId,
          event,
          data,
          date,
        },
      });

      let configEvents = {
        method: "post",
        url: `${BASE_URL}/action/insertOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataEvents,
      };

      const eventsResponse = await axios(configEvents);

    //   return (eventsResponse.data.document);
    return eventsResponse.data;
    } catch (error) {
      return ({ message: error.message, status: 400 });
    // return token;
    }
  }

  const addProject = async () => {
    try {
        let data = JSON.stringify({
          dataSource: "TEST-1",
          database: "test",
          collection: "users",
          filter: { walletAddress: body.walletAddress },
        });
  
        let config = {
          method: "post",
          url: `${BASE_URL}/action/findOne`,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            apiKey: API_KEY,
          },
          data,
        };
  
        let user = await axios(config);
        if (!user) {
          return res.status(404).json({ message: "Owner not registered" });
        }
        console.log("Inside Add Project - User Found: ", user.data.document);
  
        let dataProject = JSON.stringify({
          dataSource: "TEST-1",
          database: "test",
          collection: "projects",
          document: {
            owner: user.data.document._id,
            walletAddress: body.walletAddress,
            projectName: body.projectName,
            estimatedUsers: body.estimatedUsers,
            trigger: [],
          },
        });
  
        let configProject = {
          method: "post",
          url: `${BASE_URL}/action/insertOne`,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            apiKey: API_KEY,
          },
          data: dataProject,
        };
  
        let projectCreated = await axios(configProject);
  
        console.log("DATAA", projectCreated);
  
        //////////////
        let dataProjectFetched = JSON.stringify({
          dataSource: "TEST-1",
          database: "test",
          collection: "projects",
          filter: { _id: { $oid: projectCreated.data.insertedId } },
        });
  
        let configProjectFetched = {
          method: "post",
          url: `${BASE_URL}/action/findOne`,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            apiKey: API_KEY,
          },
          data: dataProjectFetched,
        };
        let projectFetched = await axios(configProjectFetched);
        ///////////////
        console.log(
          "Inside Add Project - Project to Save: ",
          projectFetched.data.document
        );
  
        let dataUserUpdated = JSON.stringify({
          dataSource: "TEST-1",
          database: "test",
          collection: "users",
          filter: { walletAddress: body.walletAddress },
          update: { $push: { projects: projectFetched.data.document._id } },
        });
  
        let configUserUpdated = {
          method: "post",
          url: `${BASE_URL}/action/updateOne`,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            apiKey: API_KEY,
          },
          data: dataUserUpdated,
        };
  
        let userUpdated = await axios(configUserUpdated);
  
        return (userUpdated.data);
      } catch (error) {
        console.error("Error inside Add Project:", error);
        return ({ message: error.message , code: 400});
      }
  }

  const deleteProject = async () => {

    try {
      let dataUser = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "users",
        filter: { walletAddress: body.walletAddress },
      });

      let configUser = {
        method: "post",
        url: `${BASE_URL}/action/findOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataUser,
      };

      let dataProject = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "projects",
        filter: { _id: { $oid: body.projectId } },
      });

      let configProject = {
        method: "post",
        url: `${BASE_URL}/action/findOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataProject,
      };
      let user = await axios(configUser);
      if (!user) {
        return ({ message: "User not found", code: 404 });
      }

      let project = await axios(configProject);

      if (!project) {
        return ({ message: "Project not found", code: 404 });
      }

      if (
        project.data.document.owner.toString() !==
        user.data.document._id.toString()
      ) {
        return ({ message: "User is not the owner of the project", code: 403 });
      }

      let dataProjectDeleted = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "projects",
        filter: { _id: { $oid: body.projectId } },
      });

      let configProjectDeleted = {
        method: "post",
        url: `${BASE_URL}/action/deleteOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataProjectDeleted,
      };

      let deletedProject = await axios(configProjectDeleted);

      const filteredProjects = user.data.document.projects.filter(
        (id) => id.toString() !== body.projectId
      );

      let dataUserUpdate = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "users",
        filter: { walletAddress: body.walletAddress },
        update: {
          $set: {
            projects: filteredProjects,
          },
        },
      });

      let configUserUpdate = {
        method: "post",
        url: `${BASE_URL}/action/updateOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataUserUpdate,
      };

      let updatedUser = await axios(configUserUpdate);

      return ({ message: "Project deleted successfully" });
    } catch (error) {
      return ({ message: error.message, error: 400 });
    }
  }

  const getProjectsByUser = async () => {
    const walletAddress = query.walletAddress;

    console.log("Inside Get Projects By User: ", walletAddress);

    try {
      let dataUser = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "users",
        filter: { walletAddress: walletAddress },
      });

      let configUser = {
        method: "post",
        url: `${BASE_URL}/action/findOne`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataUser,
      };

      let userResponse = await axios(configUser);

      // console.log(userResponse.data)

      const user = userResponse.data.document;

      if (!user) {
        console.log("User not found");
        return;
      }

      const projectIds = user.projects.map((projectId) => ({
        _id: { $oid: projectId },
      }));

      if(projectIds.length === 0) {
        return ([]);
      }

      let dataProjects = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "projects",
        filter: { $or: projectIds, walletAddress: walletAddress },
      });

      let configProjects = {
        method: "post",
        url: `${BASE_URL}/action/find`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data: dataProjects,
      };

      const projectsResponse = await axios(configProjects);

      const projects = projectsResponse.data.documents;

      // console.log(projects)

    //   user.projects = projects;

      return (projects);
    } catch (error) {
      return({ message: error.message , code: 400});
    }
  }

  const fetchData = async (filter) => {
    try {
      let data = JSON.stringify({
        dataSource: "TEST-1",
        database: "test",
        collection: "events",
        filter: filter,
      });

      let config = {
        method: "post",
        url: `${BASE_URL}/action/find`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: API_KEY,
        },
        data,
      };

      let response = await axios(config);
      // console.log(response.data);

      return response.data.documents;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const getProjectDetails = async() => {
    // const { projectId, apiKey } = req.query;
    const projectId = query.projectId;
    const apiKey = query.apiKey;

    try {
    const [
        pageViewData,
        sessionData,
        heatMapData,
        errorTrackData,
        performanceData,
    ] = await Promise.all([
        fetchData({ event: "page_view", projectId: projectId, apiKey: apiKey }),
        fetchData({ event: "session_end", projectId: projectId, apiKey: apiKey }),
        fetchData({ event: "heat_map", projectId: projectId, apiKey: apiKey }),
        fetchData({ event: "error_track", projectId: projectId, apiKey: apiKey }),
        fetchData({ event: "performance_track", projectId: projectId, apiKey: apiKey }),
    ]);

    const totalPageViews = pageViewData.length;
    const uniquePageViews = new Set(pageViewData.map((view) => view.userId)).size;

    const urlPageViewCounts = {};
    const urlUserCounts = {};
    const browserCounts = {};
    const osCounts = {};

    pageViewData.forEach((view) => {
        const url = view.data.url;
        const userId = view.userId;
        const browser = view.data.browser;
        const os = view.data.os;

        if (urlPageViewCounts[url]) {
        urlPageViewCounts[url].views++;
        urlUserCounts[url].add(userId);
        } else {
        urlPageViewCounts[url] = { views: 1, uniqueViews: 0 };
        urlUserCounts[url] = new Set([userId]);
        }

        if (browser) {
        if (browserCounts[browser]) {
            browserCounts[browser]++;
        } else {
            browserCounts[browser] = 1;
        }
        }

        if (os) {
        if (osCounts[os]) {
            osCounts[os]++;
        } else {
            osCounts[os] = 1;
        }
        }
    });

    for (const url in urlUserCounts) {
        urlPageViewCounts[url].uniqueViews = urlUserCounts[url].size;
    }

    const urlPageViewArray = Object.entries(urlPageViewCounts).map(
        ([link, data]) => ({
        link,
        views: data.views,
        uniqueViews: data.uniqueViews,
        })
    );

    const pageViewsPerDayCounts = {};
    pageViewData.forEach((view) => {
        const date = new Date(view.date).toISOString().split("T")[0];
        if (pageViewsPerDayCounts[date]) {
        pageViewsPerDayCounts[date]++;
        } else {
        pageViewsPerDayCounts[date] = 1;
        }
    });

    const pageViewsPerDay = Object.entries(pageViewsPerDayCounts)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const averagePageViewsPerUser = totalPageViews / uniquePageViews;

    const mostViewedPages = urlPageViewArray.sort((a, b) => b.views - a.views);

    const userPageViewCounts = {};
    pageViewData.forEach((view) => {
        const userId = view.userId;
        if (userPageViewCounts[userId]) {
        userPageViewCounts[userId]++;
        } else {
        userPageViewCounts[userId] = 1;
        }
    });

    const uniqueUsers = Object.entries(userPageViewCounts).map(
        ([userId, count]) => ({ userId, count })
    );

    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let totalPageStayDuration = 0;
    let last24HoursPageStayDuration = 0;
    let last7DaysPageStayDuration = 0;

    sessionData.forEach((session) => {
        const duration = session.data.duration || 0;
        totalPageStayDuration += duration;

        const sessionDate = new Date(session.date);
        if (sessionDate >= oneDayAgo) {
        last24HoursPageStayDuration += duration;
        }
        if (sessionDate >= sevenDaysAgo) {
        last7DaysPageStayDuration += duration;
        }
    });

    const averageStayDurationPerUser =
        totalPageStayDuration / uniquePageViews;

    const userSessionDurations = {};
    sessionData.forEach((session) => {
        const userId = session.userId;
        const duration = session.data.duration || 0;
        if (userSessionDurations[userId]) {
        userSessionDurations[userId] += duration;
        } else {
        userSessionDurations[userId] = duration;
        }
    });

    uniqueUsers.forEach((user) => {
        const userId = user.userId;
        user.stayDuration = userSessionDurations[userId] || 0;

        const userPageViewsLast24Hours = pageViewData.filter(
        (view) => view.userId === userId && new Date(view.date) >= oneDayAgo
        ).length;

        const userPageViewsLast7Days = pageViewData.filter(
        (view) =>
            view.userId === userId && new Date(view.date) >= sevenDaysAgo
        ).length;

        user.pageViewsLast24Hours = userPageViewsLast24Hours;
        user.pageViewsLast7Days = userPageViewsLast7Days;
    });

    const sessionDataPerDayCounts = {};
    sessionData.forEach((session) => {
        const date = new Date(session.date).toISOString().split("T")[0];
        if (sessionDataPerDayCounts[date]) {
        sessionDataPerDayCounts[date] += session.data.duration || 0;
        } else {
        sessionDataPerDayCounts[date] = session.data.duration || 0;
        }
    });

    const sessionDataPerDay = Object.entries(sessionDataPerDayCounts)
        .map(([date, duration]) => ({ date, duration }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    let totalClicks = [];
    let totalScrolls = [];
    heatMapData.forEach((heatMap) => {
        totalClicks = totalClicks.concat(heatMap.data.clicks || []);
        totalScrolls = totalScrolls.concat(heatMap.data.scrolls || []);
    });

    const totalInteractions = { clicks: totalClicks, scrolls: totalScrolls };

    const userInteractions = {};
    heatMapData.forEach((heatMap) => {
        const userId = heatMap.userId;
        const clicks = heatMap.data.clicks || [];
        const scrolls = heatMap.data.scrolls || [];

        if (!userInteractions[userId]) {
        userInteractions[userId] = { clicks: [], scrolls: [] };
        }

        userInteractions[userId].clicks =
        userInteractions[userId].clicks.concat(clicks);
        userInteractions[userId].scrolls =
        userInteractions[userId].scrolls.concat(scrolls);
    });

    uniqueUsers.forEach((user) => {
        const userId = user.userId;
        user.clicks = userInteractions[userId]?.clicks || [];
        user.scrolls = userInteractions[userId]?.scrolls || [];
    });

    const userErrorCounts = {};
    errorTrackData.forEach((error) => {
        const userId = error.userId;
        if (userErrorCounts[userId]) {
        userErrorCounts[userId]++;
        } else {
        userErrorCounts[userId] = 1;
        }
    });

    uniqueUsers.forEach((user) => {
        const userId = user.userId;
        user.errors = userErrorCounts[userId] || 0;
    });

    const errorsFacedByUser = errorTrackData.length;

    // Performance data analysis
    let totalLoadTime = 0;
    let loadTimes = [];
    const screenWidthCounts = {};

    performanceData.forEach((perf) => {
        const loadTime = perf.data.performance.firstContentfulPaint || 0;
        const screenWidth = perf.data.performance.width || 0;

        loadTimes.push(loadTime);
        totalLoadTime += loadTime;

        if (screenWidthCounts[screenWidth]) {
        screenWidthCounts[screenWidth]++;
        } else {
        screenWidthCounts[screenWidth] = 1;
        }
    });

    const fastestLoadTime = Math.min(...loadTimes);
    const slowestLoadTime = Math.max(...loadTimes);
    const averageLoadTime = totalLoadTime / loadTimes.length;

    const screenWidthArray = Object.entries(screenWidthCounts).map(
        ([width, count]) => ({
        width: parseInt(width),
        count,
        })
    );

    const userLoadTimes = {};
    const userScreenWidths = {};

    performanceData.forEach((perf) => {
        const userId = perf.userId;
        const loadTime = perf.data.performance.firstContentfulPaint || 0;
        const screenWidth = perf.data.performance.width || 0;

        if (!userLoadTimes[userId]) {
        userLoadTimes[userId] = [];
        }
        if (!userScreenWidths[userId]) {
        userScreenWidths[userId] = [];
        }

        userLoadTimes[userId].push(loadTime);
        userScreenWidths[userId].push(screenWidth);
    });

    uniqueUsers.forEach((user) => {
        const userId = user.userId;
        const userTimes = userLoadTimes[userId] || [];
        const userWidths = userScreenWidths[userId] || [];

        const userFastestLoadTime = Math.min(...userTimes);
        const userSlowestLoadTime = Math.max(...userTimes);
        const userAverageLoadTime =
        userTimes.reduce((sum, time) => sum + time, 0) / userTimes.length;
        const userAverageScreenWidth =
        userWidths.reduce((sum, width) => sum + width, 0) / userWidths.length;

        user.fastestLoadTime = userFastestLoadTime;
        user.slowestLoadTime = userSlowestLoadTime;
        user.averageLoadTime = userAverageLoadTime;
        user.averageScreenWidth = userAverageScreenWidth;
        user.screenWidths = userWidths;
    });

    const uniqueBrowsers = Object.entries(browserCounts).map(
        ([type, count]) => ({ type, count })
    );

    const uniqueOs = Object.entries(osCounts).map(
        ([type, count]) => ({ type, count })
    );

    return {
        totalPageViews,
        uniquePageViews,
        urlPageViewCounts: urlPageViewArray,
        pageViewsPerDay,
        averagePageViewsPerUser,
        mostViewedPages,
        uniqueUsers,
        totalPageStayDuration,
        last24HoursPageStayDuration,
        last7DaysPageStayDuration,
        averageStayDurationPerUser,
        sessionDataPerDay,
        totalInteractions,
        pageViewData,
        sessionData,
        heatMapData,
        errorTrackData,
        errorsFacedByUser,
        performanceData,
        fastestLoadTime,
        slowestLoadTime,
        averageLoadTime,
        screenWidthArray,
        uniqueBrowsers,
        uniqueOs,
    };
    } catch (e) {
    return { message: e.message, code: 500 };
    }
  }


  if(path === "/checkUser") {
    const data = checkUser()
    return data;
  }

  if(path === "/registerUser") {
    const data = registerUser()
    return data;
  }

  if(path === "/submitEvent") {
    const data = submitEvent()
    return data;
  }

  if(path === "/addProject") {
    const data = addProject()
    return data;
  }

  if(path === "/deleteProject") {
    const data = deleteProject()
    return data;
  }

  if(path === "/getProjectsByUser") {
    const data = getProjectsByUser()
    return data;
  }

  if(path === "/getProjectDetails") {
    const data = getProjectDetails()
    return data;
  }
};
