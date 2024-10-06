import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import React from 'react';

const Comments: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Post Comments" />
      <></>
    </DefaultLayout>
  );
};

export default Comments;
