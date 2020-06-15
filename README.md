<a href="https://github.com/COS301-SE-2020/SCUBAMATE"><img src="https://github.com/COS301-SE-2020/SCUBAMATE/blob/master/images/logo.jpeg" title="Scubamate" alt="Scubamate" height="200" width="750"></a>

# SCUBAMATE

## Overview 
"Scubamate" is a scuba diving companion app, designed to aid divers, and diving instructors with administrative tasks, such as checking weather information, logging dives, and planning diving trips.

## Software Requirements Specification 
 * <a href="https://www.overleaf.com/read/gnsygbdtvctw">Overleaf - LaTex</a>

## Project Management Tools
* <a href="https://team-anti-virus.slack.com">Slack</a>
* <a href="https://app.clickup.com/2536654/home/landing">ClickUp</a>

## Demo 1 Video Link
* <a href="https://drive.google.com/drive/folders/14hiS32Kgk8xqgvmLkFV33a35PGvYcp6Y?usp=sharing">TeamAV Demo 1</a>


## Installation Instructions
    Most of our project is done using AWS hosted resources such as Lambda, API Gateway, S3 for storage and DynamoDB.
    Thus the only installation required is to download the master branch of the git which contains our front-end (Angular, Ionic and TypeScript) code, then run this command in the terminal:
    $npm install
    Then to run the application:
    $ionic serve
    The first compilation will take a few seconds and then it will automatically open in your browser on localhost:8100.
## Mentors
* Matthew Gouws gouwsm@amazon.com
* Peter Rayner raynpete@amazon.com

## Git Landing Page
 * <a href="https://cos301capstoneproject.github.io/">cos301capstoneproject.github.io/</a>

# Collaborators

## Gisèle Nadine Marais
 * <a href="https://www.linkedin.com/in/gisele-marais-871a801a7/"> Linkedin Account </a>
 * <a href="https://giselenadine.github.io/">giselenadine.github.io</a>
 * Email : u18012583@tuks.co.za
 * <details>
     <summary><b>Responsibiities</b></summary>
     <br>
        - SRS Document: Introduction
        <br>
        - SRS Document: Domain Model
        <br>
        - Lambda function for retrieval of Dive Types and Dive Sites
        <br> 
        - Designed and Implemented the DynamoDB database
        <br>
        - Error checking for retrieval of Dive History 
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
    </details>


## Jaime Matthew Tellie 
 * <a href="https://www.linkedin.com/in/jaime-tellie/"> Linkedin  Account </a>
 * <a href="https://u17021627.github.io/">u17021627.github.io</a>
 * Email : u17021627@tuks.co.za
 * <details>
     <summary><b>Responsibiities</b></summary>
     <br>
        - SRS Document: Trace-ability Matrix
        <br>
        - SRS Document: Quality Requirements
        <br>
        - Insert data
        <br> 
        - Insert data
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
    </details>

## Isobel Bosman 
 * <a href="https://www.linkedin.com/in/isobel-bosman-8b29661a7/"> Linkedin  Account </a>
 * <a href="https://u18020519.github.io/">u18020519.github.io</a>
 * Email : u18020519@tuks.co.za
 * <details>
     <summary><b>Responsibiities</b></summary>
     <br>
        - SRS Document: Functional Requirements 
        <br>
        - SRS Document: Use Cases
        <br>
        - Created the foundation of our very first Lambda functions (in node js) that get account information as well as adding a new account. I also connected these to API Gateway for testing.
        <br> 
        - I created the Lambda function that adds a user's dive log to the database. The function receives the user's current access token and verifies it. Only if the token is valid will the dive log data be committed.
        <br>
        - I connected this diveLog Lambda function to APIGateway and configured the POST request in such a way that all the requeste that the API receives are in the correct format.
        <br>
        - Another Lambda function that I implemented was the retrieving of dive logs from a specific user. This function only expects an access token that is fisrt verified and returns the user's list of dives.
        <br>
        - This diveLogHistory Lambda function was also connected to APIGateway and configured accordingly. 
        <br>
    </details>

## James Darren Jenkins-Ferrett 
 * <a href=""> Linkedin  Account </a>
 * <a href="https://jamesjenkinsferrett.github.io/">jamesjenkinsferrett.github.io</a>
 * Email : u18047701@tuks.co.za
 * <details>
     <summary><b>Responsibiities</b></summary>
     <br>
        - SRS Document: Introduction
        <br>
         SRS Document: User Charactaristics and Overview
        <br>
        - Insert data
        <br> 
        - Insert data
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
    </details>

## Carmen Janse van Rensburg 
 * <a href="https://www.linkedin.com/in/carmen-janse-van-rensburg-5b54691a9/"> Linkedin  Account </a>
 * <a href="https://carmenjvr.github.io/">carmenjvr.github.io</a>
 * Email : u18000836@tuks.co.za
 * <details>
     <summary><b>Responsibiities</b></summary>
     <br>
        - SRS Document: Functional Requirements
        <br>
        - SRS Document: Use Cases
        <br> 
        - Angular Ionic Frontend
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
        - Insert data
        <br>
    </details>

# Testing Instructions
 TBC
