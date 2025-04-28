// // App.js (client side)
import React from "react";
import { Routes, Route, Navigate, useLocation  } from "react-router-dom";

// Components
import LandingPage from './LandingPage/LandingPage';
import AppProviders from "./AppProviders";
import ProtectedRoute from "./Components/ProtectedRoute";
//proxy page for store user from google callback URL Token
import AuthProxy from "./LandingPage/AuthProxy";
import ResetPasswordModal from './LandingPage/ForgotPassword/ResetPasswordModal'; // Import the modal


// Pages
import Terms from "./Components/Terms";
import Forum from "./Pages/Forum/Forum";
import AboutUs from "./Pages/AboutUs/About";
//import JoinUs from "./Pages/JoinUs/JoinUs";
import User from "./Pages/User/User";
import Header from "./Components/Header/Header";
import ContactUs from "./Pages/Contact/ContactUs";
import FAQ from "./Pages/FAQ/FAQ";
import Donation from "./Pages/Donate/Donation";
import UpdateProfile from "./Pages/UpdateProfile/UpdateProfile";
import Admin from './Admin/Admin'
import Blog from "./Pages/Blog/Blog";
import Survey from "./Pages/Survey/Survey";
import AdminNotices from "./Admin/AdminNotices";
import AdminRoute from "./Components/AdminRoute";
import Unauthorized from "./Components/Unauthorized";
import SurveyStats from "./Pages/Survey/SurveyStats";
import Footer from "./Components/Footer/Footer";

import "./App.css";
import FollowCheckPage from "./Pages/Forum/FollowCheckPage";
import Voluntear from "./Pages/JoinUs/Volunteer";
import Donate from "./Pages/Donate/Donate";
import SurveyResponse from "./Pages/User/SurveyResponse";
import Support from "./Pages/Donate/Support";
import AdminDashboardToHandleBeneficiary from "./Admin/BeneficiaryHandle";
import BeneficiaryDetailPage from './Admin/BenificiaryDetails';
import Dashboard from "./Pages/Dashboard/Dashboard";
import RegisterforSupport from './Pages/Support/ResigterforSuppost';
import Donor from "./Admin/Donor";
import YouthConference from "./Pages/YouthConference/YouthConference";
import Conference from "./Admin/Conference";
import RealTimeLocation from "./Components/RealTimeLocation";
import JoinUSup from "./Pages/JoinUs/JoinUSup";
import CarForCharity from "./Pages/Donate/CarForCharity/CarForCharity";
import Sanatan from "./Pages/SanatanIsOnlyTruth/Sanatan";
import UserProfile from "./Pages/User/UserPost/UserProfile"
import UserSuggestions from "./Pages/Suggestions/UserSuggestions";




const App = () => {
  const location = useLocation();

  // List of routes where you DON'T want to show the Header
  const noHeaderRoutes = ['/all_Sanatani_Under_One_Umbrella'];

  const showHeader = !noHeaderRoutes.includes(location.pathname);


  return (
    <>

      <AppProviders>
      {showHeader && <Header />}
        {/* <Header /> */}
       
        <Routes>
        

          
          {/* Location */}
          <Route path="/location" element={<RealTimeLocation/>}/>
          <Route path="/all_Sanatani_Under_One_Umbrella" element={<Sanatan/>}/>

         

          {/* Default route redirects to /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          

          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard/>}/>
          {/* Public route for login/signup */}
          <Route path="/login" element={<LandingPage />} />         


          <Route path="/reset-password/:token" element={<ResetPasswordModal show={true} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth/-proxy" element={<AuthProxy />} />


          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/donation" element={<Donation />} />
          
          <Route path="/donate" element={<ProtectedRoute> <Donate /> </ProtectedRoute> } />
          {/* <Route path="/needAssistance" element={ <ProtectedRoute> <Support /> </ProtectedRoute> } />  */}
          <Route path="/register/for_support" element={<ProtectedRoute> <RegisterforSupport/> </ProtectedRoute>}/>
          <Route path="/car_for_charity" element={<CarForCharity/>}/>

          {/* <Route path="/joinUs" element={<JoinUs />} /> */}
          <Route path="/joinUs" element={<ProtectedRoute><JoinUSup/></ProtectedRoute>}/>
          <Route path="/joinUs/volunteer" element={<ProtectedRoute><Voluntear /></ProtectedRoute>} />

          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/youth" element={<YouthConference />} />


          {/* admin page */}
          <Route path="/admin" element={<AdminRoute> <Admin /> </AdminRoute>} />
          {/* Create notice by admin */}
          <Route path="/admin/notices" element={<AdminRoute> <AdminNotices /> </AdminRoute>} />
          <Route path="/admin/conference" element={<AdminRoute> <Conference /> </AdminRoute>} />
          <Route path="/admin/handleBeneficiary" element={<AdminRoute> <AdminDashboardToHandleBeneficiary/> </AdminRoute>} />
          <Route path="/admin/donor" element={<AdminRoute> <Donor/> </AdminRoute>} />
          <Route path="/beneficiary/:id" element={<AdminRoute> <BeneficiaryDetailPage/></AdminRoute>} />          
          <Route path="/unauthorized" element={<Unauthorized />} />




          {/* Protected Routes */}
          {/* main page */}
         
          <Route path="/forum" element={<ProtectedRoute> <Forum /> </ProtectedRoute>} />
          {/* User Profile Page */}
          <Route path="/user/:id?/profile" element={<ProtectedRoute> <User /> </ProtectedRoute>} />
          <Route path="/user/have-suggestions" element={ <UserSuggestions />}  />

          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/profile/:userId/post/:postId" element={<UserProfile />} /> 

          

          {/* User Surver Response Page */}
          <Route path="/user/:id/surveyResponse" element={<ProtectedRoute> <SurveyResponse /> </ProtectedRoute>} />


          {/* Update User Profile Page */}
          <Route path="/user/:id?/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          
          {/* Survey page */}
          <Route path="/user/survey" element={<ProtectedRoute> <Survey /> </ProtectedRoute>} />

          {/* showing Survey Statistics */}

          <Route path="/survey-stats" element={<ProtectedRoute> <SurveyStats /> </ProtectedRoute>} />
          {/* showing Followers */}
          <Route path="/user/Users-Suggestions-for/follow" element={<ProtectedRoute> <FollowCheckPage /> </ProtectedRoute>} />
        </Routes>
        {/* </Suspense> */}
        {/* <Footer /> */}
        {showHeader && <Footer />}
      </AppProviders>

    </>
  );
};

export default App;
