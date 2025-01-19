import React from 'react';
import PostStore from '../store/PostStore';

const PostSubmitButton = (props) => {
    const { isFormSubmit } = PostStore();

    if (!isFormSubmit) {
        return (
            <button
                onClick={props.onClick}
                type="submit"
                className={`${props.className} w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1`}
            >
                {props.text}
            </button>
        );
    } else {
        return (
            <button
                disabled={true}
                className="w-full px-4 py-2 text-white bg-purple-500 rounded-lg flex items-center justify-center cursor-not-allowed"
            >
                <div
                    className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"
                    role="status"
                ></div>
                Loading...
            </button>
        );
    }
};

export default PostSubmitButton;
