import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

import { useEffect, useState } from 'react';
import axios from 'axios';
import TokenUser from '../Authentication/TokenUser';
import $ from 'jquery';
import DataTables from 'datatables.net';
import GridLinesDemo from './GridLinesDemo';


type Tags = {
  id: string;
  name: string;
  blogs: number;
};

const packageData: Tags[] = [
  {
    id: '1',
    name: 'Free package',
    blogs: 2,
  },
  {
    id: '2',
    name: 'Free package',
    blogs: 2,
  },

  {
    id: '3',
    name: 'Free package',
    blogs: 2,
  },

  {
    id: '4',
    name: 'Free package',
    blogs: 2,
  },
];

const PostTags1 = () => {
  const [tags, setTags] = useState<Tags[]>([]);
  const token = TokenUser();

  useEffect(() => {
    featchTags();
    new DataTables('#myTable');
    console.log('tags', tags);
  }, []);

  const featchTags = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/post/tags`,
      );
      const tagsData: Tags[] = response.data;
      const tagsWithDetails = await Promise.all(
        tagsData.map(async (tag) => {
          const blogsResponse = await axios.get(
            `${import.meta.env.VITE_API_ENDPOINT}/post/tags/${
              tag.id
            }/blogsCount`,
            {
              headers: {
                Authorization: `Bearer ${token?.access_token}`,
              },
            },
          );
          return {
            ...tag,
            blogs: blogsResponse.data,
          };
        }),
      );

      setTags(tagsWithDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const packageData: Tags[] = tags;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Post Tags" />
      <>
        <GridLinesDemo/>
      </>
    </DefaultLayout>
  );
};

export default PostTags1;
