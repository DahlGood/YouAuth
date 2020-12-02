# YouAuth

## Authors:
Luke Dependahl, Ramey Elayan, Peter Zheng, Nate Hansell

## Project Vision
For companies, campuses, and other larger organizations/corporations who need better and more efficient security for their websites. YouAuth will be a web application that can be seamlessly integrated into websites to provide facial recognition functionality through the use of a FaceAPI. YouAuth can either replace the use of usernames/passwords, or be added as an extra layer of authentication.

What differentiates YouAuth from standard login systems is that it uses biometrics, an increasingly popular way of identifying individuals based off their biological features. Unlike similar security services like FaceID, YouAuth will not be device specific, and can be cross platform as necessary for platforms that support running web applications.

## Features

* User login and registration pages.
* Image capture.
* Image training with FaceAPI.
* Secure data storage.

## Testing
Manual Testing:

https://docs.google.com/document/d/1Nirp_maQB-Z6LEGPbceiQUi6ohhWNVIE9vDyhigRHWs/edit?usp=sharing

## Project Board:
Trello:

https://trello.com/b/p6nAi78i/youauth

## Persona

### Paul, 26
>Paul is a software developer for an online learning platform that allows students to learn and interact with tutors who provide resources for various curricula. The company requires its users to register to gain access to many of the features on the website. Rather than simply logging in with a user/password combination, Paul wishes to enhance the user’s experience by optimizing the authentication of their account with the use of YouAuth. YouAuth conveniently allows developers like Paul to implement a system that allows users to register and login with an image capture of their face. With a quick glance at the camera, user’s will have their appearance or any changes thereof, automatically adapted to by YouAuth. Whether it’s a difference in facial hair, accessories, or makeup, a clear distinction between different users will be made with our technology. Paul can safeguard the information of his user’s via YouAuth which will vectorize the captured image of the student and store it in a database to associate the identity of each person. Student’s can now seamlessly login or register for the company with a quick picture, granting them access to many more of the website’s features.


### Matthew, 45
>Matthew, age 45, is a software developer in Utah. He stays up to date on the latest technological advancements and has an interest in AI. Matthew specializes in sales and primarily distributes tracking software. Most of his clients are older, small to medium-sized business owners, who don’t use the internet often. He’s found that a majority of his clients have trouble recalling their passwords and often have poor password security. He decides that YouAuth is a good alternative to traditional password authentication. YouAuth provides his clients with the ability to use new facial recognition services and no longer worry about password management during day-to-day operations.

### Steve, 35
>Steve, age 35, is a technical support specialist at a Bank in Miami, Florida, located in neighborhood with a large elderly demographic. Steve has a IT degree from the University of Florida. After 10 years in the field, he primarily focused on dealing with website security. His current work involves improving the login system on the Bank website because many of their bank clients aren't very tech savvy. Steve has found out that the main security vulnerability is the use of weak passwords. He has received on average, ten calls a month about a account being stolen. When talking with the clients, he found out that they didn't like having long and complex passwords because they were difficult to remember. Asking clients to use phone authentication or password managers is too inconvenient for non-tech savvy people. By implementing YouAuth into the website, it will allow bank clients to log in using their face as a extra layer of authentication. The process only requires a webcam, and is easy, quick, and secure.

### Jacob, 28
>Jacob is white collar worker in Philadelphia and he suffers from dyslexia. He commutes to work everyday on the train where he works for Comcast in their media department.
Throughout the day, Jacob has to log on and off websites, some of which are work-related, and others of which are personal. 
The websites he uses include email, social media sites, entertainment sites such as YouTube, and business websites for work. 
Logging into these websites can take a long time and be very frustrating because of his dyslexia. 
If Jacob had access to YouAuth, the facial recognition software would help him log into
these website securely and quickly without having to struggle to enter in long, complicated passwords. 
Not only would this save Jacob time at work but it would also help him avoid unwarranted frustration.

## Dependencies
Check out face-api.js, it's really cool!
* face-api.js:
https://github.com/justadudewhohacks/face-api.js/


## Project Structure

YouAuth is split into three main folders, server, web and youauth.
* server: Express
* web: React
* youauth: Node module using face-api.js.

### UML

*UML GOES HERE*

## How to Install

* Download our latest release.
* Install Node.js. Link: https://nodejs.org/en/download/
* Install MongoDB. Link: https://www.mongodb.com/try/download/community
* Start Mongo and create database called YouAuth.
* Drop the folder somewhere you want to deploy the server on, such as DigitalOcean. Or localhost.
* Go into server and web folder and type 'npm install'.
* Configure the routes to your liking in web/.env file.
* Mongo URI is in server/.env file.
* To run express backend, in server folder run 'node server.js'.
* To run react frontend, in web folder run 'npm start'.

### Installation Issues

Windows: If you encounter an error saying 'specified module cannot be found' with tensorflow.
* Navigate to youauth/node_modules/@tensorflow/tfjs-node.
* Move tensorflow.dll from deps/lib.
* Navigate back out to tfjs-node folder, and place the file inside lib/napi-v5.

Or you can optionally disable tensorflow in the code, but it makes face-api run much faster.
* In youauth/face_recognizer.js
* Uncomment const tf = require('@tensorflow/tfjs-node');
