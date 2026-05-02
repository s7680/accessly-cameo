// src/components/profile/ProfileHeader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { getUserById } from "@/lib/db/users";

export default function ProfileHeader() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) return;

      const { data } = await getUserById(authData.user.id);
      setProfile(data);

      if (data?.avatar_url) {
        setAvatar(data.avatar_url);
      }
    };

    loadProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditMode(false);
  };

  if (!profile) return null;

  return (
    <div
      className="profile-header"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "24px 0",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#333",
            backgroundImage: avatar ? `url(${avatar})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#fff",
                border: "2px solid #ccc",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              📷
            </button>
          </>
        )}
      </div>

      {editMode && profile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: 360 }}>
          <input
            style={{ padding: "8px", borderRadius: 6, border: "1px solid #555", background: "#1a1a1a", color: "#fff" }}
            value={profile?.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Full Name"
          />
          <input
            style={{ padding: "8px", borderRadius: 6, border: "1px solid #555", background: "#1a1a1a", color: "#fff" }}
            value={profile?.mobile || ''}
            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
            placeholder="Mobile Number"
          />
          <input
            style={{ padding: "8px", borderRadius: 6, border: "1px solid #555", background: "#1a1a1a", color: "#fff" }}
            value={profile?.email || ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email ID"
          />
          <input
            style={{ padding: "8px", borderRadius: 6, border: "1px solid #555", background: "#1a1a1a", color: "#fff" }}
            value={profile?.instagram || ''}
            onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
            placeholder="Instagram"
          />
          <Button variant="primary" onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
        </div>
      ) : (
        <>
          <h2 style={{ margin: 0, fontSize: 20 }}>{profile?.name}</h2>
          <div style={{ fontSize: 14, color: "#aaa" }}>
            <p style={{ margin: 4 }}>✉️ {profile?.email}</p>
            <p style={{ margin: 4 }}>📱 {profile?.mobile}</p>
            <p style={{ margin: 4 }}>📷 {profile?.instagram || '-'}</p>
            <p style={{ margin: 4 }}>🎭 {profile?.role}</p>
          </div>
          <Button variant="outline" onClick={() => setEditMode(true)}>Edit Profile</Button>
        </>
      )}
    </div>
  );
}