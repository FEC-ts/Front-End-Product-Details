import react,  {useState, useEffect, useRef, useContext}from 'react';
import axios from 'axios';

import {InteractionAPIContext} from './../InteractionAPI.jsx';
export default function({currentStyle}){
  const [sizeObj, setSizeObj] = useState({});
  const [sizeArray, setSizeArray] =useState([]);
  const quantityRef = useRef();
  const sizeRef = useRef();

  const interactionAPI = useContext(InteractionAPIContext);

  useEffect(() => {

    if(currentStyle.style_id !== undefined) {
      setSizeObj({});
      var tempObj = {};
      setSizeArray([]);
      if(sizeRef.current !== undefined) {
        sizeRef.current.value = 'Select Size';
        setSelectedSize('Select Size');
      }

      for (var i in currentStyle.skus) {

        if (currentStyle.skus[i].quantity >= 1) {
          tempObj[currentStyle.skus[i].size] = {};
          tempObj[currentStyle.skus[i].size].quantity = currentStyle.skus[i].quantity;
          tempObj[currentStyle.skus[i].size].sku_id = i;

          let temp = currentStyle.skus[i].size;

          setSizeArray(sizeArray => [...sizeArray, temp]);

        }
      }
      setSizeObj(tempObj);


    }

  }, [currentStyle])


  const [selectedSize, setSelectedSize] = useState();

  const sizeSelectOnChange = (e) => {
    setSelectedSize(e.target.value);
    messageRef.current.style.visibility = 'hidden';
    sizeRef.current.size = 1;

      if(sizeRef.current.value === 'Select Size') {
        sizeRef.current.style.backgroundColor = "#613B6F"
      } else {
        sizeRef.current.style.backgroundColor = "#64B735"
      }

  }

  const [selectedSizeQuantity, setSelectedSizeQuantity] = useState(['-'])
  useEffect(()=> {
    if(selectedSize === 'Select Size') {
      quantityRef.current.disabled =true;
      setSelectedSizeQuantity(['-']);

      quantityRef.current.style.backgroundColor = "#613B6F"

      return;
    }
    if(quantityRef.current !== undefined) quantityRef.current.style.backgroundColor = "#64B735"

    if(Object.keys(sizeObj).length > 0) {
      quantityRef.current.disabled = false;


      if (sizeObj[selectedSize].quantity >= 15) {

        setSelectedSizeQuantity([]);
        for (var i = 1; i < 16; i++) {
          let temp = i;
          setSelectedSizeQuantity(selectedSizeQuantity => [...selectedSizeQuantity, temp]);
        }
      } else {
        setSelectedSizeQuantity([]);
        for (var i = 1; i <= sizeObj[selectedSize].quantity; i++) {
          let temp = i;
          setSelectedSizeQuantity(selectedSizeQuantity => [...selectedSizeQuantity, temp]);
        }
      }
      quantityRef.current.value = 1;
    }

  }, [selectedSize])

  const messageRef = useRef();



  const addToCartOnClick = (e) => {
    interactionAPI("Add To Cart Button", "Overview");

    console.log(sizeRef)

    if (sizeRef.current.value === 'Select Size') {

      sizeRef.current.size = 5;
      messageRef.current.style.visibility = 'visible';
    } else{

      let q = quantityRef.current.value;
      let id = sizeObj[selectedSize].sku_id;
      let temp = {sku_id: id};
      let url = '/cart';

      for (var i = 0; i < q; i++) {
        axios.post(url, temp)
          .then(result => console.log(result.data))
          .catch(err => console.log(err));
      }

    }

    axios.get('/cart')
    .then(result => console.log(result.data))
          .catch(err => console.log(err));


  };


  if (Object.keys(sizeObj).length > 0) {

    return (
      <>
       <div className="selectSizeMessageDiv" ref={messageRef} style={{visibility:"hidden"}}><p>Please select size</p></div>
      <div className="sizeDiv">
      <select className="sizeSelection" onChange={sizeSelectOnChange} ref={sizeRef}>
        <option   value="Select Size">Select Size</option>
        {
          sizeArray.map(i => {

            return (
              <option value={i}>{ 'size: ' + i}</option>
            )
          })
        }
      </select>

    </div>
    <br></br><br></br>
    <div >
      <div style={{display:"inline-block"}}>

      Quantity:&nbsp;
      </div>

    <div className="quantityDiv" style={{display:"inline-block"}}>
      <select className="quantitySelection" style={{"backgroundColor":"#613B6F"}} ref={quantityRef} disabled>
      {selectedSizeQuantity.map(e => {

          return (
            <option value={e}>{e}</option>
          )
        })}
      </select>
    </div>
    </div>
    <div >
      <input type='button' className="addToCartbuttonDiv" onClick={addToCartOnClick} value='Add To Cart'></input>
    </div>

      </>
    )

  }

  return ( <>

    <div className="sizeDiv">
      <select className="sizeSelection" disabled>
        <option value="OUT OF STOCK" >OUT OF STOCK</option>
      </select>

    </div>

    <div className="quantityDiv">
      <select className="quantitySelection" disabled>
        <option value="-" >-</option>
      </select>
    </div>


  </>



  )


}