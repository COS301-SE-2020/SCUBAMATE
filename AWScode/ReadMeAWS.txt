------------
Introduction
------------
Since this project uses AWS resources this is the folder where we will upload the code we complete on services such as Lambda.
This text file will also contain settings or features we implement that don't have code attached which we can upload.

Lambda functions are used with API gateway to create our API.

--------
IAM Role
--------
For this project we had to add a few permission policies to a role we were given, called "ScubamateLambdaRole". 
We added permission policies for:
-Lambda : to be able to create lambda functions
-S3 : to get and put objects into our bucket

-----------
API Gateway
------------
For our settings on API gateway, all our calls have lambda proxy integration enabled, response headers set for all possible responses
and allows for cross origin so there are no CORS errors on the front end. 

---------
DynamoDB
---------
Our DynamoDB is also set up seperately from our master branch's code. For this we have two tables:
1. Scubamate 
2. Dives
Scubamate has a primary index of ItemType which has an "A" for account and a user's guid for all the account data (i.e.
Divers, Admins and Instructors) so that multiple users can sign up concurrently.
It also has an ItemType of DiveSites and DiveTypes which store a list of dive sites and dive types respectively. 

Dives has the dives stored for each user, the primary index is DiveID which has a "D" for dive and a sepearate guid for each dive - so 
multiple dives can be logged concurrently, each dive has a attribute for the account guid so it links that way. 

---
S3
---
For S3, I set up a bucket called "profilephoto-imagedatabase-scubamate" to store the profile photos for the sign up. 
I made the bucket private as requested by our client and added permissions for CORS configuration.
(see S3_CORSConfig.xml to see what was added.)
