'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { upsertUser } from '@/lib/db/users';

export default function OnboardingPage() {
  const [fullName, setFullName]   = useState('');
  const [mobile, setMobile]       = useState('');
  const [email, setEmail]         = useState('');
  const [instagram, setInstagram] = useState('');
  const [role, setRole] = useState<'fan' | 'creator'>('fan');
  const [avatar, setAvatar]       = useState<File | null>(null);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState('');
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) setEmail(data.user.email);
    };

    const checkScreen = () => {
      setIsMobile(window.innerWidth < 600);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    loadUser();

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!mobile.trim())   { setError('Mobile number is required.'); return; }

    setLoading(true);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      setError('Unable to fetch user. Please try again.');
      setLoading(false);
      return;
    }

    if (avatar && avatar.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      setLoading(false);
      return;
    }

    let avatarUrl = null;

    if (avatar) {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatar, { upsert: true });

      if (uploadError) {
        setError('Image upload failed');
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      avatarUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await upsertUser({
      id: user.id,
      email: user.email,
      name: fullName.trim(),
      mobile: mobile.trim(),
      instagram: instagram.trim() || null,
      avatar_url: avatarUrl,
      role: role,
    });

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }
    setSuccess('Profile successfully created');

    const redirectTo =
      document.referrer && document.referrer.includes(window.location.origin)
        ? document.referrer
        : '/';

    setTimeout(() => {
      router.push(redirectTo);
    }, 1000);
  };

  const fields = [
    {
      id:          'fullName',
      label:       'Full Name',
      type:        'text',
      placeholder: 'Jane Doe',
      value:       fullName,
      onChange:    (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value),
      readOnly:    false,
      required:    true,
    },
    {
      id:          'email',
      label:       'Email',
      type:        'email',
      placeholder: '',
      value:       email,
      onChange:    undefined,
      readOnly:    true,
      required:    true,
    },
    {
      id:          'mobile',
      label:       'Mobile Number',
      type:        'tel',
      placeholder: '9876543210',
      value:       mobile,
      onChange:    (e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value),
      readOnly:    false,
      required:    true,
    },
    {
      id:          'role',
      label:       'Role',
      type:        'select',
      placeholder: '',
      value:       role,
      onChange:    (e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as 'fan' | 'creator'),
      readOnly:    false,
      required:    true,
    },
    {
      id:          'instagram',
      label:       'Instagram',
      type:        'text',
      placeholder: '@yourhandle',
      value:       instagram,
      onChange:    (e: React.ChangeEvent<HTMLInputElement>) => setInstagram(e.target.value),
      readOnly:    false,
      required:    false,
    },
  ] as const;

  return (
    <main className="container">
      <div className="section-block onboarding-wrapper">
        <div className="card onboarding-card">
          <h1 className="onboarding-title" style={{ textAlign: 'center' }}>
            Welcome! Let's get you set up
          </h1>

          <form onSubmit={handleSubmit} className="onboarding-form">

            {fields.map(({ id, label, type, placeholder, value, onChange, readOnly, required }) => (
              <div
                key={id}
                className="form-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '160px 280px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <label htmlFor={id} className="form-label">
                  {label}{required && <span style={{ color: 'red' }}> *</span>}
                </label>
                {type === 'select' ? (
                  <select
                    id={id}
                    className="form-input"
                    value={value}
                    onChange={onChange as any}
                    style={{ fontSize: '16px', padding: '10px' }}
                  >
                    <option value="fan">Fan</option>
                    <option value="creator">Creator</option>
                  </select>
                ) : (
                  <input
                    id={id}
                    type={type}
                    className="form-input"
                    placeholder={placeholder}
                    value={value || ''}
                    {...(onChange ? { onChange } : {})}
                    readOnly={readOnly}
                    style={{ fontSize: '16px', padding: '10px' }}
                  />
                )}
              </div>
            ))}

            <div
              className="form-row"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '160px 280px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              <label htmlFor="avatar" className="form-label">
                Profile Picture
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="form-input"
                style={{ fontSize: '16px', padding: '10px' }}
                onChange={(e) => { if (e.target.files?.[0]) setAvatar(e.target.files[0]); }}
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '8px' }}>{success}</p>}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                className="btn btn--primary onboarding-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}