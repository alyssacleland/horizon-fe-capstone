'use client';

import React, { useState, useEffect } from 'react';
import CategoryCard from '@/components/CategoryCard';
import { useAuth } from '@/utils/context/authContext';
import { getCategories } from '@/api/categoryData';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import LoadingComponent from '../../components/LoadingComponent';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const getAllTheCategories = () => {
    getCategories(user.uid).then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllTheCategories();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <div className="text-center my-4">
      <h2 style={{ marginBottom: '30px' }}>{user.displayName}&apos;s Categories:</h2>

      <Link href="/category/new" passHref>
        <Button style={{ marginBottom: '20px' }}>Add A Category</Button>
      </Link>

      <div className="d-flex flex-wrap justify-content-center align-items-center mx-auto" style={{ display: 'flex', gap: '20px', overflowY: 'auto', maxHeight: '750px' }}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.firebaseKey} className="d-flex justify-content-center">
              <CategoryCard key={category.firebaseKey} categoryObj={category} onUpdate={getAllTheCategories} />
            </div>
          ))
        ) : (
          <h2>No categories yet, create a category to get started!</h2>
        )}
      </div>
    </div>
  );
}
