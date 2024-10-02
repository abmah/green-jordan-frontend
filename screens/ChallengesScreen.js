import { View, Text } from "react-native";
import useUserStore from '../stores/useUserStore';
import { createPost } from "../api/post";





const ChallengesScreen = () => {
  const { userId } = useUserStore();
  // create post takes 3 paramaters description image and userId implement it here 

  // here is what it looks like currently inside the file so do the logic 
  // handle the image uplode too plese everythting 
  //   import axios from 'axios';
  // import { API_BASE_URL } from './config';


  // const apiClient = axios.create({
  //   baseURL: API_BASE_URL,
  //   timeout: 10000,
  // });

  // export const createPost = async ({ description, image, userId }) => {

  //   try {
  //     const response = await apiClient.post('posts', { description, image, userId });
  //     return response.data;
  //   } catch (error) {
  //     console.error('API call error:', error);
  //     throw error;
  //   }

  // }






  if (!userId) {
    return (
      <View>
        <Text>Please login first</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>ChallengesScreen</Text>
    </View>
  )
}
export default ChallengesScreen