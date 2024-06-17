import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button, Whisper, Tooltip } from "rsuite";

const Like = ({ blogId, likes, userId, handleLikes }) => {
  const LikeStatus = () => {
    if (likes?.length > 0) {
      return likes.find((id) => id.uid === userId) ? (
        <>
          <AiFillHeart size={24} />
          &nbsp;{likes.length}
        </>
      ) : (
        <>
          <AiOutlineHeart size={24} />
          &nbsp;{likes.length}
        </>
      );
    }
    return (
      <>
        <AiOutlineHeart size={24} />
      </>
    );
  };

  return (
    <span onClick={!userId ? null : handleLikes}>
      {!userId ? (
        <Whisper
          placement="top"
          trigger="hover"
          speaker={<Tooltip>Please login to like post</Tooltip>}
        >
          <Button className="rounded-bottom">
            <LikeStatus />
          </Button>
        </Whisper>
      ) : (
        <Button className="rounded-bottom">
          <LikeStatus />
        </Button>
      )}
    </span>
  );
};

export default Like;
