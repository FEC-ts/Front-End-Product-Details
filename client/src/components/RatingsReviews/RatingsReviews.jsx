import React, { useEffect, useState } from 'react';
import ReviewsList from './ReviewsList.jsx';
import axios from 'axios';
import RatingBreakdown from './RatingBreakdown.jsx';


// John
// Remember sync and to GIT PULL
//--------------- NEEDS REVIEW FOR LOADING ICON


const RatingsReviews = ({productInfo}) => {

  const [sortSelection, setSortSelection] = useState('relevant');
  const [reviewInfo, setReviewInfo] = useState([]);
  const [reviewMetaData, setReviewMetaData] = useState({});
  const [filterSettings, setFilterSettings] = useState({});

  // PRODUCT ID Will need PASSED DOWN Later
  let product_id = productInfo.id;

  let reviewInfoRetriever = function (countNumber) {
    axios.get(reviewUrl, {
      params: {product_id: product_id, sort: sortSelection,
        count: countNumber, page: 1}
     })
     .then((result) => {
      setReviewInfo(result.data.results);
      // recursively call the info retriever until all reviews
      // are retrieved, no matter how high the number
      if (result.data.results.length === countNumber) {
        reviewInfoRetriever((countNumber * 2));
      }})
     .catch(err => console.log('ERROR OBTAINING REVIEWS:', err));
  }

  let reviewUrl = '/reviews/';
  useEffect(() => {
    if (productInfo) {
      // Set to page to any number that's reasonable for reviews
      reviewInfoRetriever(100);
    }
  }, [productInfo, sortSelection]);

  let reviewMetaDataUrl = '/reviews/meta'
  useEffect(() => {
    if (productInfo) {
      axios.get(reviewMetaDataUrl, {
        params: {product_id: product_id}
       })
       .then((result) => {
        setReviewMetaData(result.data);
        })
       .catch(err => console.log('ERROR OBTAINING REVIEWS:', err));
    }
  }, [productInfo]);

  // Metadata calculations
  let allRatings;
  let averageRatingOverall;
  let totalRatings;

  if (reviewMetaData.ratings) {
    totalRatings = 0;
    allRatings = reviewMetaData.ratings;
    for (let key in allRatings) {
      totalRatings = totalRatings + (Number(allRatings[key]))
    }
    averageRatingOverall = 0;
    for (let keyTwo in allRatings) {
      averageRatingOverall = averageRatingOverall
      + (Number(allRatings[keyTwo]) * keyTwo)
    }
    averageRatingOverall = averageRatingOverall/totalRatings;
  }

  let roundedAverageRatingOverall = (
    (Math.round(averageRatingOverall * 10))/10
  )

  let starArrayMaker = function (starRating) {
    let fullStarCount = Math.floor(starRating);
    let emptyStarCount = 4 - fullStarCount;
    let partialStar = starRating - fullStarCount;
    let starArray = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStarCount) {
        starArray[i] = 1;
      } else if(i === fullStarCount) {
        starArray[i] = partialStar;
      } else {
        starArray[i] = 0;
      }
    }
    return starArray;
  }

  let filteredReviews = [];

  if (Object.keys(filterSettings).length > 0) {
    reviewInfo.forEach((element) => {
      if (filterSettings[element.rating]) {
        filteredReviews.push(element);
      }
    });
  }


  let whetherFilteredReviewsAppear = function () {
    if (Object.keys(filterSettings).length > 0) {
      return filteredReviews;
    }
    return reviewInfo;
  }

  if (!productInfo) {
    return (
      <div>
        <progress></progress>
      </div>
    )
  }

  return(
    <div>
      <h1 className='RatingsReviewsTitle'>Ratings and Reviews</h1>

      <RatingBreakdown reviewMetaData={reviewMetaData} reviewInfo={reviewInfo} roundedAverageRatingOverall={roundedAverageRatingOverall} totalRatings={totalRatings} starArray={starArrayMaker(roundedAverageRatingOverall)}
      setFilterSettings={setFilterSettings} filterSettings={filterSettings}/>

      <ReviewsList reviewInfo={whetherFilteredReviewsAppear()} setSortSelection={setSortSelection} starArrayMaker={starArrayMaker}
      productInfo={productInfo} reviewMetaData={reviewMetaData}/>
    </div>
  )
};

export default RatingsReviews;