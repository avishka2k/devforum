import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import React from 'react';

const DraftPost: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Draft Post" />
      <></>
    </DefaultLayout>
  );
};

export default DraftPost;
