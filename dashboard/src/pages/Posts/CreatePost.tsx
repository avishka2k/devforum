import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import EditorJs from '../../components/Editor';
import axios from 'axios';
import TokenUser from '../Authentication/TokenUser';
import Notification from '../../components/Notification';
import ReactSelect from 'react-select';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
interface Option {
  value: string;
  label: string;
}

interface Tag {
  id: string;
  name: string;
}

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const navigate = useNavigate();
  let buttonText;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_ENDPOINT}/post/tags`)
      .then((response) => {
        const fetchedTags = response.data.map((tag: Tag) => ({
          value: tag.id,
          label: tag.name,
        }));
        setOptions(fetchedTags);
      })
      .catch((error) => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setFile(null);
  };

  const handleTagsChange = (selectedTags: string[]) => {
    if (selectedTags.length > 5) {
      Notification({
        message: 'You can only select up to 5 tags',
        type: 'error',
      });
      return;
    }
    setTags(selectedTags);
  };

  const handleContentChange = (data: any) => {
    setContent(data);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    tags.forEach((tag) => formData.append('tags[]', tag));
    if (file) {
      formData.append('file', file);
    }

    formData.append('is_published', isChecked.toString());
    formData.append('publish_at', selectedDateTime?.toISOString() || '');

    const token = TokenUser();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/post/${token?.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token?.access_token}`,
          },
        },
      );
      if (response.status === 201) {
        Notification({ message: 'Post created successfully', type: 'success' });
        navigate('/posts');
      }
    } catch (error: any) {
      console.log('Error submitting the form:', error);
      Notification({
        message:
          error.response.data.message ||
          'An error occurred while creating the post',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isChecked) {
    buttonText = loading ? 'Scheduling...' : 'Schedule';
  } else {
    buttonText = loading ? 'Creating...' : 'Publish';
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Post" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-10 sm:grid-cols-10">
          <div className="flex flex-col col-span-7 gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add your title"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Content
                  </label>
                  {/* <textarea
                    rows={6}
                    placeholder="Type your content"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea> */}
                  <EditorJs onChange={handleContentChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-3 gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Cover Photo
                  </label>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    {file ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Selected"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-0 right-0 bg-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          name="file"
                          onChange={handleFileChange}
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p>
                            <span className="text-primary">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                          <p>(max, 800 X 800px)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Tags
                  </label>
                  <ReactSelect
                    id="tagSelector"
                    options={options}
                    isMulti
                    onChange={(selectedTags) =>
                      handleTagsChange(selectedTags.map((tag) => tag.label))
                    }
                  />
                </div>

                <div className="mt-4" onClick={() => setIsChecked(!isChecked)}>
                  <label className="flex cursor-pointer select-none items-center text-sm font-medium">
                    <div
                      className={`relative ${
                        isChecked
                          ? 'border-primary bg-gray dark:bg-transparent'
                          : ''
                      } mr-4 flex h-5 w-5 items-center justify-center rounded border border-primary dark:bg-transparent`}
                    >
                      <span
                        className={`checkboxToggle ${
                          isChecked ? 'bg-primary' : ''
                        } h-2.5 w-2.5 rounded-sm`}
                      ></span>
                    </div>
                    Schedule Publication
                  </label>
                </div>

                <div className="">
                  {isChecked && (
                    <DateTimePicker
                      className="w-full"
                      onChange={(value: Dayjs | null) => {
                        if (value !== null) {
                          setSelectedDateTime(value.toDate());
                        } else {
                          setSelectedDateTime(null);
                        }
                      }}
                      defaultValue={dayjs()}
                    />
                  )}
                </div>
                <div className="flex flex-row gap-5 mt-4">
                  {/* <button className="inline-flex items-center gap-3 rounded-md bg-primary px-5 py-3 text-white hover:bg-opacity-90"><span className="animate-spin"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_1881_16183" fill="white"><path d="M15.328 23.5293C17.8047 22.8144 19.9853 21.321 21.547 19.2701C23.1087 17.2193 23.9686 14.72 23.9992 12.1424C24.0297 9.56481 23.2295 7.04587 21.7169 4.95853C20.2043 2.8712 18.0597 1.32643 15.6007 0.552947C13.1417 -0.220538 10.499 -0.181621 8.0638 0.663935C5.62864 1.50949 3.53049 3.11674 2.07999 5.24771C0.629495 7.37868 -0.096238 9.92009 0.0102418 12.4957C0.116722 15.0713 1.04975 17.5441 2.6712 19.5481L4.96712 17.6904C3.74474 16.1796 3.04133 14.3154 2.96106 12.3737C2.88079 10.432 3.42791 8.51604 4.52142 6.90953C5.61493 5.30301 7.19671 4.09133 9.03255 3.45387C10.8684 2.81642 12.8607 2.78708 14.7145 3.3702C16.5683 3.95332 18.1851 5.1179 19.3254 6.69152C20.4658 8.26514 21.0691 10.1641 21.046 12.1074C21.023 14.0506 20.3748 15.9347 19.1974 17.4809C18.02 19.027 16.3761 20.1528 14.5089 20.6918L15.328 23.5293Z"></path></mask><path d="M15.328 23.5293C17.8047 22.8144 19.9853 21.321 21.547 19.2701C23.1087 17.2193 23.9686 14.72 23.9992 12.1424C24.0297 9.56481 23.2295 7.04587 21.7169 4.95853C20.2043 2.8712 18.0597 1.32643 15.6007 0.552947C13.1417 -0.220538 10.499 -0.181621 8.0638 0.663935C5.62864 1.50949 3.53049 3.11674 2.07999 5.24771C0.629495 7.37868 -0.096238 9.92009 0.0102418 12.4957C0.116722 15.0713 1.04975 17.5441 2.6712 19.5481L4.96712 17.6904C3.74474 16.1796 3.04133 14.3154 2.96106 12.3737C2.88079 10.432 3.42791 8.51604 4.52142 6.90953C5.61493 5.30301 7.19671 4.09133 9.03255 3.45387C10.8684 2.81642 12.8607 2.78708 14.7145 3.3702C16.5683 3.95332 18.1851 5.1179 19.3254 6.69152C20.4658 8.26514 21.0691 10.1641 21.046 12.1074C21.023 14.0506 20.3748 15.9347 19.1974 17.4809C18.02 19.027 16.3761 20.1528 14.5089 20.6918L15.328 23.5293Z" stroke="white" strokeWidth="14" mask="url(#path-1-inside-1_1881_16183)"></path></svg></span>Loading...</button> */}
                  <button className="flex w-full justify-center rounded border border-primary p-3 font-medium text-primary hover:bg-opacity-90">
                    Save As Draft
                  </button>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DefaultLayout>
  );
};

export default CreatePost;
