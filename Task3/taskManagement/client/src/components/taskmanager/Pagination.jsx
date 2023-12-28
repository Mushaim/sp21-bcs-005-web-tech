import React from 'react';
import styles from './styles.module.css';

const Pagination = ({ page, totalPages, setPage }) => {
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    const onClick = newPage => {
        setPage(newPage);
    };

    return (
        <div className={styles.container}>
            {pageNumbers.map(number => (
                <button
                    onClick={() => onClick(number)}
                    className={number === page ? `${styles.page_btn} ${styles.active}` : styles.page_btn}
                    key={number}
                >
                    {number}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
