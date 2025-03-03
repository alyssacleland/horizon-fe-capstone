'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CategoryForm from '../../../../components/forms/CategoryForm';
import { getSingleCategory } from '../../../../api/categoryData';

export default function EditCategoryPage({ params }) {
  const { firebaseKey } = params;
  const [editItem, setEditItem] = useState({});

  useEffect(() => {
    getSingleCategory(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  return (
    <div>
      <CategoryForm catObj={editItem} />
    </div>
  );
}

EditCategoryPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
