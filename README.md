<a href="https://github.com/COS301-SE-2020/SCUBAMATE"><img src="https://github.com/COS301-SE-2020/SCUBAMATE/blob/master/images/logo.jpeg" title="Scubamate" alt="Scubamate" height="200" width="750"></a>

# SCUBAMATE

## Overview 
"Scubamate" is a scuba diving companion app, designed to aid divers, and diving instructors with administrative tasks, such as checking weather information, logging dives, and planning diving trips.
## Deployment 
Available At: <a href="https://www.scuba.thematthew.me"> https://www.scuba.thematthew.me </a>

## Software Requirements Specification and Other Documents
 * <a href="https://www.overleaf.com/read/fpfrysmtpkzx">SRS Version 4: Overleaf - LaTex</a>
 * <a href="https://www.overleaf.com/read/shbywrwqfcvw">Coding Standards: Overleaf - LaTex</a>
 * <a href="https://www.overleaf.com/read/wrrjwwdgfgfn">User Manual: Overleaf - LaTex</a>
 * <a href="https://www.overleaf.com/read/fzpxngrydqsg">Technical Installation Guide: Overleaf - LaTex</a>
 * <a href="https://www.overleaf.com/read/pfxwhzpsjcyb">Testing Policy: Overleaf - LaTex</a>

## Project Management Tools
* <a href="https://team-anti-virus.slack.com">Slack</a>
* <a href="https://app.clickup.com/2536654/home/landing">ClickUp</a>

## Demo Video Links
* <a href="https://drive.google.com/drive/folders/14hiS32Kgk8xqgvmLkFV33a35PGvYcp6Y?usp=sharing">TeamAV Demo 1</a>
* <a href="https://drive.google.com/drive/folders/1f9AQtVqOS0MdEosUH1uwPVwZdO6j9OvS?usp=sharing">TeamAV Demo 2</a>
* <a href="https://drive.google.com/drive/folders/1s-HwZWjfE7g6LqAYjGYOIusZHvtbEbY8?usp=sharing">TeamAV Demo 3</a>
* <a href="https://drive.google.com/drive/folders/11ASHoMOxMoAoQlPSTiZ8mVP0IVLus1pu?usp=sharing">TeamAV Demo 4</a>


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
     <summary><b>Responsibilities </b></summary>
     <br>
        - SRS Document: Introduction
        <br>
        - SRS Document: Domain Model
        <br>
        - Lambda function for retrieval of Dive Types and Dive Sites
        <br> 
        - Designed and Implemented the DynamoDB database
        <br>
        - Error checking for retrieval of Dive History and Login 
        <br>
        - Set-up S3 for storage of profile images
        <br>
        - Merging branches on github
        <br>
        - Edit Account Lambda functions
        <br>
        - Edit Dive Lambda functions
        <br>
        - SRS Document: Deployment Model
        <br>
        - User Manual Document: Simple Deployment Model
        <br>
        - Code Standards Document
        <br>
        - Lookahead Lambda functions
        <br>
        - Adding and Upgrading Instructors Lambda functions
        <br>
        - Adding Dive Sites function
        <br>
        - Verifying Courses and Instructors Lambda functions
        <br>
        - Code Standards Document
        <br>
        - Course Suggestion and Survey Lambda functions
        <br>
        - Lambda functions for displaying Dive Sites and Dive Centres
        <br>
        - Architectural Design Document: Architectural Design Diagram
        <br>
        - Gamification 
        <br>
        - Bug Fixes Front-end
    
    </details>


## Jaime Matthew Tellie 
 * <a href="https://www.linkedin.com/in/jaime-tellie/"> Linkedin  Account </a>
 * <a href="https://u17021627.github.io/">u17021627.github.io</a>
 * Email : u17021627@tuks.co.za
 * <details>
     <summary><b>Responsibilities</b></summary>
     <br>
        - SRS Document: Trace-ability Matrix
        <br>
        - SRS Document: Quality Requirements
        <br>
        - Unit Testing
        <br> 
        - Integration Testing
        <br>
        - Architectural Design Documment: Quality Requirements
        <br>
        - Architectural Design Documment: Event-Driven Architecture
        <br>
        - Weather extraction for functionality of application
        <br>
        - Offline logging of dives
        <br>
        - Architectural Design Documment: Technology Requirements
        <br>
    </details>

