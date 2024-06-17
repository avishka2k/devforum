import React from "react";
import UserData from "./UserData";

interface ProfileIconProps {
     size?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ size = "12" }) => {
     const userData = UserData();
     const avatar = userData?.profile.avatar;
     const user = userData?.username;
   
     return avatar ? (
          <img
               src={avatar}
               alt={user}
               className={`h-${size}`}
          />) : (<img
               src="https://devforum-s3.sgp1.cdn.digitaloceanspaces.com/basic/default-user-icon.png"
               alt="User"
               className={`h-${size}`}
          />
     );
}
export default ProfileIcon;