import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import ProfileIcon from '../components/ServerData/ProfileIcon';
import UserData from '../components/ServerData/UserData';
import PostData from '../components/ServerData/PostData';
import { Divider } from '@mui/material';
import IconSelector from '../components/IconSelector';

const Profile = () => {
  const userData = UserData();
  const postData = PostData();

  let formattedDate = '';
  if (userData) {
    const date = new Date(userData.created_at);
    formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profile" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3 overflow-hidden rounded-sm border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-20">
              <div className="absolute bottom-1 right-1 z-10 xsm:top-6 xsm:right-6">
                <Link to="/profile/update">
                  <label
                    htmlFor="cover"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-6"
                  >
                    <span>
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M21.364 2.636C22.1452 3.41727 22.1452 4.68342 21.364 5.46465L8.70711 18.1213C8.51957 18.3089 8.26521 18.4358 7.98818 18.4795L3 19.25L3.7705 14.2618C3.81423 13.9848 3.94111 13.7304 4.12866 13.5429L16.7855 0.885933C17.5667 0.104704 18.8329 0.104704 19.6141 0.885933L21.364 2.636ZM5.58197 15.9405L9.09752 15.3155L18.364 6.04894L15.9511 3.63604L6.68454 12.9026L6.05953 16.4181L5.58197 15.9405Z"
                          fill="white"
                        />
                      </svg>
                    </span>

                    <span>Edit</span>
                  </label>
                </Link>
              </div>
            </div>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="relative z-30 mx-auto  h-40 w-40">
                <div className="relative drop-shadow-2 w-40 rounded-full overflow-hidden">
                  <ProfileIcon size="40" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {userData?.profile
                    ? userData.profile.fullname.charAt(0).toUpperCase() +
                      userData.profile.fullname.slice(1)
                    : 'User'}
                </h3>
                <p className="font-medium">
                  {userData?.profile.headline ? userData.profile.headline : <></>}
                </p>
                <p className="text-sm pt-2">Joined on {formattedDate}</p>

                <div className="py-5 m-auto max-w-100">
                  <Divider />
                </div>

                <div className="mx-auto max-w-180">
                  <h4 className="font-semibold text-black dark:text-white">
                    About Me
                  </h4>
                  <p className="mt-4.5">
                    {userData?.profile && userData.profile.bio
                      ? userData.profile.bio
                      : 'Add a bio to your profile'}
                  </p>
                </div>

                <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                    Follow me on
                  </h4>
                  <div className="flex items-center justify-center gap-3.5">
                    {userData?.profile.link1 && (
                      <Link
                        to={userData.profile.link1}
                        className="hover:text-primary"
                        aria-label="social-icon"
                        target="_blank"
                      >
                        <IconSelector url={userData.profile.link1} />
                      </Link>
                    )}
                    {userData?.profile.link2 && (
                      <Link
                        to={userData.profile.link2}
                        className="hover:text-primary"
                        aria-label="social-icon"
                        target="_blank"
                      >
                        <IconSelector url={userData.profile.link2} />
                      </Link>
                    )}
                    {userData?.profile.link3 && (
                      <Link
                        to={userData.profile.link3}
                        className="hover:text-primary"
                        aria-label="social-icon"
                        target="_blank"
                      >
                        <IconSelector url={userData.profile.link3} />
                      </Link>
                    )}
                    {userData?.profile.link4 && (
                      <Link
                        to={userData.profile.link4}
                        className="hover:text-primary"
                        aria-label="social-icon"
                        target="_blank"
                      >
                        <IconSelector url={userData.profile.link4} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-8 flex flex-col gap-5">
                <div className="flex flex-col items-center gap-1 border-r border-stroke  dark:border-strokedark xsm:flex-row">
                  <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file-text"
                    >
                      <g opacity="0.8">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </g>
                    </svg>

                    <span className="font-semibold pl-3 text-black dark:text-white">
                      {postData.length}
                    </span>
                    <span className="pl-2">Posts published</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 border-r border-stroke  dark:border-strokedark xsm:flex-row">
                  <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-message-square mt-0.5"
                    >
                      <g opacity="0.8">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </g>
                    </svg>

                    <span className="font-semibold pl-3 text-black dark:text-white">
                      12
                    </span>
                    <span className="pl-2">Comments</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 border-r border-stroke  dark:border-strokedark xsm:flex-row">
                  <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-eye mt-0.5"
                    >
                      <g opacity="0.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </g>
                    </svg>

                    <span className="font-semibold pl-3 text-black dark:text-white">
                      123k
                    </span>
                    <span className="pl-2">Post Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
