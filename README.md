# Forum-Application

# Link to the GitHub repository
[Forum Application GitHub Repository](https://github.com/Team-3-Telerik-Academy/Forum-Application)

## Project Description
### Title: Hobby Forum App
#### Overview:
The Hobby Forum App is a platform designed for enthusiasts to come together and share their passions in various categories such as art, gaming, LEGO, and photography. Users can engage in discussions, share tips and tricks, showcase their work, and connect with like-minded individuals in a vibrant community setting.

#### Key Features:
- **Category-Based Forums:** The app offers four main categories - art, gaming, LEGO, and photography, each hosting dedicated forums where users can initiate discussions and participate in conversations related to their interests.
- **User Profiles:** Users can create profiles that showcase their interests, expertise, and contributions within the community. Profiles allow members to connect with each other, follow favorite contributors, and build a network within their chosen hobby community.

## Instructions on How to Set Up and Run the Project Locally:
1. Open the terminal and navigate to the folder where the `package.json` file is located.
2. Run the command `npm i` or `npm install` to install the project dependencies.
3. After the dependencies are installed, run the command `npm run dev` to start the project.
4. Finally, open a web browser and navigate to the generated link, or alternatively, press Ctrl and click the link to open it.

## Project Structure
You will find the following folders and files:

1. `src/AppContext` - the main context provider where all the global state of the application is being held.
2. `src/components` - contains all the smaller components used to build the application.
3. `src/components/views` - contains all the routed components - Admin Dashboard, AdminDashboardBlockedUsers, AdminDashboardHeader, AdminDashboardPosts, CreatePost, Home, NotFound, Post, Posts, Profile, Search, SignIn, SignUp.
4. `src/config` - the firebase configuration file.
5. `src/helpers` - reusable functions.
6. `src/Images` - all the images that are used in the application.
7. `src/services` - services functions for users, posts, and authentication used to manipulate firebase data.
8. `App.jsx` - the composition root of the application.