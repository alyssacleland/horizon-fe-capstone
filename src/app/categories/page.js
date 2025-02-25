'use client';

import React from 'react';
import { getUser } from '../../api/userData';
import { useAuth } from '../../utils/context/authContext';

export default function CategoriesPage() {
  const { user } = useAuth();
  getUser(user.uid).then((data) => console.log(data));
  return <div>this is the categories page</div>;
}
