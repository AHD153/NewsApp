
import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);

        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);

        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - ADNews`;
        updateNews();
        // eslint-disable-next-line
    }, [])
    

    // const handlePrevClick = async () => {
    //     setPage(page-1);
    //     updateNews();
    // }
    
    // const handleNextClick = async () => {
    //     setPage(page+1);
    //     updateNews();
    // }


    const fetchMoreData = async () => {
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page+1);
        let data = await fetch(url);
        let parsedData = await data.json();

        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);

    };



        return (
            <>
                <h1 className='text-center' style={{ margin: "90px 0 35px 0"}}>ADNews - Top {capitalizeFirstLetter(props.category)}  Headlines</h1>
                {loading && <Spinner />}

                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row">

                            {/* In this if the loading occurs than the data will be showed otherwise not. */}
                            {/* {!loading && articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                        <NewsItem title={element.title} description={element.description} imageURL={element.urlToImage} newsURL={element.url} author={element.author} publishedAt={element.publishedAt} source={element.source.name} />
                        {/* <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,100):""} imageURL = {element.urlToImage} newsURL={element.url} /> */}

                            {/* </div>

})} */}


                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <NewsItem title={element.title} description={element.description} imageURL={element.urlToImage} newsURL={element.url} author={element.author} publishedAt={element.publishedAt} source={element.source.name} />
                                    {/* <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,100):""} imageURL = {element.urlToImage} newsURL={element.url} /> */}

                                </div>

                            })}
                        </div >
                    </div>

                </InfiniteScroll>

                {/* This is for previous and next buttons. */}

                {/* <div className="d-flex justify-content-between">
                    <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick} >&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick} >Next &rarr;</button>
                    
                </div> */}


            </>

        )
    
}

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
    author: 'ADN'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    author: PropTypes.string
}

export default News