import { useEffect, useState } from "react";
import { Post } from "../../types/post";
import axios from "axios";
import TokenUser from "../../pages/Authentication/TokenUser";

const PostData = () => {
     const [postData, setPostData] = useState<Post[]>([]);

     useEffect(() => {
       const token = TokenUser();

          axios
      .get(`${import.meta.env.VITE_API_ENDPOINT}/post/${token?.userId}/byuser`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.access_token}`,
        },
      
      })
      .then((res) => {
          setPostData(res.data);
      });
     }, []);

     return postData;
}

export default PostData;