## Isobel Bosman 
 * <a href="https://www.linkedin.com/in/isobel-bosman-8b29661a7/"> Linkedin  Account </a>
 * <a href="https://u18020519.github.io/">u18020519.github.io</a>
 * Email : u18020519@tuks.co.za
 * <details>
     <summary><b>Responsibilities</b></summary>
     <br>
        - SRS Document: Functional Requirements.
        <br>
        - SRS Document: Use Cases
        <br>
        - Architectural Design Document: Architectural Design Diagram.
        <br>
        - Lambda functions for adding and retrieving a new account.
        <br> 
        - Add new dive log lambda function.
        <br>
        - Lambda function for retrieving a list of a diver's personal dive logs.
        <br>
        - Retrieving a list of verified public dive logs Lambda function for the explore page
        <br>
        - Adding and editing a new dive centre Lambda functions.
        <br>
        - Adding courses and intructors to an existing dive centre Lambda functions.
        <br>
        - Functionality for upgrading an account to an Admin role.
        <br>
        - Adding an account to an existing dive centre Lambda function. 
    </details>

## James Darren Jenkins-Ferrett 
 * <a href=""> Linkedin  Account </a>
 * <a href="https://jamesjenkinsferrett.github.io/">jamesjenkinsferrett.github.io</a>
 * Email : u18047701@tuks.co.za
 * <details>
     <summary><b>Responsibilities</b></summary>
     <br>
        - SRS Document: Introduction.
        <br>
        - SRS Document: User Charactaristics and Overview.
        <br>
        - Lambda function for Login (including server side password hashing, and unique access token generation).
        <br> 
        - Hashing password functionality in sign-up Lambda function.
        <br>
        - Configuration of some of the endpoints in API-Gateway.
        <br>
        - Editing of Demo videos.
        <br>
        - SRS Document: Client-Server Architecture
        <br>
        - Lambda Function and API Gateway for default checklist functionality
        <br>
        - Lambda Function and API Gateway for custom checklist functionality
        <br>
        - Deletion of an account
        <br>
        - Email verification of an account
        <br>
        - Adding of dive courses
    </details>

## Carmen Janse van Rensburg 
 * <a href="https://www.linkedin.com/in/carmen-janse-van-rensburg-5b54691a9/"> Linkedin  Account </a>
 * <a href="https://carmenjvr.github.io/">carmenjvr.github.io</a>
 * Email : u18000836@tuks.co.za
 * <details>
     <summary><b>Responsibilities</b></summary>
        <br> 
        - Developing the front-end interface with Angular-Ionic.
        <br> 
        - Home page
         <br> 
        - Login and Signup pages
         <br> 
        - Explore page: public feed, dive sites and dive centres
        <br> 
        - Individual dive site and centre page with ability to view location weather and see location on google maps.
        <br> 
        - View, edit and log personal dives pages
        <br> 
        - Planning page: viewing dive sites and courses near you, suggested courses, checklist and visibility prediction.
        <br> 
        - Profile page functionality for Diver, Instructor, Admin and Super Admin.
        <br> 
        - Admin page with functionality for Admins and Super Admins.
        <br> 
        - Charts on Admin page to present the visualisation statistics.
        <br>
        - Deploying website and mobile application
        <br>
        - SRS Document: Functional Requirements
        <br>
        - SRS Document: Use Cases
        <br>
        - User Manual
        <br>
         - Non-Function Testing: Usability
        <br>
    </details>

## Testing Instructions
     Scubamate will make use of automated unit/integration testing software being Jasmine and Karma. By using Jasmine and Karma the unit/integration tests would always be performed to ensured that the system remains on a consistent standard. Jasmine as a frame work provides suites with essential functions such as describe(), taking the test case as a name and a function to be performed as the second parameter. Other functions to be included will be it() which is the more case specific function that handles the individual trial. Finally expect() is the last method used and concatenation with a matcher to test whether the case has succeeded or failed. <br>
     Run Unit Test: 
     $ng test 
    The first compilation will take a few seconds and then it will automatically open in your browser on localhost:9876.
