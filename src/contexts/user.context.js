import { createContext, useState } from "react";
import { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";
import mongoose from "mongoose";
 
// Creating a Realm App Instance
const app = new App(APP_ID);
 
// Creating a user context to manage and access all the user related functions
// across different components and pages.
export const UserContext = createContext();
 
export const UserProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 
 // Function to log in user into our App Service app using their email & password
 const emailPasswordLogin = async (email, password) => {
   const credentials = Credentials.emailPassword(email, password);
   const authenticatedUser = await app.logIn(credentials);
   const mongo = await app.currentUser.mongoClient("mongodb-atlas");
   const collection = mongo.db("UserList").collection("Users");

   //check if the user exists
   const id = authenticatedUser.id;
   const found = await collection.findOne({_id: mongoose.Types.ObjectId(id)});
   const username = email.substring(0, email.indexOf("@"));
   console.log(found);
   if(found === null){
      const result = await collection.insertOne({
        "_id": mongoose.Types.ObjectId(authenticatedUser.id),
        "username": username,
        "items": [
          {}
        ] 
      })
      console.log("inserted");
   } 

   setUser(authenticatedUser);
   return authenticatedUser;
 };
 

 // Function to sign up user into our App Service app using their email & password
 const emailPasswordSignup = async (email, password) => {
   try {
     await app.emailPasswordAuth.registerUser(email, password);

     // Since we are automatically confirming our users, we are going to log in
     // the user using the same credentials once the signup is complete.
     return emailPasswordLogin(email, password);
   } catch (error) {
     throw error;;
   }
 };
 
 // Function to fetch the user (if the user is already logged in) from local storage
 const fetchUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.refreshCustomData();
     // Now, if we have a user, we are setting it to our user context
     // so that we can use it in our app across different components.
     setUser(app.currentUser);
     return app.currentUser;
   } catch (error) {
     throw error;
   }
 }

 //Function to get User data online
 const fetchData = async () => {
    // await app.currentUser.refreshCustomData();
    const mongo = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongo.db("UserList").collection("Users");
    const id = app.currentUser.id;
    const found = await collection.findOne({_id: mongoose.Types.ObjectId(id)});
    return found.items;

 }
 
 // Function to logout user from our App Services app
 const logOutUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.logOut();
     // Setting the user to null once loggedOut.
     setUser(null);
     return true;
   } catch (error) {
     throw error
   }
 }
 
 const changeContent = async (eventType, payLoad) => {

    const mongo = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongo.db("UserList").collection("Users");
    const id = app.currentUser.id;
    switch(eventType) {
      case "ADD":
        var newItem = payLoad;
        console.log(newItem);
        await collection.updateOne({_id: mongoose.Types.ObjectId(id)}, {$push: {items: newItem}});
        var found = await collection.findOne({_id: mongoose.Types.ObjectId(id)})
        console.log(found);
        return found.items;
      case "DELETE":
        var removed = payLoad;
        console.log(removed);
        await collection.updateOne({_id: mongoose.Types.ObjectId(id)}, {$pull: {items: {_id: removed}}});
        var found = await collection.findOne({_id: mongoose.Types.ObjectId(id)})
        console.log(found);
        return found.items;
      default:
        return;
    }
}
 return <UserContext.Provider value={{ user, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, logOutUser, fetchData, changeContent }}>
   {children}
 </UserContext.Provider>;
}