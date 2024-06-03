import toast, { Toaster } from 'react-hot-toast';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return toast.custom((t) =>
    type === 'success' ? (
      <div className="max-w-[522px] min-w-[450px] bg-white rounded-lg py-4 pl-4 pr-4.5 shadow-2 dark:bg-meta-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-grow items-center gap-5">
            <div className="flex h-10 w-full max-w-10 items-center justify-center rounded-full bg-[#1EA779]">
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.1264 2.27326C17.9391 2.06543 17.6448 2.06543 17.4574 2.27326L7.69058 12.7836C7.61031 12.8726 7.50327 12.8726 7.423 12.7836L2.5797 7.5581C2.39239 7.35027 2.09805 7.35027 1.91074 7.5581C1.72343 7.76593 1.72343 8.09252 1.91074 8.30035L6.75403 13.5258C6.9681 13.7633 7.26245 13.8821 7.53003 13.8821C7.82437 13.8821 8.09196 13.7633 8.30603 13.5258L18.0729 3.01551C18.287 2.80768 18.287 2.48109 18.1264 2.27326Z"
                  fill="white"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.0302 1.51876L19.0574 1.55404C19.5496 2.19109 19.5671 3.17716 18.9194 3.83286L9.17296 14.3212C8.74637 14.7905 8.16862 15.0586 7.53004 15.0586C6.93379 15.0586 6.3244 14.8022 5.88662 14.3206L1.03674 9.08806C0.446028 8.43262 0.446113 7.42591 1.03683 6.77048C1.68907 6.04677 2.79116 6.04419 3.44661 6.76274L7.55774 11.1983L16.5912 1.47722C17.2467 0.759356 18.3483 0.76216 19.0003 1.48564L19.0302 1.51876ZM2.5797 7.5581C2.39239 7.35027 2.09805 7.35027 1.91074 7.5581C1.747 7.73978 1.7264 8.01221 1.84893 8.21672C1.85132 8.22072 1.85377 8.22469 1.85627 8.22863C1.87221 8.25374 1.89037 8.27775 1.91074 8.30035L6.75403 13.5258C6.9681 13.7633 7.26245 13.8821 7.53003 13.8821C7.82437 13.8821 8.09196 13.7633 8.30603 13.5258L18.0729 3.01551C18.1038 2.98556 18.1302 2.95313 18.1523 2.91895C18.155 2.91483 18.1576 2.91069 18.1601 2.90652C18.2828 2.70529 18.261 2.44753 18.1264 2.27326C17.9391 2.06543 17.6448 2.06543 17.4574 2.27326L7.69058 12.7836C7.65639 12.8215 7.61735 12.8433 7.57759 12.8489C7.5706 12.8499 7.56359 12.8504 7.55658 12.8504C7.54772 12.8504 7.53886 12.8495 7.53004 12.8479C7.52377 12.8468 7.51753 12.8452 7.51133 12.8433C7.50632 12.8417 7.50132 12.8399 7.49637 12.8378C7.47058 12.8268 7.44571 12.8088 7.423 12.7836L2.5797 7.5581Z"
                  fill="white"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="mb-0.5 text-title-xsm font-medium text-black dark:text-white">
                Congratulations
              </h4>
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>

          <div>
            <button onClick={() => toast.dismiss(t.id)}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.854423 0.85186C1.2124 0.493879 1.79281 0.493879 2.15079 0.85186L7.0026 5.70368L11.8544 0.85186C12.2124 0.493879 12.7928 0.493879 13.1508 0.85186C13.5088 1.20984 13.5088 1.79024 13.1508 2.14822L8.29897 7.00004L13.1508 11.8519C13.5088 12.2098 13.5088 12.7902 13.1508 13.1482C12.7928 13.5062 12.2124 13.5062 11.8544 13.1482L7.0026 8.2964L2.15079 13.1482C1.79281 13.5062 1.2124 13.5062 0.854423 13.1482C0.496442 12.7902 0.496442 12.2098 0.854423 11.8519L5.70624 7.00004L0.854423 2.14822C0.496442 1.79024 0.496442 1.20984 0.854423 0.85186Z"
                  fill="#B1B1B1"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="max-w-[600px] min-w-[450px] rounded-lg border border-[#F5C5BB] bg-[#FCEDEA] py-4 pl-4 pr-5.5 shadow-2 dark:border-[#EA4E2C] dark:bg-[#1B1B24]">
        <div className="flex items-center justify-between">
          <div className="flex flex-grow items-center gap-5">
            <div className="flex h-15 w-full max-w-15 items-center justify-center rounded-md bg-[#EA4E2C]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.2021 3.33462C14.7513 3.02546 15.3708 2.86304 16.001 2.86304C16.6312 2.86304 17.2507 3.02546 17.7999 3.33462C18.349 3.64379 18.8092 4.08926 19.136 4.62807L19.1389 4.63282L30.4322 23.4862L30.4403 23.5C30.7605 24.0544 30.9299 24.683 30.9317 25.3233C30.9335 25.9635 30.7676 26.593 30.4505 27.1493C30.1335 27.7055 29.6763 28.169 29.1245 28.4937C28.5727 28.8184 27.9455 28.9929 27.3053 29L27.2943 29.0001L4.69668 29C4.05647 28.993 3.42928 28.8184 2.87748 28.4937C2.32568 28.169 1.86851 27.7055 1.55146 27.1493C1.23441 26.593 1.06853 25.9635 1.07033 25.3233C1.07212 24.683 1.24152 24.0544 1.56168 23.5L1.5698 23.4862L12.8631 4.63282L13.721 5.1467L12.866 4.62807C13.1928 4.08926 13.653 3.64379 14.2021 3.33462ZM14.5773 5.6632C14.5769 5.66391 14.5764 5.66462 14.576 5.66532L3.29013 24.5062C3.14689 24.7567 3.07113 25.0402 3.07032 25.3289C3.0695 25.6199 3.1449 25.906 3.28902 26.1589C3.43313 26.4117 3.64093 26.6224 3.89175 26.77C4.14117 26.9167 4.42447 26.996 4.71376 27H27.2882C27.5775 26.996 27.8608 26.9167 28.1103 26.77C28.3611 26.6224 28.5689 26.4117 28.713 26.1589C28.8571 25.906 28.9325 25.6199 28.9317 25.3289C28.9309 25.0402 28.8551 24.7567 28.7119 24.5062L17.426 5.66532C17.4256 5.66462 17.4251 5.66391 17.4247 5.6632C17.2762 5.41924 17.0676 5.21752 16.8187 5.07739C16.5691 4.93686 16.2875 4.86304 16.001 4.86304C15.7146 4.86304 15.4329 4.93686 15.1833 5.07739C14.9345 5.21752 14.7258 5.41924 14.5773 5.6632Z"
                  fill="white"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 11C16.5523 11 17 11.4477 17 12V17.3333C17 17.8856 16.5523 18.3333 16 18.3333C15.4477 18.3333 15 17.8856 15 17.3333V12C15 11.4477 15.4477 11 16 11Z"
                  fill="white"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 22.6666C15 22.1143 15.4477 21.6666 16 21.6666H16.0133C16.5656 21.6666 17.0133 22.1143 17.0133 22.6666C17.0133 23.2189 16.5656 23.6666 16.0133 23.6666H16C15.4477 23.6666 15 23.2189 15 22.6666Z"
                  fill="white"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="mb-0.5 text-title-xsm font-medium text-black dark:text-[#EA4E2C]">
                Uh oh, something went wrong
              </h4>
              <p className="text-sm font-medium">
                {message}
              </p>
            </div>
          </div>

          <div>
            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-meta-4">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.854423 0.85186C1.2124 0.493879 1.79281 0.493879 2.15079 0.85186L7.0026 5.70368L11.8544 0.85186C12.2124 0.493879 12.7928 0.493879 13.1508 0.85186C13.5088 1.20984 13.5088 1.79024 13.1508 2.14822L8.29897 7.00004L13.1508 11.8519C13.5088 12.2098 13.5088 12.7902 13.1508 13.1482C12.7928 13.5062 12.2124 13.5062 11.8544 13.1482L7.0026 8.2964L2.15079 13.1482C1.79281 13.5062 1.2124 13.5062 0.854423 13.1482C0.496442 12.7902 0.496442 12.2098 0.854423 11.8519L5.70624 7.00004L0.854423 2.14822C0.496442 1.79024 0.496442 1.20984 0.854423 0.85186Z"
                  fill="#637381"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    ),
  );
};
export default Notification;
