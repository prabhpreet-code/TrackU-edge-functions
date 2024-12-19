# Fleek Functions API

### FLEEK FUNCTION: https://purring-agency-slow.functions.on-fleek.app/

This repository contains an edge function for Fleek that handles multiple API endpoints for user and project management. The following documentation provides an overview of each endpoint, its purpose, and what it returns.

## Overview

Fleek Functions are code snippets executed server-side, allowing for serverless computing. By utilizing Fleek Functions, we can deploy scalable and efficient serverless applications. One of the unique aspects of our implementation is that we have created a single Fleek function to handle multiple endpoints, showcasing the flexibility and power of Fleek.

## Endpoints

### `/checkUser`

**Description**: Checks if a user exists based on their wallet address.

**Returns**: 
- The user's document if found.
- A 404 status message if the user is not found.
- A 500 status message in case of an error.

### `/registerUser`

**Description**: Registers a new user by inserting their information into the database.

**Returns**: 
- The created user's data.
- An error message if the registration fails.

### `/submitEvent`

**Description**: Submits an event for a user, verifying the API key from the authorization header and saving the event data in the database.

**Returns**: 
- The event data that was submitted.
- A 400 status message if the event submission fails.

### `/addProject`

**Description**: Adds a new project for a user by first verifying the user exists and then inserting the project into the database. It also updates the user's project list.

**Returns**: 
- The updated user's data.
- A 400 status message if the project addition fails.

### `/deleteProject`

**Description**: Deletes a project based on the provided project ID and verifies that the user is the owner of the project. It also updates the user's project list.

**Returns**: 
- A success message upon successful deletion.
- Various error messages if the user or project is not found, or if the user is not the owner.

### `/getProjectsByUser`

**Description**: Retrieves all projects associated with a user's wallet address.

**Returns**: 
- A list of projects for the user.
- An empty array if no projects are found.
- A 400 status message in case of an error.

### `/getProjectDetails`

**Description**: Retrieves detailed analytics data for a specific project, including page views, session data, heat maps, error tracking, and performance metrics.

**Returns**: 
- An object containing detailed project analytics.
- A 500 status message in case of an error.

## Usage

To use this Fleek function, send HTTP requests to the appropriate endpoint with the required parameters. The function will handle the routing and return the appropriate response based on the endpoint logic.

## Fleek Functions

Fleek Functions are an excellent choice for deploying serverless applications due to their scalability, efficiency, and ease of use. By combining multiple endpoints into a single Fleek function, we have demonstrated the flexibility and power of Fleek, allowing for streamlined development and deployment of serverless APIs.

---

Feel free to explore the code and adapt it to your needs. Contributions are welcome!
