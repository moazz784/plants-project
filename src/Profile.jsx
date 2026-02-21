import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- الاستيرادات المطلوبة للربط ---
import { useAuth } from './AuthContext';
import { api, getErrorMessage } from './api';

export default function Profile() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();

  // 1. استخدام AuthContext لجلب بيانات اليوزر الحالية
  const { user, refreshUser, loading } = useAuth();

  const profileSchema = yup.object({
    name: yup.string().min(3, t('name_min')).required(t('name_required')),
    password: yup.string().min(6, t('password_min')).nullable().transform((curr, orig) => orig === '' ? null : curr),
  });

  // 2. دالة الإرسال للباك أند
  const handleSubmit = async (values, { setSubmitting }) => {
    const loadingToast = toast.loading(i18n.language === 'ar' ? "جاري الحفظ..." : "Saving...");
    
    try {
      // إرسال البيانات للـ API (الاسم والباسورد الجديدة)
      await api.users.updateMe({ 
        name: values.name, 
        newPassword: values.password || undefined 
      });

      // مهم جداً: تحديث بيانات اليوزر في الـ Context عشان الاسم يتغير في الهيدر فوراً
      await refreshUser();

      toast.dismiss(loadingToast);
      toast.success(t('save_success') || "Updated successfully!");
      navigate('/'); 
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(getErrorMessage(err));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null; // استنى لما الـ Auth يحمل

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">{t('edit_profile')}</h1>
        <Formik
          // 3. جعل القيم الابتدائية تأتي من السيرفر (عبر الـ Context)
          initialValues={{
            name: user?.name || '',
            password: '',
          }}
          enableReinitialize={true} // عشان لو البيانات اتأخرت يحدث الفورم
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
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

              <div className="relative mb-4">
                {/* <label className="block mb-1 font-medium">{t('password')} ({t('optional') || 'Optional'})</label> */}
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('enter_new_password') || "New Password"}
                    className="w-full border rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition font-medium disabled:bg-gray-400"
              >
                {isSubmitting ? (i18n.language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('save_changes')}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}