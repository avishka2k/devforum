import React from 'react';
import UserData from './UserData';

interface ProfileIconProps {
  size?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ size = '12' }) => {
  const userData = UserData();
  const avatar = userData?.profile.avatar;
  const user = userData?.username;

  return avatar ? (
    <img src={avatar} alt={user} className={`h-${size}`} />
  ) : (
    <img
      src={`${
        import.meta.env.VITE_SPACES_CDN_ENDPOINT
      }/basic/default-user-icon.png`}
      alt="User"
      className={`h-${size}`}
    />
  );
};
export default ProfileIcon;
