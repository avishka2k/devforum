import { useEffect, useState } from "react";
import TokenUser from "../../pages/Authentication/TokenUser";
import axios from "axios";
import { User } from "../../types/user";

const UserData = () => {

     const [userData , setUserData] = useState<User | null>(null);

     useEffect(() => {
       getUserData();
     }, []);
   
     const getUserData = async () => {
       const token = TokenUser();
       if (token?.userId) {
        await axios
           .get(`${import.meta.env.VITE_API_ENDPOINT}/user/${token.userId}`, {
             headers: {
               Authorization: `Bearer ${token.access_token}`,
             },
           })
           .then((res) => {
             setUserData(res.data);
           });
       }
     };

     return userData;
}

export default UserData;