import React, { useState, useEffect } from "react";
import { deletePost, getPosts } from "../api/post";
import PostCard from "./PostCard";
import { useSearch } from "../context/SearchProvider";
import { useNotification } from "../context/NotificationProvider";

let pageNo = 0;
const POST_LIMIT = 9;
const getPaginationCount = (length) => {
    const divison = length / POST_LIMIT
    if (divison % 1 !== 0) {
        return Math.floor(divison) + 1;
    }
    return divison;
};

export default function Home() {
    const { searchResult } = useSearch();
    const [posts, setPosts] = useState([]);
    const [totalPostCount, setTotalPostCount] = useState([]);

    const { updateNotification } = useNotification();

    const paginationCount = getPaginationCount(totalPostCount)
    const paginationArr = new Array(paginationCount).fill('')

    const fetchPosts = async () => {
        const { error, posts, postCount } = await getPosts(pageNo, POST_LIMIT);

        if (error) return updateNotification("error", error);

        setPosts(posts);
        setTotalPostCount(postCount);
    };

    useEffect(() => {
        fetchPosts();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMorePosts = (index) => {
        pageNo = index;
        fetchPosts();
    };

    const handleDelete = async ({ id }) => {
        const confirmed = window.confirm("Você tem certeza que deseja excluir?");
        if (!confirmed) return;

        const { error, message } = await deletePost(id);

        if (error) return updateNotification("error", error);
        updateNotification("success", message);

        const newPosts = posts.filter(p => p.id !== id);
        setPosts(newPosts);
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-3 pb-5">
                {searchResult.length
                    ? searchResult.map(post => {
                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDeleteClick={() => handleDelete(post)}
                            />
                        );
                    })
                    : posts.map((post) => {
                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDeleteClick={() => handleDelete(post)}
                            />
                        );
                    })}
            </div>
            {paginationArr.length > 1 && !searchResult.length ? (<div className="py-5 flex justify-center items-center
             space-x-3">
                {paginationArr.map((_, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => fetchMorePosts(index)}
                            className={
                                index === pageNo
                                    ? "text-blue-500 border-b-2 border-b-blue-500"
                                    : "text-gray-500"
                            }
                        >
                            {index + 1}

                        </button>
                    );
                })}
            </div>
            ) : null}
        </div>
    );
}