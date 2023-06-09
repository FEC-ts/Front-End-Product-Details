import react, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import ComparisonStar from '../icons/ComparisonStarSVG.jsx';
import RelatedItemRating from './RelatedItemRating.jsx';


export default function RelatedItem({itemId, setProduct_id}) {
  const [itemInfo, setItemInfo] = useState({});
  const [defaultStyle, setDefaultStyle] = useState({});
  const [defaultImgSrc, setDefaultImgSrc] = useState('');
  const [itemRating, setItemRating] = useState(0);
  const [itemReady, setItemReady] = useState([]);

  useEffect(()=>{
    setItemReady([])
    let url = '/products/' + itemId;

    axios.get(url)
      .then(result => {
        setItemInfo(result.data);
        setItemReady(itemReady => [...itemReady, result.data]);

      } )
      .catch(err => console.log(err));

    url = '/products/' + itemId + '/styles';

    axios.get(url)
      .then(result => {

        if(result.data.results.length === 1) {

          setDefaultStyle(result.data.results[0]);
          setDefaultImgSrc(result.data.results[0].photos[0].url)
        } else {

          for (var style of result.data.results) {
            if (style['default?']) {
              setDefaultStyle(style);
              setDefaultImgSrc(style.photos[0].url)

              break;
            }
          }
        }

        setItemReady(itemReady => [...itemReady, result.data]);


      } )
      .catch(err => console.log(err));

      url = '/reviews/meta';
      var params = {params:{product_id: itemId}}
      axios.get(url, params)
      .then(result => {

        var avgRating = 0;
        var count = 0;
        for(var i in result.data.ratings) {
          avgRating += i * result.data.ratings[i];
          count += parseInt(result.data.ratings[i]);
        }

        avgRating /= count;
        setItemRating(avgRating);

        setItemReady(itemReady => [...itemReady, result.data]);
      } )
      .catch(err => console.log(err));


  },[itemId]);

  var relatedItemIdList = 5;
  if (itemReady.length === 3) {



    return (
      <div className="relatedItems" onClick={()=>{setProduct_id(itemId)}}>

        <div className="relatedItemImagesDiv hoverPointer">
          <img className="relatedItemImages" src={defaultImgSrc} ></img>
        </div>

        <div className="itemInfo">
          <b style={{"wordWrap": "breakWord",
    "whiteSpace":"preWrap"}}>{itemInfo.name}</b>

          <p>{itemInfo.category}</p>

          {defaultStyle.sale_price ? (<p> ${defaultStyle.sale_price} <s style={{color: 'red'}}>${defaultStyle.original_price}</s> </p>) : (<p>${defaultStyle.original_price}</p>)}



          <div className="relatedItemRating">

            {itemRating !== 0? (<RelatedItemRating itemRating={itemRating}/>) : <p></p>}


          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="relatedItems" style={{"borderColor":"transparent"} }>
      <progress></progress>
    </div>
  )


}