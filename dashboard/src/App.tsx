import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Posts from './pages/Posts/Posts';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import CreatePost from './pages/Posts/CreatePost';
import PrivateRoutes from './pages/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import UpdateProfile from './pages/UpdateProfile';
import DraftPost from './pages/Posts/DraftPost';
import UpdatePost from './pages/Posts/UpdatePost';
import ScheduledPost from './pages/Posts/ScheduledPost';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route
            index
            element={
              <>
                <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/posts/all"
            element={
              <>
                <PageTitle title="Posts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Posts />
              </>
            }
          />
          <Route
            path="/posts/create"
            element={
              <>
                <PageTitle title="Create Posts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePost />
              </>
            }
          />
          <Route
            path="/posts/scheduled"
            element={
              <>
                <PageTitle title="Create Posts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ScheduledPost />
              </>
            }
          />
          <Route
            path="/posts/draft"
            element={
              <>
                <PageTitle title="Create Posts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <DraftPost />
              </>
            }
          />
          <Route
            path="/posts/:id/update"
            element={
              <>
                <PageTitle title="Create Posts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <UpdatePost />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />
          <Route
            path="/profile/update"
            element={
              <>
                <PageTitle title="Update Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <UpdateProfile />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
        </Route>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
