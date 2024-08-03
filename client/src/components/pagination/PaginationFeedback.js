// Pagination.js
import React from "react";

const PaginationFeedback = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    return (
        <div className="flex justify-center mt-4">
            <button
                className="px-4 py-2 mx-1 border rounded-md text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                «
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    className={`px-4 py-2 mx-1 border rounded-md ${
                        currentPage === i + 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}
            <button
                className="px-4 py-2 mx-1 border rounded-md text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                »
            </button>
        </div>
    );
};

export default PaginationFeedback;
