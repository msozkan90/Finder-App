import React from 'react';
import api from '../../services/api';
import { Button } from '@material-ui/core';

const LikeButton = ({ likedUserId }) => {
  const handleLike = async () => {
    try {
      const response = await api.post('/users/like', { likedUserId },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLike}>
      Like
    </Button>
  );
};

export default LikeButton;
