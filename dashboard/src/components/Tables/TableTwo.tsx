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
      .get(`${import.meta.env.VITE_API_ENDPOINT}/post/${token?.userId}/byuser`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.access_token}`,
        },
      
      })
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
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
        postData.map((post: any, key: any) => (
          <div
            className="grid grid-cols-9 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5"
            key={key}
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
                  <button className="inline-flex rounded-full bg-[#EFEFEF] px-3 py-1 text-xs font-medium text-[#212B36] hover:bg-opacity-90">
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
              <Link to={`/posts/${post.id}/update`} className="hover:text-primary">
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                    fill=""
                  />
                  <path
                    d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                    fill=""
                  />
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
