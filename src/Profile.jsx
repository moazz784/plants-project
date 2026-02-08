import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const savedData = JSON.parse(localStorage.getItem('user_data')) || { name: '', image: null };

  const profileSchema = yup.object({
    name: yup.string().min(3, t('name_min')).required(t('name_required')),
    password: yup.string().min(6, t('password_min')).required(t('password_required')),
  });

  const handleSubmit = (values) => {
    const updatedData = { ...savedData, name: values.name, password: values.password };
    localStorage.setItem('user_data', JSON.stringify(updatedData));
    toast.success(t('save_success'));
    navigate('/'); // العودة لصفحة Home
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">{t('edit_profile')}</h1>
        <Formik
          initialValues={{
            name: savedData.name || '',
            password: savedData.password || '',
          }}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-4">
            {/* خانة الاسم */}
            <div>
              <label className="block mb-1 font-medium">{t('name')}</label>
              <Field
                name="name"
                type="text"
                placeholder={t('enter_name')}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* خانة الباسورد مع أيقونة العين */}
            <div className="relative flex items-center">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('enter_password')}
                className="w-full border rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 h-full flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1 absolute bottom-[-1.25rem]" />
            </div>

            {/* زر الحفظ */}
            <button
              type="submit"
              className="mt-4 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition font-medium"
            >
              {t('save_changes')}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

