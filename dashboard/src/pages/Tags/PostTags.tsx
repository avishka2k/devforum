import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

import { useEffect, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import TokenUser from '../Authentication/TokenUser';

type Tags = {
  id: string;
  name: string;
  blogs: number;
};

const PostTags = () => {
  const [tags, setTags] = useState<Tags[]>([]);
  const [tagName, setTagName] = useState<string>('');
  const token = TokenUser();

  useEffect(() => {
    featchTags();
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const columns = useMemo<MRT_ColumnDef<Tags>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tag Name',
        size: 200,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'blogs', //normal accessorKey
        header: 'Associate Blogs',
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: 'views',
        header: 'Views',
        size: 150,
        enableEditing: false,
      },
    ],
    [validationErrors],
  );

  const data: Tags[] = tags;

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableEditing: true,
    editDisplayMode: 'modal',
    renderTopToolbarCustomActions: ({ table }) => (
      <button
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        <label
          htmlFor="cover"
          className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-plus"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
          <span>Create New</span>
        </label>
      </button>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">New Tag</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents.map((component, index) => {
            if (columns[index].accessorKey === 'name') {
              return (
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="tagname"
                  id="tagname"
                  placeholder="Tag Name"
                  value={row.getValue('name')}
                  onChange={(e) => setTagName(e.target.value)}
                />
              );
            }
            return null;
          })}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Create New Tag</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents.map((component, index) => {
            if (columns[index].accessorKey === 'name') {
              return (
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="tagname"
                  id="tagname"
                  placeholder="Tag Name"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                />
              );
            }
            return null;
          })}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Post Tags" />
      <>
        <MaterialReactTable table={table} />
      </>
    </DefaultLayout>
  );
};

export default PostTags;
