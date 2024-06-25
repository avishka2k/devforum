import { useEffect, useState } from 'react';
import axios from 'axios';
import TokenUser from '../../pages/Authentication/TokenUser';
import DeleteConfirm from '../DeleteConfirm';
import { Link } from 'react-router-dom';

const TableTwo = () => {
  const [postData, setpostData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = TokenUser();
  let views = 0;

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_ENDPOINT}/post/${token?.userId}/byuser`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.access_token}`,
          },
        },
      )
      .then((response) => {
        setpostData(response.data);
      });
    setLoading(false);
  }, []);

  const status = ({ post }: { post: any }) => {
    if (new Date(post.publish_at) > new Date()) {
      return 'Scheduled';
    } else if (post.is_published) {
      return 'Published';
    } else {
      return 'Draft';
    }
  };

  return (
    <div className="rounded-sm border h-full border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Post Name</p>
        </div>
        <div className="col-span-3 hidden items-center sm:flex">
          <p className="font-medium">Tags</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Views</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Status</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : postData.length === 0 ? (
        <div className=" w-full h-full items-center flex flex-row py-4.5 text-center justify-center">
          <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
            <div className="p-3 mx-auto text-primary bg-blue-100 rounded-full dark:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                ></path>
              </svg>
            </div>
            <h1 className="mt-3 text-lg text-gray-800 dark:text-white">
              No Posts found
            </h1>
          </div>
        </div>
      ) : (
        postData.map((post: any, index: number) => (
          <div
            className="grid grid-cols-9 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5"
            key={index}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="w-24 rounded-md">
                  <img src={post.image} alt={post.title} />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {post.title.length > 45
                    ? post.title.substring(0, 45) + '...'
                    : post.title}
                </p>
              </div>
            </div>
            <div className="col-span-3 hidden items-center sm:flex">
              <div className="text-sm grid grid-cols-3 gap-1 text-black dark:text-white">
                {post.tags.map((tag: any) => (
                  <button
                    key={tag.id}
                    className="inline-flex rounded-full bg-[#EFEFEF] px-3 py-1 text-xs font-medium text-[#212B36] hover:bg-opacity-90"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{views}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {status({ post })}
              </p>
            </div>
            <div className="flex col-span-1 items-center space-x-3.5">
              <button className="hover:text-primary">
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                    fill=""
                  />
                  <path
                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                    fill=""
                  />
                </svg>
              </button>
              <DeleteConfirm
                id={post.id}
                title={post.title}
                postData={postData}
                setpostData={setpostData}
              />
              <Link
                to={`/posts/${post.id}/update`}
                className="hover:text-primary pb-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-edit"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TableTwo;
